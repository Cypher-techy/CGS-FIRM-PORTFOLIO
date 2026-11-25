import { throttle } from "@/lib/throttle";
import { NextResponse } from "next/server";
import { applicationSchema, rateLimited, clientIp } from "@/lib/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`applications:${ip}`, 5)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ||
          "Please check the form and try again.",
      },
      { status: 400 },
    );
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true });

  const admin = createAdminClient();
  if (!admin)
    return NextResponse.json(
      {
        error:
          "Online submissions are temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  const limited = await throttle(admin, `applications:${ip}`);
  if (limited) return limited;

  // Resolve career id from slug when possible
  const { data: career } = await admin
    .from("careers")
    .select("id,title")
    .eq("slug", data.career_slug)
    .eq("published", true)
    .maybeSingle();

  if (!career)
    return NextResponse.json(
      { error: "This vacancy is no longer open." },
      { status: 400 },
    );
  const { error } = await admin.from("applications").insert({
    career_id: career?.id ?? null,
    career_title: career.title,
    applicant_name: data.applicant_name,
    email: data.email,
    phone: data.phone || null,
    cover_letter: data.cover_letter,
    portfolio_url: data.portfolio_url || null,
  });
  if (error) {
    console.error("Application insert failed:", error.message);
    return NextResponse.json(
      { error: "We could not save your application. Please try again later." },
      { status: 500 },
    );
  }
  await notify("applications");
  return NextResponse.json({ ok: true });
}
