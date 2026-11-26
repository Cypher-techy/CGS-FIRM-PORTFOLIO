// Validate the CI-only PostgreSQL DSN before passing it to either psql or the CLI.
const ref = process.env.SUPABASE_PROJECT_REF;
let u;
try {
  u = new URL(process.env.SUPABASE_DB_URL);
} catch {
  throw Error("Invalid SUPABASE_DB_URL");
}
if (
  !/^[a-z0-9]{20}$/.test(ref || "") ||
  !["postgres:", "postgresql:"].includes(u.protocol) ||
  u.pathname !== "/postgres" ||
  !u.password ||
  u.hash ||
  (u.port && u.port !== "5432") ||
  [...u.searchParams.keys()].some((k) => k !== "sslmode") ||
  u.searchParams.size !== 1 ||
  !["require", "verify-full"].includes(u.searchParams.get("sslmode")) ||
  !(
    (u.hostname === `db.${ref}.supabase.co` && u.username === "postgres") ||
    (/^aws-[a-z0-9-]+\.pooler\.supabase\.com$/.test(u.hostname) &&
      u.username === `postgres.${ref}`)
  )
)
  throw Error(
    "Use the dedicated project direct/session DSN with TLS. Project target mismatch or unsupported DSN.",
  );
console.log("Verified dedicated Supabase project target:", ref);
