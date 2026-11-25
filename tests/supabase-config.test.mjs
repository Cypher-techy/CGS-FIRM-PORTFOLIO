import test from "node:test";
import assert from "node:assert/strict";
import { isSupabaseConfigured } from "../lib/supabase/public-config.ts";

test("sign-in requires a project URL and one supported public key", () => {
  for (const key of [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ])
    delete process.env[key];
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.invalid";
  assert.equal(isSupabaseConfigured(), false);
  for (const key of [
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]) {
    process.env[key] = "test-public-key";
    assert.equal(isSupabaseConfigured(), true);
    delete process.env[key];
  }
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-public-key";
  assert.equal(isSupabaseConfigured(), false);
});
