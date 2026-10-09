-- 0002 · Dades d'usuari: ascensions sincronitzades, perfil mínim i supressió del compte
-- (docs/03-modelo-datos.md §1.2 i §2; bloc 5a, beta privada).
--
-- Independent de 0001 (catàleg): el catàleg viu als fitxers versionats
-- `src/lib/data/catalog/*.json` i encara no està carregat a la BD, així que `cim_id` no té FK
-- (es valida al client contra el catàleg; aquí només el rang). Quan el catàleg es carregui a
-- `public.cims`, una migració nova hi afegirà la FK (`not valid` + `validate`).
--
-- Model de sync (LWW per fila):
--   - `id` és l'UUIDv7 generat al client: pujar dues vegades la mateixa fila és idempotent.
--   - `updated_at` és el rellotge del client (el que compara la regla LWW).
--   - `server_updated_at` el posa un trigger amb `clock_timestamp()` a cada escriptura: és el
--     cursor del pull incremental.
--   - Els esborrats són làpides (`deleted_at`): no s'esborren físicament mentre hi hagi compte.
--   - Les escriptures del client passen per `sync_push` (security invoker: RLS aplicada), que
--     només sobreescriu si `updated_at` entrant > emmagatzemat (empat → es queda el servidor).

-- ---------------------------------------------------------------------------------------------
-- Tipus
-- ---------------------------------------------------------------------------------------------

-- Al client, `a-peu` (amb guió); la capa de sync fa la conversió.
create type public.metode as enum ('a_peu', 'btt', 'esqui', 'raquetes');

-- ---------------------------------------------------------------------------------------------
-- Ascensions
-- ---------------------------------------------------------------------------------------------

create table public.ascensions (
	id uuid primary key,                                   -- UUIDv7 del client
	user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
	cim_id smallint not null check (cim_id > 0),
	data date not null check (data >= date '2006-07-01'),  -- "no futura": a sync_push (zona Madrid)
	metode public.metode not null,
	nota text check (nota is null or char_length(nota) between 1 and 2000),
	created_at timestamptz not null,                       -- rellotge del client
	updated_at timestamptz not null,                       -- rellotge del client (LWW)
	deleted_at timestamptz,                                -- làpida
	server_updated_at timestamptz not null default clock_timestamp(), -- cursor del pull
	check (updated_at >= created_at),
	check (deleted_at is null or deleted_at <= updated_at)
);

comment on table public.ascensions is
	'Ascensions de l''usuari (seguiment personal; no és el registre oficial de la FEEC).';

create index ascensions_user_sync_idx on public.ascensions (user_id, server_updated_at);
create index ascensions_user_cim_idx on public.ascensions (user_id, cim_id);

create or replace function public.ascensions_server_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
	new.server_updated_at := clock_timestamp();
	return new;
end;
$$;

create trigger ascensions_server_updated_at
	before insert or update on public.ascensions
	for each row execute function public.ascensions_server_updated_at();

-- ---------------------------------------------------------------------------------------------
-- Perfil mínim (opcional: només un àlies)
-- ---------------------------------------------------------------------------------------------

create table public.perfils (
	user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
	alias text check (alias is null or char_length(btrim(alias)) between 1 and 40),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create or replace function public.perfils_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
	new.updated_at := now();
	return new;
end;
$$;

create trigger perfils_updated_at
	before update on public.perfils
	for each row execute function public.perfils_updated_at();

-- ---------------------------------------------------------------------------------------------
-- RLS estricta: cada usuari només veu i escriu les seves files
-- (`(select auth.uid())` perquè Postgres l'avaluï un cop per consulta, no per fila)
-- ---------------------------------------------------------------------------------------------

alter table public.ascensions enable row level security;
alter table public.perfils enable row level security;

create policy "propies: select" on public.ascensions for select to authenticated
	using (user_id = (select auth.uid()));
create policy "propies: insert" on public.ascensions for insert to authenticated
	with check (user_id = (select auth.uid()));
create policy "propies: update" on public.ascensions for update to authenticated
	using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "propies: delete" on public.ascensions for delete to authenticated
	using (user_id = (select auth.uid()));

create policy "propi: select" on public.perfils for select to authenticated
	using (user_id = (select auth.uid()));
create policy "propi: insert" on public.perfils for insert to authenticated
	with check (user_id = (select auth.uid()));
create policy "propi: update" on public.perfils for update to authenticated
	using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "propi: delete" on public.perfils for delete to authenticated
	using (user_id = (select auth.uid()));

-- Cap accés per a anon; authenticated, només el CRUD que filtra la RLS.
revoke all on public.ascensions, public.perfils from anon, public;
grant select, insert, update, delete on public.ascensions, public.perfils to authenticated;

-- ---------------------------------------------------------------------------------------------
-- sync_push: pujada en bloc amb LWW i validació (security invoker → la RLS s'aplica)
-- ---------------------------------------------------------------------------------------------
--
-- Entrada: array JSON de files { id, cimId, data, metode ('a-peu'…), nota, createdAt,
-- updatedAt, deletedAt } (màx. 500 per crida).
-- Sortida: { "acceptades": n, "rebutjades": [ { "id", "motiu" } ] }.
--   - "acceptades" inclou les que el servidor ja tenia iguals o més noves (LWW: no és un error).
--   - "rebutjades" són les que no passen la validació: el client les manté a la cua.

create or replace function public.sync_push(files jsonb) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
	uid uuid := auth.uid();
	f jsonb;
	v_id uuid;
	v_cim integer;
	v_data date;
	v_metode public.metode;
	v_nota text;
	v_created timestamptz;
	v_updated timestamptz;
	v_deleted timestamptz;
	avui_madrid date := (now() at time zone 'Europe/Madrid')::date;
	acceptades integer := 0;
	rebutjades jsonb := '[]'::jsonb;
begin
	if uid is null then
		raise exception 'no autenticat' using errcode = '42501';
	end if;
	if files is null or jsonb_typeof(files) <> 'array' then
		raise exception 'files ha de ser un array' using errcode = '22023';
	end if;
	if jsonb_array_length(files) > 500 then
		raise exception 'massa files (màx. 500)' using errcode = '54000';
	end if;

	for f in select value from jsonb_array_elements(files) loop
		begin
			v_id := (f ->> 'id')::uuid;
			v_cim := (f ->> 'cimId')::integer;
			v_data := (f ->> 'data')::date;
			v_metode := replace(f ->> 'metode', '-', '_')::public.metode;
			v_nota := nullif(btrim(f ->> 'nota'), '');
			v_created := (f ->> 'createdAt')::timestamptz;
			v_updated := (f ->> 'updatedAt')::timestamptz;
			v_deleted := (f ->> 'deletedAt')::timestamptz;

			if v_id is null or v_cim is null or v_data is null or v_metode is null
				or v_created is null or v_updated is null then
				raise exception using errcode = '22023', message = 'camps obligatoris';
			end if;
			if v_cim < 1 or v_cim > 32767 then
				raise exception using errcode = '22023', message = 'cimId fora de rang';
			end if;
			-- Marge d'un dia per a rellotges i fusos (el client ja valida amb Europe/Madrid).
			if v_data < date '2006-07-01' or v_data > avui_madrid + 1 then
				raise exception using errcode = '22023', message = 'data fora de rang';
			end if;
			if v_nota is not null and char_length(v_nota) > 2000 then
				raise exception using errcode = '22023', message = 'nota massa llarga';
			end if;
			if v_updated < v_created or (v_deleted is not null and v_deleted > v_updated) then
				raise exception using errcode = '22023', message = 'instants incoherents';
			end if;

			insert into public.ascensions as a
				(id, user_id, cim_id, data, metode, nota, created_at, updated_at, deleted_at)
			values
				(v_id, uid, v_cim::smallint, v_data, v_metode, v_nota, v_created, v_updated, v_deleted)
			on conflict (id) do update set
				cim_id = excluded.cim_id,
				data = excluded.data,
				metode = excluded.metode,
				nota = excluded.nota,
				updated_at = excluded.updated_at,
				deleted_at = excluded.deleted_at
			where a.user_id = uid and excluded.updated_at > a.updated_at;

			acceptades := acceptades + 1;
		exception
			when invalid_text_representation or invalid_parameter_value or datetime_field_overflow
				or invalid_datetime_format or numeric_value_out_of_range or check_violation
				or not_null_violation or insufficient_privilege then
				rebutjades := rebutjades || jsonb_build_object(
					'id', f ->> 'id',
					'motiu', sqlerrm
				);
		end;
	end loop;

	return jsonb_build_object('acceptades', acceptades, 'rebutjades', rebutjades);
end;
$$;

revoke execute on function public.sync_push(jsonb) from public, anon;
grant execute on function public.sync_push(jsonb) to authenticated;

-- ---------------------------------------------------------------------------------------------
-- esborrar_compte: dret de supressió (RGPD art. 17)
-- ---------------------------------------------------------------------------------------------
--
-- Security definer (cal per esborrar d'`auth.users`), però només actua sobre `auth.uid()` del
-- qui crida. Les dades d'usuari s'esborren explícitament i, a més, per cascada.

create or replace function public.esborrar_compte() returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	uid uuid := auth.uid();
begin
	if uid is null then
		raise exception 'no autenticat' using errcode = '42501';
	end if;
	delete from public.ascensions where user_id = uid;
	delete from public.perfils where user_id = uid;
	delete from auth.users where id = uid;
end;
$$;

revoke execute on function public.esborrar_compte() from public, anon;
grant execute on function public.esborrar_compte() to authenticated;

-- Les funcions de trigger no s'han de poder cridar per RPC.
revoke execute on function public.ascensions_server_updated_at() from public, anon, authenticated;
revoke execute on function public.perfils_updated_at() from public, anon, authenticated;
