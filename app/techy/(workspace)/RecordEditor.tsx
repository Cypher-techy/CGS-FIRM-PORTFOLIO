"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { fields, choices } from "@/lib/editor";
export default function RecordEditor({
  table,
  row,
  done,
}: {
  table: string;
  row: Record<string, unknown>;
  done: () => void;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    const t =
      table === "services"
        ? "business_divisions"
        : table === "case_studies"
          ? "projects"
          : null;
    if (t)
      createClient()
        .from(t)
        .select("id,name")
        .order("name")
        .then(({ data }) => setOptions(data ?? []));
  }, [table]);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget),
      out: Record<string, unknown> = {};
    for (const f of fields[table]) {
      const k = f.replace(/\[\]|\?/g, ""),
        v = String(fd.get(k) ?? "").trim();
      if (k === "id" && row.id) continue;
      if (k === "published_at" && !v) continue;
      out[k] = f.endsWith("[]")
        ? v
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean)
        : f.endsWith("?")
          ? fd.has(k)
          : k === "sort_order"
            ? Number(v)
            : v;
      if (
        (k === "url" && v && !/^https:\/\//i.test(v)) ||
        (k === "screenshots" &&
          (out[k] as string[]).some((x) => !/^https:\/\//i.test(x)))
      ) {
        setError("Use HTTPS links for external resources.");
        return;
      }
    }
    if (table === "services")
      out.division_id =
        options.find((o) => o.name === out.division_name)?.id ?? null;
    setBusy(true);
    try {
      const q = createClient().from(table);
      const result = await (
        row.id ? q.update(out).eq("id", row.id) : q.insert(out)
      )
        .select("id")
        .single();
      if (result.error) throw result.error;
      done();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="card my-5 grid gap-4 p-6 sm:grid-cols-2" onSubmit={save}>
      <h2 className="text-xl font-bold sm:col-span-2">
        {row.id ? "Edit" : "New"} record
      </h2>
      {fields[table].map((f) => {
        const k = f.replace(/\[\]|\?/g, ""),
          opt = choices[`${table}.${k}`],
          v = row[k],
          arr = Array.isArray(v);
        return (
          <label key={k} className="block">
            <span className="label">
              {k.replaceAll("_", " ")}{" "}
              {f.endsWith("[]") ? "(one per line)" : ""}
            </span>
            {["division_name", "project_id"].includes(k) ? (
              <select
                className="input"
                required
                defaultValue={String(v ?? "")}
                name={k}
              >
                <option value="">
                  Choose {k === "project_id" ? "a project" : "a division"}
                </option>
                {options.map((o) => (
                  <option key={o.id} value={k === "project_id" ? o.id : o.name}>
                    {o.name}
                  </option>
                ))}
              </select>
            ) : opt ? (
              <select
                name={k}
                defaultValue={String(v ?? opt[0])}
                className="input"
              >
                {opt.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            ) : f.endsWith("?") ? (
              <input name={k} type="checkbox" defaultChecked={Boolean(v)} />
            ) : f.endsWith("[]") ||
              [
                "summary",
                "description",
                "body",
                "excerpt",
                "solution",
                "problem",
              ].includes(k) ? (
              <textarea
                className="input"
                rows={3}
                name={k}
                defaultValue={arr ? v.join("\n") : String(v ?? "")}
              />
            ) : (
              <input
                className="input"
                name={k}
                readOnly={k === "id" && !!row.id}
                type={k === "url" ? "url" : k === "email" ? "email" : "text"}
                pattern={k === "slug" ? "[a-z0-9]+(-[a-z0-9]+)*" : undefined}
                required={[
                  "name",
                  "slug",
                  "title",
                  "url",
                  "email",
                  "id",
                  "project_id",
                ].includes(k)}
                defaultValue={String(v ?? "")}
              />
            )}
          </label>
        );
      })}
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      <div className="flex items-end gap-3 sm:col-span-2">
        <button className="btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Save record"}
        </button>
        <button type="button" className="btn-ghost" onClick={done}>
          Cancel
        </button>
      </div>
    </form>
  );
}
