-- 0003 · sync_push: rebutja els ids que ja són d'un altre usuari
--
-- A 0002, si l'id d'una fila pujada ja existia i era d'un altre usuari, l'`on conflict … where`
-- no escrivia res i la fila comptava com a acceptada: el client la treia de la cua i no arribava
-- mai al núvol. Amb UUIDv7 generats al client no hauria de passar mai, però ara es rebutja
-- ('id en ús') i el client la manté a la cua.

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
