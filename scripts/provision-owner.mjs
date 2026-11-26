// Trusted CI/CLI entry point only. Never imported by Next.js; never prints API responses.
import { createClient } from "@supabase/supabase-js";
import { pathToFileURL } from "node:url";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const normalized = (v) => v?.trim().toLowerCase();
export async function provision(db, env) {
  const email = normalized(env.CGS_OWNER_EMAIL),
    expected = normalized(env.CGS_OWNER_UID);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw Error("Set CGS_OWNER_EMAIL");
  if (!uuid.test(expected || "") && expected !== "new")
    throw Error(
      "Pin CGS_OWNER_UID or explicitly select new for first-time creation",
    );
  const auth = db.auth.admin;
  let uid = expected;
  if (expected === "new") {
    if (env.CGS_ALLOW_CREATE !== "true")
      throw Error("Account creation requires explicit approval");
    const receipt = await db.rpc("cgs_bootstrapped_uid");
    if (receipt.error)
      throw Error("Cannot verify bootstrap history; no account created");
    if (receipt.data) uid = receipt.data;
    else {
      // Never adopt an existing account on email alone. Duplicate email is a safe refusal.
      const password = env.CGS_INITIAL_PASSWORD;
      if (!password || password.length < 20)
        throw Error(
          "Provide a fresh strong CGS_INITIAL_PASSWORD secret (at least 20 characters)",
        );
      const created = await auth.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (created.error || !created.data?.user)
        throw Error(
          "Creation refused. If account exists, pin its UID and use verify mode; no credentials were reset.",
        );
      uid = created.data.user.id;
      console.log(
        "Created Auth account. Pin CGS_OWNER_UID for subsequent runs:",
        uid,
      );
    }
  }
  async function verifyIdentity() {
    const { data, error } = await auth.getUserById(uid);
    const user = data?.user;
    if (
      error ||
      !user ||
      user.id !== uid ||
      normalized(user.email) !== email ||
      !user.email_confirmed_at ||
      user.deleted_at ||
      Date.parse(user.banned_until) > Date.now()
    )
      throw Error(
        "Confirmed, active Auth UID/email match required; no password or identity changes attempted",
      );
  }
  await verifyIdentity();
  const assigned = await db.rpc("bootstrap_cgs_owner", {
    expected_uid: uid,
    expected_email: email,
    allow_promotion: expected !== "new" && env.CGS_ALLOW_PROMOTION === "true",
  });
  if (assigned.error || assigned.data !== uid)
    throw Error(
      "Database refused owner bootstrap; check migration, profile identity, existing role and bootstrap receipt",
    );
  await verifyIdentity();
  const { data: profile, error } = await db
    .from("profiles")
    .select("id,email,role")
    .eq("id", uid)
    .single();
  if (
    error ||
    profile?.id !== uid ||
    normalized(profile.email) !== email ||
    profile.role !== "super_admin"
  )
    throw Error("Final staff profile verification failed");
  console.log("Verified confirmed owner UID, email and super_admin profile.");
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const ref = process.env.SUPABASE_PROJECT_REF,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!/^[a-z0-9]{20}$/.test(ref || "") || !key)
    throw Error("Dedicated project ref and server-only service key required");
  const db = createClient(`https://${ref}.supabase.co`, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  await provision(db, process.env);
}
