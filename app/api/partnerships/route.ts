import { throttle } from "@/lib/throttle";
import { NextResponse } from "next/server";
import { partnershipSchema, rateLimited, clientIp } from "@/lib/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`partnerships:${ip}`)) {
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

  const parsed = partnershipSchema.safeParse(body);
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
  const limited = await throttle(admin, `partnerships:${ip}`);
  if (limited) return limited;

  const { error } = await admin.from("partnerships").insert({
    partnership_type: data.partnership_type,
    organisation: data.organisation,
    contact_name: data.contact_name,
    email: data.email,
    phone: data.phone || null,
    proposal: data.proposal,
  });
  if (error) {
    console.error("Partnership insert failed:", error.message);
    return NextResponse.json(
      { error: "We could not save your proposal. Please email us directly." },
      { status: 500 },
    );
  }
  await notify("partnerships");
  return NextResponse.json({ ok: true });
}
