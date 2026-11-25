"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Media() {
  const [rows, setRows] = useState<{ id: string; name: string; url: string }[]>(
      [],
    ),
    [msg, set] = useState("");
  async function load() {
    const { data, error } = await createClient()
      .from("media_assets")
      .select("id,name,url")
      .order("created_at", { ascending: false });
    if (error) set(error.message);
    else setRows(data);
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <h1 className="text-3xl font-bold">Media & document library</h1>
      <form
        className="card my-6 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          set("Uploading…");
          try {
            const r = await fetch("/api/admin/media", {
                method: "POST",
                body: new FormData(e.currentTarget),
              }),
              data = await r.json();
            set(r.ok ? "Uploaded" : data.error);
            if (r.ok) load();
          } catch {
            set("Upload unavailable. Please retry.");
          }
        }}
      >
        <label className="label">
          Public file (PNG, JPEG or PDF; up to 4 MB)
          <input
            className="input"
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            required
            name="file"
          />
        </label>
        <button className="btn-primary">Upload</button>
      </form>
      <p role="status">{msg}</p>
      {rows.length === 0 ? (
        <p>No public assets yet.</p>
      ) : (
        rows.map((r) => (
          <div className="card mb-2 p-4" key={r.id}>
            <a
              href={r.url}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              {r.name}
            </a>
            <button
              className="ml-4 text-sm text-red-700"
              onClick={async () => {
                if (
                  !confirm(
                    "Remove this public file permanently? Existing references will stop working.",
                  )
                )
                  return;
                try {
                  const r2 = await fetch(
                    "/api/admin/media?id=" + encodeURIComponent(r.id),
                    { method: "DELETE" },
                  );
                  const data = await r2.json();
                  if (!r2.ok) throw Error(data.error);
                  set("Asset removed.");
                  await load();
                } catch (err) {
                  set((err as Error).message);
                }
              }}
            >
              Delete asset
            </button>
            <input
              aria-label="Reusable asset URL"
              className="input mt-2"
              value={r.url}
              readOnly
              onFocus={(e) => e.target.select()}
            />
          </div>
        ))
      )}
    </>
  );
}
