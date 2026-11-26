// End-to-end acceptance test ONLY against the ephemeral CI stack. Do not print status keys.
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { provision } from "./provision-owner.mjs";
const cfg = JSON.parse(
  execFileSync("supabase", ["status", "-o", "json"], { encoding: "utf8" }),
);
const origin = "http://127.0.0.1:54321";
assert.equal(cfg.API_URL, origin);
const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const db = createClient(origin, cfg.SERVICE_ROLE_KEY, opts),
  client = createClient(origin, cfg.ANON_KEY, opts);
const email = "owner@fixture.example",
  password = randomBytes(32).toString("hex");
const env = {
  CGS_OWNER_UID: "new",
  CGS_OWNER_EMAIL: email,
  CGS_ALLOW_CREATE: "true",
  CGS_INITIAL_PASSWORD: password,
};
await provision(db, env);
const login = await client.auth.signInWithPassword({ email, password });
assert.ok(!login.error, "local email/password sign-in");
await provision(db, {
  CGS_OWNER_UID: login.data.user.id,
  CGS_OWNER_EMAIL: email,
});
assert.equal(
  (
    await client
      .from("profiles")
      .select("role")
      .eq("id", login.data.user.id)
      .single()
  ).data?.role,
  "super_admin",
);
assert.ok(
  (
    await client
      .from("profiles")
      .update({ role: "editor" })
      .eq("id", login.data.user.id)
  ).error,
  "self-role change must be rejected",
);
assert.ok(
  (
    await client.rpc("bootstrap_cgs_owner", {
      expected_uid: login.data.user.id,
      expected_email: email,
    })
  ).error,
  "browser session cannot call trusted provisioning",
);
assert.ok(!(await client.auth.signOut()).error);
console.log(
  "Local Supabase Auth + Data API: create, verify, sign in, self-role protection, RPC denial and logout passed.",
);
