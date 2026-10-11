-- 0005 · Diari de muntanya (companys) i municipi d'origen (bloc R1)
--
-- Només afegeix (cap columna ni funció existent canvia de forma) i és idempotent: es pot tornar
-- a executar sense efecte. Ordre de desplegament: **primer aquesta migració, després el client**.
--
--   1. `public.ascensions.companys text[]`: companys de l'ascensió (noms o àlies en text lliure;
--      dades de terceres persones, protegides per la mateixa RLS que la resta de la fila).
--   2. `public.sync_push`: accepta `companys` i el desa.
--   3. `public.perfils.origen_municipi` / `origen_updated_at`: municipi d'origen com a
--      preferència del compte, amb LWW per l'instant del client.
--   4. `public.sync_origen`: llegeix i (si cal) desa el municipi d'origen amb LWW.
--
-- Compatibilitat amb el client antic (PWA instal·lades amb el client anterior a la caché):
--   - `sync_push` sense la clau `companys` a la fila: en una fila nova, `companys` queda buit; en
--     una fila existent, **es conserven els companys desats**. Amb la clau present (també `[]` o
--     `null`), mana el client. Així, editar la nota des d'un dispositiu amb el client antic no
--     esborra els companys posats des d'un altre.
--   - El pull del client antic demana les columnes pel nom (sense `companys`): no canvia.
--   - `esborrar_compte` (0004) ja esborra `ascensions` i `perfils` sencers: no cal tocar-lo.
--
-- La RLS no canvia: les polítiques de 0002 són per fila (`user_id = auth.uid()`) i cobreixen les
-- columnes noves.

-- ---------------------------------------------------------------------------------------------
-- 1. Companys de l'ascensió
-- ---------------------------------------------------------------------------------------------

-- Validació de la llista (per al check de la taula i per a `sync_push`). El client limita a 10
-- noms de 40 caràcters; aquí el límit és més ample (20 de 80), com amb la nota (500 al client,
-- 2000 aquí), per poder ampliar el del client sense cap migració. A l'esquema `privat` (0004):
-- no s'exposa per l'API. Cal `execute` per a qui escrigui a la taula (el check s'avalua amb els
-- permisos de qui escriu).
create or replace function privat.companys_valids(c text[]) returns boolean
language sql
immutable
parallel safe
set search_path = ''
as $$
	select c is not null
		and coalesce(array_ndims(c), 1) = 1
		and cardinality(c) <= 20
		and not exists (
			select 1
			from unnest(c) as e (nom)
			where e.nom is null
				or e.nom <> btrim(e.nom)
				or char_length(e.nom) not between 1 and 80
		);
$$;

revoke execute on function privat.companys_valids(text[]) from public, anon;
grant execute on function privat.companys_valids(text[]) to authenticated, service_role;
grant usage on schema privat to service_role;

-- Columna amb valor per defecte constant: Postgres no reescriu la taula ni dispara el trigger de
-- `server_updated_at` (les files existents no "canvien" per al pull).
alter table public.ascensions
	add column if not exists companys text[] not null default '{}';

comment on column public.ascensions.companys is
	'Companys de l''ascensió (noms o àlies en text lliure, normalitzats al client). Dades de tercers.';

do $$
begin
	if not exists (
		select 1 from pg_constraint
		where conname = 'ascensions_companys_check' and conrelid = 'public.ascensions'::regclass
	) then
		alter table public.ascensions
			add constraint ascensions_companys_check check (privat.companys_valids(companys));
	end if;
end;
$$;

-- ---------------------------------------------------------------------------------------------
-- 2. sync_push amb companys (la resta, igual que a 0003)
-- ---------------------------------------------------------------------------------------------
--
-- Entrada: array JSON de files { id, cimId, data, metode ('a-peu'…), nota, companys?, createdAt,
-- updatedAt, deletedAt } (màx. 500 per crida). `companys` és un array de text; cada nom es
-- retalla (`btrim`) i els buits es descarten.

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
	v_companys text[];
	v_te_companys boolean;
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

			-- Companys: la clau absent (client antic, o fila que el client no ha desat mai amb
			-- companys) no en diu res; present, mana (`null` i `[]` = sense companys).
			v_te_companys := f ? 'companys';
			v_companys := '{}';
			if v_te_companys and jsonb_typeof(f -> 'companys') <> 'null' then
				if jsonb_typeof(f -> 'companys') <> 'array' then
					raise exception using errcode = '22023', message = 'companys invàlids';
				end if;
				if exists (
					select 1 from jsonb_array_elements(f -> 'companys') as e (valor)
					where jsonb_typeof(e.valor) <> 'string'
				) then
					raise exception using errcode = '22023', message = 'companys invàlids';
				end if;
				select coalesce(array_agg(t.nom order by t.ordre), '{}')
				into v_companys
				from (
					select btrim(e.valor #>> '{}') as nom, e.ordre
					from jsonb_array_elements(f -> 'companys') with ordinality as e (valor, ordre)
				) as t
				where t.nom <> '';
				if not privat.companys_valids(v_companys) then
					raise exception using errcode = '22023', message = 'companys invàlids';
				end if;
			end if;

			insert into public.ascensions as a
				(id, user_id, cim_id, data, metode, nota, companys, created_at, updated_at, deleted_at)
			values
				(v_id, uid, v_cim::smallint, v_data, v_metode, v_nota, v_companys, v_created, v_updated,
					v_deleted)
			on conflict (id) do update set
				cim_id = excluded.cim_id,
				data = excluded.data,
				metode = excluded.metode,
				nota = excluded.nota,
				companys = case when v_te_companys then excluded.companys else a.companys end,
				updated_at = excluded.updated_at,
				deleted_at = excluded.deleted_at
			where a.user_id = uid and excluded.updated_at > a.updated_at;

			-- Sense fila escrita: o el servidor ja tenia una versió igual o més nova (LWW, cas
			-- normal) o l'id és d'un altre usuari (invisible per la RLS): aquest cas es rebutja.
			if not found and not exists (select 1 from public.ascensions where id = v_id) then
				raise exception using errcode = '22023', message = 'id en ús';
			end if;

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
-- 3. Municipi d'origen (preferència del compte)
-- ---------------------------------------------------------------------------------------------
--
-- `origen_municipi`: codi del municipi (CODIMUNI de l'ICGC, 6 xifres; `ad:{slug}` per a les
-- parròquies d'Andorra; `cn:{slug}` per a la Catalunya Nord). Aquí només se'n valida el format:
-- el conjunt de municipis viu al client (`src/lib/data/municipis/`). `null` = sense origen.
-- `origen_updated_at`: instant del client de l'últim canvi (regla LWW); `null` = no s'ha desat
-- mai. Treure l'origen deixa `origen_municipi = null` amb `origen_updated_at` informat, perquè
-- el canvi també es propagui als altres dispositius.
-- És una dada personal: només el municipi, mai l'adreça. S'esborra amb el perfil (`esborrar_compte`).

alter table public.perfils
	add column if not exists origen_municipi text,
	add column if not exists origen_updated_at timestamptz;

comment on column public.perfils.origen_municipi is
	'Municipi d''origen (codi ICGC, o ad:/cn: fora de Catalunya). Preferència opcional; dada personal.';
comment on column public.perfils.origen_updated_at is
	'Instant del client de l''últim canvi del municipi d''origen (LWW).';

do $$
begin
	if not exists (
		select 1 from pg_constraint
		where conname = 'perfils_origen_municipi_check' and conrelid = 'public.perfils'::regclass
	) then
		alter table public.perfils
			add constraint perfils_origen_municipi_check check (
				origen_municipi is null
				or origen_municipi ~ '^([0-9]{6}|(ad|cn):[a-z0-9]+(-[a-z0-9]+)*)$'
					and char_length(origen_municipi) <= 40
			);
	end if;
	if not exists (
		select 1 from pg_constraint
		where conname = 'perfils_origen_coherent_check' and conrelid = 'public.perfils'::regclass
	) then
		-- Un municipi sempre porta l'instant del canvi.
		alter table public.perfils
			add constraint perfils_origen_coherent_check check (
				origen_municipi is null or origen_updated_at is not null
			);
	end if;
end;
$$;

-- ---------------------------------------------------------------------------------------------
-- 4. sync_origen: llegir i desar el municipi d'origen amb LWW (security invoker → RLS)
-- ---------------------------------------------------------------------------------------------
--
-- Entrada: `canvi` = { "codi": text | null, "updatedAt": instant } o res (només llegir).
-- Amb `canvi`, crea el perfil si no existia i el desa només si és més recent que el desat
-- (empat → es queda el servidor). Sortida: l'estat que queda al servidor,
-- { "codi": text | null, "updatedAt": instant }, o `null` si el compte no n'ha desat mai cap.

create or replace function public.sync_origen(canvi jsonb default null) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
	uid uuid := auth.uid();
	v_codi text;
	v_updated timestamptz;
	r_codi text;
	r_updated timestamptz;
begin
	if uid is null then
		raise exception 'no autenticat' using errcode = '42501';
	end if;

	if canvi is not null and jsonb_typeof(canvi) <> 'null' then
		if jsonb_typeof(canvi) <> 'object' then
			raise exception 'canvi ha de ser un objecte' using errcode = '22023';
		end if;
		v_codi := nullif(btrim(canvi ->> 'codi'), '');
		v_updated := (canvi ->> 'updatedAt')::timestamptz;
		if v_updated is null then
			raise exception 'updatedAt obligatori' using errcode = '22023';
		end if;
		if v_codi is not null and (
			char_length(v_codi) > 40
			or v_codi !~ '^([0-9]{6}|(ad|cn):[a-z0-9]+(-[a-z0-9]+)*)$'
		) then
			raise exception 'codi de municipi invàlid' using errcode = '22023';
		end if;

		insert into public.perfils as p (user_id, origen_municipi, origen_updated_at)
		values (uid, v_codi, v_updated)
		on conflict (user_id) do update set
			origen_municipi = excluded.origen_municipi,
			origen_updated_at = excluded.origen_updated_at
		where p.user_id = uid
			and (p.origen_updated_at is null or excluded.origen_updated_at > p.origen_updated_at);
	end if;

	select p.origen_municipi, p.origen_updated_at
	into r_codi, r_updated
	from public.perfils as p
	where p.user_id = uid;

	if r_updated is null then
		return null;
	end if;
	return jsonb_build_object('codi', r_codi, 'updatedAt', r_updated);
end;
$$;

revoke execute on function public.sync_origen(jsonb) from public, anon;
grant execute on function public.sync_origen(jsonb) to authenticated;

-- PostgREST: que vegi de seguida la funció i les columnes noves.
notify pgrst, 'reload schema';
