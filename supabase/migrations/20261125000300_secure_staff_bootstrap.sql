-- Additive; works after the CLI baseline or reviewed adoption. No existing staff/data changed.
alter function public.is_admin() set search_path = '';
alter function public.is_super_admin() set search_path = '';
alter function public.log_audit() set search_path = '';
-- Client roles need DML subject to RLS, never privileges which bypass row policies.
do $$ declare t text; begin
  foreach t in array array['profiles','business_divisions','services','products','projects','project_categories','industries','careers','publications','case_studies','website_settings','applications','inquiries','partnerships','media_assets','audit_logs','form_limits'] loop
    execute format('revoke truncate, trigger, references on public.%I from public, anon, authenticated',t);
  end loop;
end $$;

create function public.protect_staff_identity() returns trigger language plpgsql set search_path='' as $$
begin
  if tg_op='DELETE' then
    if old.id=auth.uid() then raise exception 'Cannot revoke your own access'; end if;
    return old;
  end if;
  if new.id is distinct from old.id then raise exception 'Staff UID is immutable'; end if;
  if old.id=auth.uid() and new.role is distinct from old.role then raise exception 'Cannot change your own role'; end if;
  return new;
end $$;
create trigger protect_staff_identity before update or delete on public.profiles
 for each row execute function public.protect_staff_identity();

-- Keep a private one-time receipt: rerunning must not resurrect a deactivated owner.
create schema cgs_internal;
revoke all on schema cgs_internal from public,anon,authenticated;
create table cgs_internal.owner_receipt(singleton boolean primary key check(singleton), uid uuid not null);
revoke all on cgs_internal.owner_receipt from public,anon,authenticated;

create function public.cgs_bootstrapped_uid() returns uuid language sql stable security definer set search_path='' as $$
  select uid from cgs_internal.owner_receipt where singleton;
$$;
revoke all on function public.cgs_bootstrapped_uid() from public,anon,authenticated;
grant execute on function public.cgs_bootstrapped_uid() to service_role;

create function public.bootstrap_cgs_owner(expected_uid uuid, expected_email text, allow_promotion boolean default false)
returns uuid language plpgsql security definer set search_path='' as $$
declare account auth.users%rowtype; staff public.profiles%rowtype; receipt uuid;
begin
  -- Recheck identity in the SAME transaction as the grant; API verification alone races email changes.
  select * into strict account from auth.users where id=expected_uid for update;
  if expected_email is null or lower(account.email) is distinct from lower(expected_email)
    or account.email_confirmed_at is null or account.deleted_at is not null
    or account.banned_until > now() then raise exception 'Auth identity not eligible'; end if;
  lock table public.profiles in share row exclusive mode;
  select uid into receipt from cgs_internal.owner_receipt where singleton;
  select * into staff from public.profiles where id=expected_uid;
  if receipt is not null and (receipt<>expected_uid or staff.role is distinct from 'super_admin') then
    raise exception 'Owner bootstrap already consumed; use authorised staff management'; end if;
  if staff.id is not null and lower(staff.email)<>lower(expected_email) then raise exception 'Profile email mismatch'; end if;
  if staff.role is distinct from 'super_admin' then
    if exists(select from public.profiles where role='super_admin') then raise exception 'A different owner already exists'; end if;
    if staff.id is null then
      insert into public.profiles(id,email,role) values(expected_uid,account.email,'super_admin');
    elsif allow_promotion is true then
      update public.profiles set role='super_admin' where id=expected_uid;
    else raise exception 'Existing staff role: explicit initial promotion approval required'; end if;
  end if;
  insert into cgs_internal.owner_receipt values(true,expected_uid) on conflict(singleton) do nothing;
  return expected_uid;
end $$;
revoke all on function public.bootstrap_cgs_owner(uuid,text,boolean) from public,anon,authenticated;
grant execute on function public.bootstrap_cgs_owner(uuid,text,boolean) to service_role;
