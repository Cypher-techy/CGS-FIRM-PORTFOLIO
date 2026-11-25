import { readFailure } from "@/lib/supabase/read-error";
import { publicSupabaseConfig } from "@/lib/supabase/public-config";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { can } from "@/lib/access";
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path === "/techy/login") return NextResponse.next();
  let res = NextResponse.next({ request: req });
  const login = () => {
    const redirect = NextResponse.redirect(new URL("/techy/login", req.url));
    for (const cookie of res.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  };
  const { url, key } = publicSupabaseConfig();
  if (!url || !key) return login();
  const db = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll(items) {
        items.forEach((c) => req.cookies.set(c.name, c.value));
        res = NextResponse.next({ request: req });
        items.forEach((c) => res.cookies.set(c.name, c.value, c.options));
      },
    },
  });
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return login();
  const { data, error, status } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (error) {
    readFailure("staff profile", status, error.code);
    return new NextResponse("Unable to verify administrator access.", {
      status: 503,
    });
  }
  if (!data) return login();
  if (!can(data.role, path.split("/")[2] || "dashboard"))
    return new NextResponse("Your role does not have access to this module.", {
      status: 403,
    });
  return res;
}
export const config = { matcher: ["/techy/:path*"] };
