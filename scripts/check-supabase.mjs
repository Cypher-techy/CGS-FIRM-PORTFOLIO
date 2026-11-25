// Read-only diagnostic: no passwords, service client, writes, or raw responses.
import { createClient } from "@supabase/supabase-js";
import nextEnv from "@next/env";
import { publicSupabaseConfig } from "../lib/supabase/public-config.ts";
nextEnv.loadEnvConfig(process.cwd());
const { url, key } = publicSupabaseConfig();
if (!url || !key) {
  console.error(
    "Missing:",
    [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !key && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or supported alias)",
    ]
      .filter(Boolean)
      .join(", "),
  );
  process.exit(1);
}
let origin;
try {
  origin = new URL(url);
} catch {
  throw Error("Invalid project URL; check NEXT_PUBLIC_SUPABASE_URL");
}
if (
  origin.protocol !== "https:" &&
  !(
    origin.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(origin.hostname)
  )
)
  throw Error("Expected HTTPS project URL or loopback");
if (
  origin.username ||
  origin.password ||
  origin.search ||
  origin.hash ||
  origin.pathname !== "/"
)
  throw Error(
    "Use the project origin, not a database connection string or REST endpoint",
  );
let jwtRole;
try {
  jwtRole = JSON.parse(Buffer.from(key.split(".")[1], "base64url")).role;
} catch {}
if (key.startsWith("sb_secret_") || (jwtRole && jwtRole !== "anon"))
  throw Error(
    "Expected a public key. Remove any privileged public variable and rotate the exposed credential.",
  );
console.log(
  "Project host (compare to the intended corporate project):",
  origin.hostname,
);
console.log(
  "Canonical site URL:",
  process.env.NEXT_PUBLIC_SITE_URL
    ? "configured"
    : "unset; using deployment fallback",
);
const db = createClient(origin.origin, key, {
  db: { retry: false },
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        redirect: "error",
        signal: AbortSignal.timeout(6500),
      }),
  },
});
const columns = {
  business_divisions:
    "slug,name,short,description,capabilities,icon,sort_order",
  services:
    "slug,title,division_name,division_id,summary,problem,scope,deliverables,industries,technologies,created_at",
  products:
    "slug,name,category,classification,description,features,status,stack,url,logo_url,accent,screenshots,created_at",
  projects:
    "slug,name,client,category,description,problem,objectives,scope,solution,features,technologies,url,featured,ownership,screenshots,created_at",
  industries: "slug,name,description,offerings,sort_order",
  publications:
    "slug,title,type,category,excerpt,body,tags,featured,downloadable,document_url,published_at",
  careers:
    "slug,title,type,location,summary,responsibilities,requirements,created_at",
  website_settings: "key,value",
  case_studies: "id,title,body,results,projects!inner(slug,published)",
};
await Promise.all(
  Object.entries(columns).map(async ([table, fields]) => {
    let q = db.from(table).select(fields).limit(1);
    if (table !== "website_settings") q = q.eq("published", true);
    if (table === "case_studies") q = q.eq("projects.published", true);
    const { status, error, data } = await q;
    if (error) {
      process.exitCode = 1;
      console.error(
        `${table}: HTTP ${status}, code ${/^[A-Z0-9_]{1,32}$/i.test(error.code) ? error.code : "unknown"}`,
      );
    } else
      console.log(
        `${table}: readable (${data.length ? "row visible" : "no visible rows; inspect content and policies"})`,
      );
  }),
);
try {
  const r = await fetch(new URL("/auth/v1/settings", origin), {
    headers: { apikey: key },
    redirect: "error",
    signal: AbortSignal.timeout(6500),
  });
  const enabled = r.ok && (await r.json()).external?.email === true;
  console.log(
    `Auth settings: HTTP ${r.status}; email provider ${enabled ? "enabled" : "not confirmed"}`,
  );
  if (!enabled) process.exitCode = 1;
} catch {
  console.error("Auth settings: unreachable");
  process.exitCode = 1;
}
