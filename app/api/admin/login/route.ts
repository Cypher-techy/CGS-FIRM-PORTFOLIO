import { publicSupabaseConfig } from "@/lib/supabase/public-config";
import { can } from "@/lib/access";
import { readFailure } from "@/lib/supabase/read-error";
import { rateLimited, clientIp } from "@/lib/validation";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  if (rateLimited(`login:${clientIp(req)}`, 8))
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const { url, key } = publicSupabaseConfig();
  if (url && key) {
    const cookieStore = await cookies();
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (
      error &&
      error.code !== "invalid_credentials" &&
      error.code !== "email_not_confirmed"
    ) {
      readFailure("password sign-in", error.status ?? 0, error.code);
      return NextResponse.json(
        {
          error:
            "Sign-in service unavailable. Check the deployment’s Auth configuration.",
        },
        { status: error.status === 429 ? 429 : 503 },
      );
    }
    if (error || !data.user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }
    // Verify the user has an admin profile with an authorised role
    const {
      data: profile,
      error: profileError,
      status,
    } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();
    if (profileError) {
      readFailure("staff profile", status, profileError.code);
      await supabase.auth.signOut({ scope: "local" });
      return NextResponse.json(
        { error: "Unable to verify administrator access." },
        { status: 503 },
      );
    }
    if (!profile || !can(profile.role, "dashboard")) {
      await supabase.auth.signOut({ scope: "local" });
      return NextResponse.json(
        {
          error:
            "This account does not have administrator access. Contact the Super Administrator.",
        },
        { status: 403 },
      );
    }
    return NextResponse.json({ ok: true, role: profile.role });
  }

  return NextResponse.json(
    { error: "Administrator sign-in is not configured." },
    { status: 503 },
  );
}
