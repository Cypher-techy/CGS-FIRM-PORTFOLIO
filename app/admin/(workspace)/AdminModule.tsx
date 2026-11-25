"use client";

import RecordEditor from "./RecordEditor";
import { fields } from "@/lib/editor";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

type Row = Record<string, unknown> & { id: string };

export default function AdminModule({
  title,
  description,
  table,
  columns,
  statusField,
  statusOptions,
  orderBy = "created_at",
}: {
  title: string;
  description: string;
  table: string;
  columns: { key: string; label: string; truncate?: boolean }[];
  statusField?: string;
  statusOptions?: string[];
  orderBy?: string;
}) {
  const [page, setPage] = useState(0),
    [hasMore, more] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const configured = isSupabaseConfigured();

  async function load() {
    if (!configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending: false })
      .order("id")
      .range(page * 40, page * 40 + 40);
    if (error) setError(error.message);
    else {
      setRows((data || []).slice(0, 40) as Row[]);
      more((data ?? []).length > 40);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function togglePublished(row: Row) {
    const supabase = createClient();
    const next = !(row.published as boolean);
    const { error } = await supabase
      .from(table)
      .update({ published: next })
      .eq("id", row.id)
      .select("id")
      .single();
    if (error) setError(error.message);
    else {
      setRows(
        rows.map((r) => (r.id === row.id ? { ...r, published: next } : r)),
      );
      setNotice(`${next ? "Published" : "Unpublished"} successfully.`);
      setTimeout(() => setNotice(""), 3000);
    }
  }

  async function updateStatus(row: Row, value: string) {
    if (!statusField) return;
    const supabase = createClient();
    const { error } = await supabase
      .from(table)
      .update({ [statusField]: value })
      .eq("id", row.id)
      .select("id")
      .single();
    if (error) setError(error.message);
    else {
      setRows(
        rows.map((r) => (r.id === row.id ? { ...r, [statusField]: value } : r)),
      );
      setNotice(`Status updated to "${value}".`);
      setTimeout(() => setNotice(""), 3000);
    }
  }

  async function remove(row: Row) {
    if (!confirm("Delete this record permanently? This cannot be undone."))
      return;
    const supabase = createClient();
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", row.id)
      .select("id")
      .single();
    if (error) setError(error.message);
    else setRows(rows.filter((r) => r.id !== row.id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-forest-950">
            {title}
          </h1>
          <p className="mt-1 text-slate2">{description}</p>
        </div>
        <button onClick={load} className="btn-ghost !px-4 !py-2 !text-sm">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {!configured && (
        <div className="mt-6 flex gap-3 rounded-xl2 border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            <strong>Database not connected.</strong> Set{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then run{" "}
            <code>supabase/schema.sql</code> in the Supabase SQL Editor to
            enable live content management. Public pages currently render from
            the built-in seed data.
          </p>
        </div>
      )}

      {fields[table] && (
        <button className="btn-primary mt-5" onClick={() => setEditing({})}>
          Add record
        </button>
      )}
      {editing && (
        <RecordEditor
          key={String(editing.id ?? "new")}
          table={table}
          row={editing}
          done={() => {
            setEditing(null);
            load();
          }}
        />
      )}
      {notice && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald2/15 px-4 py-3 text-sm font-semibold text-forest-900">
          <CheckCircle2 className="h-5 w-5 text-emerald2" /> {notice}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {error}
        </p>
      )}

      <div className="card mt-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-16 text-slate2">
            <Loader2 className="h-6 w-6 animate-spin" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-display text-lg font-bold text-forest-950">
              No records yet
            </p>
            <p className="mt-1 text-sm text-slate2">
              {configured
                ? "Records will appear here as they are created on the public site."
                : "Connect Supabase to manage records here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-forest-900/10 bg-mist">
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-forest-900"
                    >
                      {c.label}
                    </th>
                  ))}
                  {"published" in rows[0] && (
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-forest-900">
                      Published
                    </th>
                  )}
                  {statusField && (
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-forest-900">
                      Status
                    </th>
                  )}
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-forest-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-forest-900/5 last:border-0 hover:bg-mist/50"
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-4 py-3 text-slate-700 ${c.truncate ? "max-w-[400px] whitespace-pre-wrap break-words" : ""}`}
                      >
                        {String(row[c.key] ?? "—")}
                      </td>
                    ))}
                    {"published" in row && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePublished(row)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            row.published
                              ? "bg-emerald2/20 text-forest-900"
                              : "bg-slate-200 text-slate-600"
                          }`}
                          aria-label={row.published ? "Unpublish" : "Publish"}
                        >
                          {row.published ? (
                            <Eye className="h-3.5 w-3.5" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5" />
                          )}
                          {row.published ? "Yes" : "No"}
                        </button>
                      </td>
                    )}
                    {statusField && statusOptions && (
                      <td className="px-4 py-3">
                        <select
                          value={String(row[statusField] ?? "")}
                          onChange={(e) => updateStatus(row, e.target.value)}
                          className="rounded-lg border border-forest-900/15 bg-white px-2 py-1.5 text-xs font-semibold"
                          aria-label="Update status"
                        >
                          {statusOptions.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      {fields[table] && (
                        <button
                          className="px-2 font-bold"
                          onClick={() => setEditing(row)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => remove(row)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                        aria-label="Delete record"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {(page > 0 || hasMore) && (
        <nav className="mt-4 flex gap-3" aria-label="Record pages">
          <button
            className="btn-ghost"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="self-center">Page {page + 1}</span>
          <button
            className="btn-ghost"
            disabled={!hasMore}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
