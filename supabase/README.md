# Supabase setup

Use a new, dedicated Supabase project. `schema.sql` is a **one-time bootstrap**, not an upgrade script. Apply it in the SQL editor, then apply `seed.sql`. The seed skips existing slugs. With no seed, the connected public catalogue correctly starts empty. There is no fallback that could republish withdrawn records.

## First administrator

Disable public Auth sign-ups. In Authentication → Users create a confirmed staff account with a strong unique password. In the SQL editor, substitute that account's actual UUID:

```sql
insert into public.profiles(id,email,full_name,role)
select id,email,'Super Administrator','super_admin'
from auth.users where id = '<confirmed-user-uuid>'::uuid;
```

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (also accepts `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and the **server-only** `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` or Vercel. For Vercel, set the variables on the project serving the site and for the intended environment (Production or Preview), then redeploy. Public settings are embedded at build time. A connected integration alone does not configure an existing build. A service-role key is not required for staff sign-in; never place a secret/service-role key in any `NEXT_PUBLIC_` variable. Visit `/techy/login`. There are no demo credentials or bypass cookies. Super administrators can create further accounts and grant or revoke access in **User roles**. Removing the profile revokes dashboard access even if an Auth session remains valid.

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

## Production incident checklist (no database credentials in chat or Git)

1. In **the Vercel project that owns the live domain**, check Settings → Git → Production Branch (`main`), the deployment SHA, and **Production** environment scope. The other Vercel project and Preview scope have independent variables. Set `NEXT_PUBLIC_SITE_URL` to the actual absolute HTTPS site origin, and the public URL + publishable key from the **same corporate** Supabase project. Redeploy a new build after changing these. Never use a Postgres connection string, a REST URL ending `/rest/v1`, or a secret key for browser configuration. No `DATABASE_URL` is used.
2. With those environment variables available in a trusted local shell (or `.env.local`), run `npm run supabase:check` using Node 22.18+. Compare the reported host with the project in Supabase Dashboard. This is a read-only public-key probe: no profile reads, passwords, returned values or keys are printed. It checks all nine resources with their expected columns, the case-study relation, and the email provider setting. Zero visible rows is not a connectivity error and is not proof a policy is correct.
3. Interpret the HTTP status and machine code before changing SQL. HTTP 0: network/DNS/timeout or malformed settings. 401: check key, URL pairing and project status. `PGRST205`/`42P01`: missing or unexposed table/schema or stale schema cache. `42703`/`PGRST204`: missing column. `PGRST200`: missing/unrecognized relationship. `42501`: check grants **and** policies. Confirm the **Data API is enabled** and `public` is exposed. These are possible causes, not conclusions based on a failed build alone.
4. Run **`supabase/check-production.sql`** in the intended project's SQL editor. Compare the tables, columns, SELECT grants, RLS and policy expressions with `schema.sql`. On a verified new dedicated database, apply the checked-in transactional baseline once; only seed approved content. On an existing or partial installation, **do not replay the baseline, disable RLS, overwrite records or grant anonymous writes**. Back up and prepare a reviewed additive migration against the specific differences found. If the inventory confirms **only public read grants are missing**, review `repairs/restore-public-select.sql`; it reapplies SELECT and schema USAGE transactionally, checks the expected RLS policy first and refuses an incompatible baseline. Missing policies or other drift need a schema-specific migration. No automatic migrations run on build/deploy.
5. In Auth settings enable email/password, disable public signup, confirm the approved user and their matching `profiles.id` and role. Set the Auth Site URL to the actual production origin and limit allowed redirects to approved URLs. This app uses password sign-in with SSR session cookies and relative redirects (`/techy/login` → `/techy/dashboard`); it does not use OAuth or require a callback route. Test on the live domain: sign in, reload a permitted module, try a forbidden module with a limited role, sign out, then revisit `/techy/dashboard` and confirm the login redirect. Do not supply administrator credentials in an issue or chat.
6. Verify `/sitemap.xml` and a published detail URL on the intended deployment. Public layout and sitemap read at **request time**; the root 404 uses static default metadata. Only unconfigured non-production previews use the bundled catalogue. In a connected deployment primary directory failures reach the error boundary, optional sections omit unavailable rows, and the sitemap does not invent URLs for unreadable collections. Server logs include only resource, HTTP status and a sanitized code. A green build is not proof that live reads or staff access succeeded.
