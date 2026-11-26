-- Assertions, not just an inventory report. Run with psql ON_ERROR_STOP.
begin read only;
do $$ declare t text; begin
 foreach t in array array['business_divisions','services','products','projects','project_categories','industries','careers','publications','case_studies','website_settings','profiles','applications','inquiries','partnerships','media_assets','audit_logs','form_limits'] loop
   if not exists(select from pg_class c where c.oid=to_regclass(format('public.%I',t)) and c.relrowsecurity) then raise exception 'Missing table/RLS: %',t; end if;
   if has_table_privilege('authenticated',format('public.%I',t),'TRUNCATE') or has_table_privilege('anon',format('public.%I',t),'TRUNCATE') then raise exception 'Unexpected client truncate grant: %',t;end if;
 end loop;
 if has_function_privilege('anon','public.bootstrap_cgs_owner(uuid,text,boolean)','execute') or has_function_privilege('authenticated','public.bootstrap_cgs_owner(uuid,text,boolean)','execute') or not has_function_privilege('service_role','public.bootstrap_cgs_owner(uuid,text,boolean)','execute') then raise exception 'Unsafe bootstrap function grants'; end if;
 if exists(select from pg_policies where schemaname='public' and tablename='profiles' and permissive='PERMISSIVE' and cmd<>'SELECT' and not
   (policyname='profiles_manage' and cmd='ALL' and replace(qual,'public.','')='is_super_admin()' and replace(with_check,'public.','')='is_super_admin()')) then raise exception 'Unexpected permissive staff write policy'; end if;
 if not exists(select from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_manage' and cmd='ALL') then raise exception 'Missing role management policy'; end if;
 if not exists(select from pg_trigger where tgrelid='public.profiles'::regclass and tgname='protect_staff_identity' and tgenabled in ('O','A')) then raise exception 'Missing staff identity protection'; end if;
 if not exists(select from storage.buckets where id='media' and public) then raise exception 'Expected media bucket missing'; end if;
end $$;
set local role anon;
-- Exercise actual SELECT grants and assert no drafts/staff rows are visible.
do $$ declare t text; leaked boolean; begin
 foreach t in array array['business_divisions','services','products','projects','project_categories','industries','careers','publications','case_studies'] loop
   execute format('select exists(select from public.%I where not published)',t) into leaked;
   if leaked then raise exception 'Anonymous draft visibility: %',t; end if;
 end loop;
 perform key,value from public.website_settings limit 1;
 if public.is_super_admin() or public.can_manage('profiles') then raise exception 'Anonymous administrative access'; end if;
end $$;
rollback;
