import { test } from "node:test";
import assert from "node:assert/strict";
import { provision } from "../scripts/provision-owner.mjs";
const uid = "10000000-0000-4000-8000-000000000001",
  email = "owner@example.test";
function fixture(overrides = {}) {
  const user = {
    id: uid,
    email,
    email_confirmed_at: "2020-01-01",
    ...overrides,
  };
  let receipt = null,
    created = 0,
    granted = 0;
  const db = {
    auth: {
      admin: {
        getUserById: async () => ({ data: { user } }),
        createUser: async () => {
          created++;
          return { data: { user } };
        },
      },
    },
    rpc: async (name) => {
      if (name === "cgs_bootstrapped_uid") return { data: receipt };
      granted++;
      receipt = uid;
      return { data: uid };
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: { id: uid, email, role: "super_admin" },
          }),
        }),
      }),
    }),
  };
  return {
    db,
    env: { CGS_OWNER_UID: uid, CGS_OWNER_EMAIL: email },
    counts: () => [created, granted],
  };
}
test("pinned UID refuses mismatch, missing confirmation and ban before profile mutation", async () => {
  for (const change of [
    { email: "other@example.test" },
    { id: "different" },
    { email_confirmed_at: null },
    { banned_until: "2100-01-01" },
  ]) {
    const f = fixture(change);
    await assert.rejects(provision(f.db, f.env));
    assert.deepEqual(f.counts(), [0, 0]);
  }
});
test("pinned mode never creates accounts; explicit new mode reruns without passwords", async () => {
  const p = fixture();
  await provision(p.db, p.env);
  assert.deepEqual(p.counts(), [0, 1]);
  const f = fixture();
  f.env.CGS_OWNER_UID = "new";
  await assert.rejects(provision(f.db, f.env));
  f.env.CGS_ALLOW_CREATE = "true";
  await assert.rejects(provision(f.db, f.env));
  f.env.CGS_INITIAL_PASSWORD = "x".repeat(24);
  await provision(f.db, f.env);
  delete f.env.CGS_INITIAL_PASSWORD;
  await provision(f.db, f.env);
  assert.deepEqual(f.counts(), [1, 2]);
});
