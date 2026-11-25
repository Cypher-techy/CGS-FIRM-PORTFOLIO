import { publicSupabaseConfig } from "@/lib/supabase/public-config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST() {
  const cookieStore = await cookies();
  const { url, key } = publicSupabaseConfig();
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    });
    await supabase.auth.signOut();
  }

  return NextResponse.json({ ok: true });
}
