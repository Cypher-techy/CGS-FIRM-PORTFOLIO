import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
const input = z.object({
  email: z.email().max(254),
  role: z.enum([
    "super_admin",
    "administrator",
    "content_manager",
    "project_manager",
    "editor",
  ]),
  password: z.string().min(14).max(128),
});
export async function POST(req: Request) {
  const fail = (error: string, status: number) =>
    NextResponse.json({ error }, { status });
  if (!isSupabaseConfigured())
    return fail("Authentication is unavailable.", 503);
  const db = await createServerSupabase(),
    {
      data: { user },
    } = await db.auth.getUser();
  if (!user) return fail("Sign in required.", 401);
  const { data: p } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (p?.role !== "super_admin")
    return fail("Only super administrators manage accounts.", 403);
  const parsed = input.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return fail(
      "Enter a valid email, role and password of at least 14 characters.",
      400,
    );
  const admin = createAdminClient();
  if (!admin) return fail("Service unavailable.", 503);
  const { email, role, password } = parsed.data;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user)
    return fail(
      "Unable to create account. Check whether the address is already registered.",
      400,
    );
  const { error: linkError } = await db
    .from("profiles")
    .insert({ id: data.user.id, email, role });
  if (linkError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return fail("Could not assign access.", 500);
  }
  return NextResponse.json({ ok: true });
}
