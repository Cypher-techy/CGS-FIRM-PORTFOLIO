# Supabase setup

Use a new, dedicated Supabase project. `schema.sql` is a **one-time bootstrap**, not an upgrade script. Apply it in the SQL editor, then apply `seed.sql`. The seed skips existing slugs. With no seed, the connected public catalogue correctly starts empty. There is no fallback that could republish withdrawn records.

## First administrator

Disable public Auth sign-ups. In Authentication → Users create a confirmed staff account with a strong unique password. In the SQL editor, substitute that account's actual UUID:

```sql
insert into public.profiles(id,email,full_name,role)
select id,email,'Super Administrator','super_admin'
from auth.users where id = '<confirmed-user-uuid>'::uuid;
```

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the **server-only** `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` or Vercel. Rebuild after changing public environment variables. Visit `/admin/login`. There are no demo credentials or bypass cookies. Super administrators can create further accounts and grant or revoke access in **User roles**. Removing the profile revokes dashboard access even if an Auth session remains valid.

## Staff permissions

| Role | Scope |
|---|---|
| Super Administrator | All modules, including staff account creation and role assignment |
| Administrator | All catalogue, intake, media, settings and audit modules; no role management |
| Content Manager | Divisions, industries, services, products, projects, cases, vacancies, publications and media; no applications or inquiries |
| Project Manager | Projects, case studies, partnership proposals and media |
| Editor | Publications and media |

RLS is the enforcement boundary, independent of menu visibility. Public visitors can read published catalogue rows and public website settings. Never store secrets in website settings. Intake inserts are **not granted to anonymous or ordinary authenticated clients**. The validated Next.js endpoints store submissions with a server-only client, check shared database rate-limit windows and optionally notify staff. Notifications contain no submission text. Configure trusted forwarding headers at your deployment edge; never expose the origin behind an untrusted proxy.

Only authorised staff can upload JPEG, PNG or PDF files up to 4 MB; the server checks size, MIME and signatures and uses generated object paths. The `media` bucket is public: use it only for approved public material, never applicant CVs or private evidence. Copy the media URL into a platform screenshot list or publication document field. Use the Auth dashboard for recovery and account deactivation, configure backups and monitor storage, rate limits and email delivery.
