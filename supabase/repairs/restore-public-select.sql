-- Optional, owner-reviewed repair ONLY for confirmed missing SELECT grants on
-- an existing CGS schema. Never run on an unidentified or shared project.
-- Refuse to grant if RLS or the expected public-read policy is absent/changed.
-- Does not create tables, change policies, grant writes, or touch staff profiles.
begin;
do $$
declare t text; policy_name text; predicate text;
begin
  foreach t in array array['business_divisions','services','products','projects','industries','publications','careers','case_studies','website_settings'] loop
    policy_name := case when t='website_settings' then 'public_settings' else 'published_read' end;
    predicate := case when t='website_settings' then 'true' else 'published' end;
    if not exists (
      select 1 from pg_class c join pg_policy p on p.polrelid=c.oid
      where c.oid=to_regclass(format('public.%I',t)) and c.relrowsecurity
        and p.polname=policy_name and p.polcmd='r' and p.polpermissive
        and p.polroles='{0}'::oid[] and pg_get_expr(p.polqual,c.oid)=predicate
    ) then raise exception 'Unexpected schema or policy for public.%; stop and review.', t;
    end if;
    execute format('grant select on public.%I to anon, authenticated', t);
  end loop;
  grant usage on schema public to anon, authenticated;
end $$;
commit;
