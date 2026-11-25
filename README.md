# Cypher Green Systems

**Technology. Environment. Opportunity.** Corporate website and administration workspace for CGS. This repository is independent of Cypher Terra and the product deployments it links to.

## Run locally

Use Node.js 22 and npm. Run `npm ci` and `npm run dev`. The public website works with the included catalogue; no credentials are needed to browse. Without Supabase, staff sign-in is disabled and submission endpoints return an explicit **503** rather than losing a request or logging personal details.

## What is here

- Next.js App Router, TypeScript, Tailwind, native CSS motion, Lucide and self-hosted fonts. The interactive orthographic globe supports pointer dragging and keyboard rotation; there is no third-party map token or tile dependency.
- Twelve public sections, six divisions, fourteen service profiles, four product profiles, six separate commissioned projects, ten industries and searchable publications. Product and project pages support live previews and screenshot galleries. No invented vacancies, staff profiles, contact addresses or social accounts are required.
- Supabase Auth, PostgreSQL, Storage, RLS, audit triggers, server-validated intake, shared database throttling and optional Resend notifications. `publications` holds news, articles, research and insights; `articles` is a security-invoker view. Role values are constrained by an enum and exposed through the `roles` view.
- Independent `/techy` workspace: catalogue CRUD, publishing and featured placement, case notes, media/document uploads, applications and inquiry review, user access, settings and audit history. **Settings & Audit → Page / …** edits public page copy. Website settings also control SEO, navigation, footer links, confirmed email, office location and social profiles. Changes are read from the published database without rebuilding.
- Per-page metadata, Open Graph artwork, Organization and Service structured data, sitemap, robots and Vercel Analytics.

## Production setup

1. Create a **dedicated** Supabase project; do not run these SQL files against a product or client database. Apply [the setup guide](supabase/README.md), including the seed and first staff profile.
2. Import **this repository** as a new Vercel Next.js project. Set Node 22, `npm ci` as install command and `npm run build` as build command. Set environment variables from `.env.example` in the Vercel project settings before building. Preview deployments should use a separate staging database, not live client inquiries.
3. Set `NEXT_PUBLIC_SITE_URL` to the confirmed HTTPS origin. Enable Web Analytics for the project. To send notifications, configure a verified Resend sender, API key and monitored recipient. No credentials belong in Git.
4. Review seed copy and approve which services may be offered, including locally required qualifications. Confirm deployment destinations, product status and client disclosure permissions. Add only authorised screenshots and media. No vacancies are published until entered by an authorised staff member.
5. Deploy a preview and complete the checks below. Promote the tested deployment in Vercel only after sign-off; keep the previous deployment available for rollback. For a database change, back up first and use a reviewed forward migration. **Do not rerun the bootstrap schema.**

## Verification

```sh
npm run typecheck
npm test              # real PostgreSQL semantics via local PGlite; Supabase identity/storage schemas are test fixtures
npm run build
npm start             # separate terminal, local read-only preview (no Supabase variables)
npm run smoke         # crawl sitemap and internal links, verify destinations, admin redirects and API responses
npm audit --omit=dev
```

GitHub Actions runs the type, database, build and local smoke suites on pushes and pull requests. `npm run seed:generate` regenerates non-overwriting bootstrap inserts from `lib/data.ts`; never use it to replace live content.

**Hosted acceptance:** Sign in with each of the five roles against staging. Create a draft service, update it, publish and unpublish it, checking the directory, detail route and sitemap each time. Upload an approved image and PDF and reject a mismatched upload. Submit one inquiry, proposal and application against a real staged vacancy; verify stored fields, notification delivery, staff review and audit entries. Check all ten external sites in a browser (their uptime, content and frame policies are controlled by their operators). Confirm mobile navigation, canonical URL, Search Console and Analytics on the final domain. The local checks do not substitute for hosted Auth, deliverability or a Vercel production deployment.

## Content and assets

The supplied product/project directory determines inclusion and classification. Technical details for Kingangi Hotel, View Point Inn, Cypher FX and Chalar Farm Inventory were cross-checked against the corresponding public repositories under `Cypher-techy`. Unconfirmed product stacks are omitted. See `public/brand/CREDITS.md` and `public/atlas/CREDITS.md` for the existing CGS mark and globe imagery.

## Design and interaction conventions

Light mode is the default. The masthead and admin theme switches persist `cgs-theme` locally; documents read it before first paint. Use the `mist`, `surface`, `fog`, `ink`, `slate2`, `action` and `line` tokens for theme-dependent surfaces and text. Fixed forest/charcoal panels use light foregrounds in both themes. Product screenshots and scientific imagery keep their own colors, rather than being inverted in dark mode.

Field plates switch manually between landscape photography and an on-demand globe. Native scrolling, one-time content reveals and scroll-snap rails avoid animation-library overhead, scroll hijacking and autoplay. Reduced motion disables transitions and smooth scrolling. Hero parallax is limited to fine-pointer desktop devices with sufficient resources. Photography, diagrams and interface capture provenance are documented in `public/field`, `public/atlas`, `public/portfolio` and `public/brand`.
