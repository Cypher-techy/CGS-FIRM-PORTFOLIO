import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export async function throttle(db: SupabaseClient, key: string) {
  const { data, error } = await db.rpc("take_form_slot", {
    bucket_key: createHash("sha256").update(key).digest("hex"),
    max_hits: 5,
  });
  if (error)
    return NextResponse.json(
      { error: "Submissions temporarily unavailable." },
      { status: 503 },
    );
  if (data !== true)
    return NextResponse.json(
      { error: "Too many submissions. Try again in a minute." },
      { status: 429 },
    );
  return null;
}
