import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { can } from "@/lib/access";
import { isSupabaseConfigured } from "@/lib/supabase/client";
const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status });
async function authorize() {
  if (!isSupabaseConfigured()) return fail("Storage unavailable", 503);
  const db = await createServerSupabase(),
    {
      data: { user },
    } = await db.auth.getUser();
  if (!user) return fail("Sign in required", 401);
  const { data } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!data || !can(data.role, "media")) return fail("Access denied", 403);
  return { db, user };
}
export async function POST(req: Request) {
  const access = await authorize();
  if (access instanceof Response) return access;
  const { db, user } = access;
  if (Number(req.headers.get("content-length")) > 5242880)
    return fail("File too large", 413);
  const fd = await req.formData().catch(() => null),
    file = fd?.get("file");
  if (!(file instanceof File) || file.size > 4000000 || file.size === 0)
    return fail("Choose a file up to 4 MB", 400);
  const buf = Buffer.from(await file.arrayBuffer()),
    magic = buf.subarray(0, 12).toString("hex"),
    mime = magic.startsWith("89504e470d0a1a0a")
      ? "image/png"
      : magic.startsWith("ffd8ff")
        ? "image/jpeg"
        : magic.startsWith("255044462d")
          ? "application/pdf"
          : null;
  if (!mime || mime !== file.type)
    return fail("Only PNG, JPEG and PDF files are supported", 415);
  const admin = createAdminClient();
  if (!admin) return fail("Storage unavailable", 503);
  const bucket = admin.storage.from("media"),
    path = `${user.id}/${crypto.randomUUID()}.${mime.split("/")[1]}`;
  const { error } = await bucket.upload(path, buf, { contentType: mime });
  if (error) return fail("Upload failed", 500);
  const { error: recordError } = await db.from("media_assets").insert({
    name: file.name.slice(0, 200),
    url: bucket.getPublicUrl(path).data.publicUrl,
    storage_path: path,
    uploaded_by: user.id,
    mime_type: mime,
    size_bytes: file.size,
    kind: mime === "application/pdf" ? "document" : "image",
  });
  if (recordError) {
    await bucket.remove([path]);
    return fail("Could not record file", 500);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const access = await authorize();
  if (access instanceof Response) return access;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return fail("Select an asset.", 400);
  const { data } = await access.db
    .from("media_assets")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (!data) return fail("Asset not found.", 404);
  const admin = createAdminClient();
  if (!admin) return fail("Storage unavailable.", 503);
  if (data.storage_path) {
    const { error } = await admin.storage
      .from("media")
      .remove([data.storage_path]);
    if (error) return fail("Could not remove file.", 500);
  }
  const { error } = await access.db.from("media_assets").delete().eq("id", id);
  return error
    ? fail("Could not remove record.", 500)
    : NextResponse.json({ ok: true });
}
