-- ════════════════════════════════════════════════════════════════════
-- Cypher Green Systems (CGS) — Corporate Website Database Schema
-- Run in Supabase SQL Editor. Apply once to a new, independent Supabase project.
-- ════════════════════════════════════════════════════════════════════

-- ── Extensions ──────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Helper: updated_at trigger ──────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Roles ───────────────────────────────────────────────────────────
do $$ begin create type public.user_role as enum (
  'super_admin', 'administrator', 'content_manager', 'project_manager', 'editor'
); exception when duplicate_object then null; end $$;

-- ── Profiles (extends auth.users) ───────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'editor',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Business divisions ──────────────────────────────────────────────
create table if not exists public.business_divisions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short text,
  description text,
  capabilities text[] not null default '{}',
  icon text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Services ────────────────────────────────────────────────────────
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  division_id uuid references public.business_divisions(id) on delete set null,
  division_name text,
  summary text,
  problem text,
  scope text[] not null default '{}',
  deliverables text[] not null default '{}',
  industries text[] not null default '{}',
  technologies text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Products ────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  classification text,
  description text,
  features text[] not null default '{}',
  status text not null default 'Live' check (status in ('Live','Beta','In Development')),
  stack text[] not null default '{}',
  url text,
  logo_url text,
  accent text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Project categories ──────────────────────────────────────────────
create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

-- ── Projects ────────────────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  client text,
  category_id uuid references public.project_categories(id) on delete set null,
  category text,
  description text,
  problem text,
  objectives text[] not null default '{}',
  scope text[] not null default '{}',
  solution text,
  features text[] not null default '{}',
  technologies text[] not null default '{}',
  url text,
  featured boolean not null default false,
  ownership text not null default 'Client-commissioned'
    check (ownership in ('CGS-owned','Client-commissioned','Partnership')),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Case studies ────────────────────────────────────────────────────
create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  body text,
  results text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Industries ──────────────────────────────────────────────────────
create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  offerings text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Publications (articles / research / news) ───────────────────────
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  type text not null default 'Article'
    check (type in ('News','Article','Research Report','Insight')),
  category text,
  excerpt text,
  body text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  downloadable boolean not null default false,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Careers ─────────────────────────────────────────────────────────
create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  type text not null default 'Full-time'
    check (type in ('Full-time','Internship','Graduate','Research','Volunteer','Collaboration')),
  location text,
  summary text,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Applications ────────────────────────────────────────────────────
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  career_id uuid references public.careers(id) on delete set null,
  career_title text,
  applicant_name text not null,
  email text not null,
  phone text,
  cover_letter text,
  portfolio_url text,
  status text not null default 'New'
    check (status in ('New','In Review','Shortlisted','Rejected','Hired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Inquiries ───────────────────────────────────────────────────────
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'general'
    check (kind in ('general','quotation','consultation','partnership','service')),
  name text not null,
  email text not null,
  organisation text,
  subject text,
  message text not null,
  status text not null default 'New'
    check (status in ('New','In Review','Responded','Closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Partnerships ────────────────────────────────────────────────────
create table if not exists public.partnerships (
  id uuid primary key default gen_random_uuid(),
  partnership_type text,
  organisation text not null,
  contact_name text not null,
  email text not null,
  phone text,
  proposal text not null,
  status text not null default 'New'
    check (status in ('New','In Review','Responded','Closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Media & document library ────────────────────────────────────────
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  storage_path text unique,
  mime_type text,
  size_bytes bigint,
  kind text not null default 'image' check (kind in ('image','document','video','other')),
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── Website settings (key/value) ────────────────────────────────────
create table if not exists public.website_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── Audit logs ──────────────────────────────────────────────────────
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_email text,
  action text not null,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ── updated_at triggers ─────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','business_divisions','services','products','projects',
    'case_studies','industries','publications','careers','applications',
    'inquiries','partnerships','website_settings'
  ] loop
    execute format(
      'drop trigger if exists trg_updated_at on public.%I;
       create trigger trg_updated_at before update on public.%I
       for each row execute function public.set_updated_at();', t, t);
  end loop;
end $$;

-- ── Indexes ─────────────────────────────────────────────────────────
create index if not exists idx_services_published on public.services(published);
create index if not exists idx_products_published on public.products(published);
create index if not exists idx_projects_featured on public.projects(featured, published);
create index if not exists idx_publications_published on public.publications(published, published_at desc);
create index if not exists idx_inquiries_status on public.inquiries(status, created_at desc);
create index if not exists idx_applications_status on public.applications(status, created_at desc);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);
create index if not exists idx_audit_actor on public.audit_logs(actor_id);

-- ════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- Public: read published content, insert inquiries/applications.
-- Admin: full access via profiles.role (see helper below).
-- ════════════════════════════════════════════════════════════════════

create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('super_admin','administrator','content_manager','project_manager','editor')
  );
$$;

create or replace function public.is_super_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'super_admin'
  );
$$;

-- Enable RLS everywhere
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','business_divisions','services','products','project_categories',
    'projects','case_studies','industries','publications','careers',
    'applications','inquiries','partnerships','media_assets',
    'website_settings','audit_logs'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- Use the SAME resource matrix as lib/access.ts. No public profile creation or self-promotion.
create or replace function public.can_manage(resource text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.profiles where id=auth.uid() and (role='super_admin' or
 (role='administrator' and resource<>'profiles') or
 (role='editor' and resource in ('publications','media_assets')) or
 (role='project_manager' and resource in ('projects','case_studies','partnerships','media_assets')) or
 (role='content_manager' and resource in ('services','products','projects','careers','case_studies','business_divisions','industries','publications','media_assets'))));
$$;
alter table public.case_studies add column if not exists published boolean not null default false;
alter table public.project_categories add column if not exists published boolean not null default true;
alter table public.products add column if not exists screenshots text[] not null default '{}';
alter table public.projects add column if not exists screenshots text[] not null default '{}';
create policy profiles_own on public.profiles for select using (id=auth.uid());
create policy profiles_manage on public.profiles for all using(public.is_super_admin()) with check(public.is_super_admin());
do $$ declare t text; begin
 foreach t in array array['business_divisions','services','products','projects','project_categories','case_studies','industries','publications','careers'] loop
 execute format('create policy published_read on public.%I for select using (published)',t);end loop;
 foreach t in array array['business_divisions','services','products','projects','project_categories','case_studies','industries','publications','careers','inquiries','partnerships','applications','media_assets','website_settings'] loop
 execute format('create policy staff_manage on public.%I for all using(public.can_manage(%L)) with check(public.can_manage(%L))',t,t,t);end loop;
end $$;
create policy public_settings on public.website_settings for select using(true);
create policy audit_view on public.audit_logs for select using(public.can_manage('audit_logs'));
-- Intake is server-only: public API clients cannot bypass validation or throttling.
revoke insert on public.inquiries, public.partnerships, public.applications from anon,authenticated;
revoke insert, update, delete on public.audit_logs from anon,authenticated;
-- Audit trigger: record admin mutations
create or replace function public.log_audit()
returns trigger language plpgsql security definer as $$
declare actor_email text;
begin
  select email into actor_email from public.profiles where id = auth.uid();
  insert into public.audit_logs (actor_id, actor_email, action, entity, entity_id)
  values (auth.uid(), actor_email, TG_OP, TG_TABLE_NAME,
          coalesce(to_jsonb(new)->>'id',to_jsonb(old)->>'id',to_jsonb(new)->>'key',to_jsonb(old)->>'key'));
  return coalesce(new, old);
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'business_divisions','services','products','projects','industries',
    'publications','careers','applications','inquiries','partnerships',
    'website_settings','profiles','case_studies','media_assets','project_categories'
  ] loop
    execute format(
      'drop trigger if exists trg_audit on public.%I;
       create trigger trg_audit after insert or update or delete on public.%I
       for each row execute function public.log_audit();', t, t);
  end loop;
end $$;

-- ── Storage bucket for media library ────────────────────────────────
insert into storage.buckets (id, name, public,file_size_limit,allowed_mime_types)
values ('media', 'media', true,5242880,array['image/png','image/jpeg','image/webp','application/pdf'])
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select
  using (bucket_id = 'media');
-- Only the validated media endpoint writes objects via the server-only client.

alter table public.publications add column if not exists document_url text;
create view public.articles with (security_invoker=true) as select * from public.publications where type in ('Article','News','Insight');
create view public.roles as select unnest(enum_range(null::public.user_role)) as role;
-- Atomic fixed-window rate limits shared across all server instances. Store hashes, not IPs.
create table public.form_limits (bucket text primary key, window_start timestamptz not null, hits int not null);
alter table public.form_limits enable row level security;
create function public.take_form_slot(bucket_key text,max_hits int) returns boolean language plpgsql security definer set search_path='' as $$
declare n int; t timestamptz:=date_trunc('minute',now());begin
 delete from public.form_limits where window_start<t-interval '2 minutes';
 insert into public.form_limits values(bucket_key,t,1) on conflict(bucket) do update set window_start=t,hits=case when form_limits.window_start=t then form_limits.hits+1 else 1 end returning hits into n;
 return n<=max_hits;end $$;
revoke all on function public.take_form_slot(text,int) from public,anon,authenticated;
grant execute on function public.take_form_slot(text,int) to service_role;
alter table public.products add constraint product_url_https check(url is null or url ~ '^https://');
alter table public.projects add constraint project_url_https check(url is null or url ~ '^https://');
alter table public.publications add constraint doc_url_https check(document_url is null or document_url='' or document_url ~ '^https://');
-- Explicit Data API grants; RLS still decides which rows a grant can reach.
grant usage on schema public to anon, authenticated, service_role;
grant select on public.business_divisions,public.services,public.products,public.project_categories,public.projects,public.case_studies,public.industries,public.publications,public.articles,public.roles,public.careers,public.website_settings to anon,authenticated;
grant select,insert,update,delete on public.business_divisions,public.services,public.products,public.project_categories,public.projects,public.case_studies,public.industries,public.publications,public.careers,public.website_settings,public.profiles,public.media_assets to authenticated;
grant select,update,delete on public.applications,public.partnerships,public.inquiries to authenticated;
grant select on public.audit_logs to authenticated;
grant select,insert,update,delete on all tables in schema public to service_role;
-- Keep the human-readable division label consistent when an administrator renames it.
create function public.sync_division_label() returns trigger language plpgsql set search_path='' as $$begin
 if new.name is distinct from old.name then update public.services set division_name=new.name where division_id=new.id;end if;return new;end $$;
create trigger sync_division_name after update of name on public.business_divisions for each row execute function public.sync_division_label();
