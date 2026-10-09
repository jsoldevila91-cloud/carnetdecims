-- 0004 · esborrar_compte: la part `security definer` fora de l'esquema exposat
--
-- Advisor 0029 (authenticated_security_definer_function_executable): una funció security
-- definer a `public` es pot cridar per `/rest/v1/rpc/…`. Patró recomanat per Supabase: la part
-- amb privilegis va a un esquema privat (no exposat per l'API) i `public.esborrar_compte()`
-- passa a ser `security invoker` i la crida. La funció privada no rep cap paràmetre: només pot
-- esborrar el compte de qui crida (`auth.uid()`).

create schema if not exists privat;
revoke all on schema privat from public, anon;
grant usage on schema privat to authenticated;

create or replace function privat.esborrar_compte_propi() returns void
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
	delete from auth.users where id = uid; -- cascada: sessions, identitats, etc.
end;
$$;

revoke execute on function privat.esborrar_compte_propi() from public, anon;
grant execute on function privat.esborrar_compte_propi() to authenticated;

create or replace function public.esborrar_compte() returns void
language sql
security invoker
set search_path = ''
as $$
	select privat.esborrar_compte_propi();
$$;

revoke execute on function public.esborrar_compte() from public, anon;
grant execute on function public.esborrar_compte() to authenticated;
