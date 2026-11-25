import { throttle } from "@/lib/throttle";
import { NextResponse } from "next/server";
import { inquirySchema, rateLimited, clientIp } from "@/lib/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`inquiries:${ip}`)) {
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

  const parsed = inquirySchema.safeParse(body);
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

  // Honeypot — silently accept bots
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
  const limited = await throttle(admin, `inquiries:${ip}`);
  if (limited) return limited;

  const { error } = await admin.from("inquiries").insert({
    kind: data.kind,
    name: data.name,
    email: data.email,
    organisation: data.organisation || null,
    subject: data.subject || null,
    message: data.message,
  });
  if (error) {
    console.error("Inquiry insert failed:", error.message);
    return NextResponse.json(
      { error: "We could not save your enquiry. Please email us directly." },
      { status: 500 },
    );
  }
  await notify("inquiries");
  return NextResponse.json({ ok: true });
}
