-- Read-only inventory. Run on the confirmed CGS project, not a product database.
-- A successful REST request alone cannot distinguish empty data from RLS filtering.
with expected(name) as (values ('business_divisions'),('services'),('products'),('projects'),
 ('industries'),('publications'),('careers'),('website_settings'),('case_studies'),('profiles'))
select name, c.oid is not null as present, c.relrowsecurity as rls_enabled,
 has_table_privilege('anon',c.oid,'SELECT') as anon_select,
 has_table_privilege('authenticated',c.oid,'SELECT') as authenticated_select
from expected left join pg_class c on c.oid=to_regclass(format('public.%I',name));
select tablename,policyname,roles,cmd,qual,with_check from pg_policies
where schemaname='public' order by tablename,policyname;
-- Compare deployed columns (especially published, sort_order, division_name,
-- published_at, screenshots and case_studies.project_id) with schema.sql.
select table_name,column_name,data_type,is_nullable from information_schema.columns
where table_schema='public' order by table_name,ordinal_position;
