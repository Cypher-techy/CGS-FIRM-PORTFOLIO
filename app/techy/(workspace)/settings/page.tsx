"use client";

import copyDefaults from "@/lib/copy-defaults.json";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Loader2, AlertTriangle, CheckCircle2, Save } from "lucide-react";

type Setting = { key: string; value: unknown };

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, choose] = useState("copy.home");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const configured = isSupabaseConfigured();

  async function load() {
    if (!configured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("website_settings")
      .select("*")
      .order("key");
    if (error) setError(error.message);
    else {
      const initial: Record<string, unknown> = {
        ...copyDefaults,
        site_title:
          "Cypher Green Systems — Technology. Environment. Opportunity.",
        seo_description:
          "Multidisciplinary technology and environmental solutions firm.",
        contact_email: "",
        office_location: "",
        navigation: [
          ["Home", "/"],
          ["About", "/about"],
          ["Divisions", "/divisions"],
          ["Services", "/services"],
          ["Portfolio", "/projects"],
          ["Insights", "/insights"],
        ],
        more_navigation: [
          ["Products", "/products"],
          ["Industries", "/industries"],
          ["Research", "/research"],
          ["Partnerships", "/partnerships"],
          ["Careers", "/careers"],
        ],
        footer_description:
          "A multidisciplinary technology and environmental solutions firm delivering practical solutions for a smarter, more resilient future.",
        footer: [],
        social_links: [],
      };
      for (const item of data ?? []) {
        initial[item.key] = item.key.startsWith("copy.")
          ? { ...(initial[item.key] as object), ...item.value }
          : item.value;
      }
      setSettings(
        Object.entries(initial).map(([key, value]) => ({ key, value })),
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(key: string, value: string) {
    const supabase = createClient();
    let parsed: unknown = value;
    try {
      parsed = JSON.parse(value);
    } catch {
      /* plain string */
    }
    if (
      ["navigation", "more_navigation", "footer", "social_links"].includes(
        key,
      ) &&
      (!Array.isArray(parsed) ||
        !parsed.every(
          (row) =>
            Array.isArray(row) &&
            row.length === 2 &&
            row.every((v) => typeof v === "string") &&
            (key === "social_links" ? /^https:\/\// : /^\/(?![\/\\])/).test(
              row[1],
            ),
        ))
    ) {
      setError(
        "Links must be JSON pairs of label and destination. Navigation uses local paths; social links use HTTPS.",
      );
      return;
    }
    if (
      !key.startsWith("copy.") &&
      !["navigation", "more_navigation", "footer", "social_links"].includes(
        key,
      ) &&
      typeof parsed !== "string"
    ) {
      setError("Expected a text value.");
      return;
    }
    const { error } = await supabase
      .from("website_settings")
      .upsert({ key, value: parsed }, { onConflict: "key" });
    if (error) setError(error.message);
    else {
      setError("");
      setSettings((rows) =>
        rows.map((r) => (r.key === key ? { key, value: parsed } : r)),
      );
      setNotice(`Saved "${key}".`);
      setTimeout(() => setNotice(""), 3000);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-action">
        Settings & Audit
      </h1>
      <p className="mt-1 text-slate2">
        Website settings (SEO, contact details, social links) and the audit
        trail of administrative actions.
      </p>

      {!configured && (
        <div className="mt-6 flex gap-3 rounded-xl2 border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Connect Supabase to manage website settings and view audit logs. See{" "}
            <code>supabase/README.md</code>.
          </p>
        </div>
      )}

      {notice && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald2/15 px-4 py-3 text-sm font-semibold text-action">
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

      <div className="card mt-6 p-7">
        <h2 className="font-display text-lg font-bold text-action">
          Website Settings
        </h2>
        {loading ? (
          <div className="mt-6 flex items-center gap-2 text-slate2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading…
          </div>
        ) : settings.length === 0 ? (
          <p className="mt-4 text-sm text-slate2">
            {configured
              ? "No settings yet. Settings appear here once created (e.g. via the SQL editor or an upsert). Suggested keys: site_title, contact_email, social_links, seo_description."
              : "Settings management requires a connected database."}
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            <label className="label">
              Choose content or setting
              <select
                className="input mt-2"
                value={selected}
                onChange={(e) => choose(e.target.value)}
              >
                {settings.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.key.replace("copy.", "Page / ").replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            {settings
              .filter((r) => r.key === selected)
              .map((s) => (
                <SettingRow key={s.key} setting={s} onSave={save} />
              ))}
          </div>
        )}
      </div>

      <AuditLogs />
    </div>
  );
}

function SettingRow({
  setting,
  onSave,
}: {
  setting: Setting;
  onSave: (k: string, v: string) => void;
}) {
  const [value, setValue] = useState(
    typeof setting.value === "string"
      ? setting.value
      : JSON.stringify(setting.value, null, 2),
  );
  if (setting.key.startsWith("copy.")) {
    const obj = JSON.parse(value) as Record<string, string>;
    return (
      <div className="space-y-3">
        {Object.entries(obj).map(([k, v]) => (
          <label key={k} className="block">
            <span className="label">{k.replaceAll("_", " ")}</span>
            <textarea
              className="input"
              rows={v.length > 100 ? 3 : 1}
              value={v}
              onChange={(e) =>
                setValue(JSON.stringify({ ...obj, [k]: e.target.value }))
              }
            />
          </label>
        ))}
        <button
          className="btn-primary"
          onClick={() => onSave(setting.key, value)}
        >
          Save page content
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="label" htmlFor={`setting-${setting.key}`}>
          {setting.key}
        </label>
        <textarea
          id={`setting-${setting.key}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          className="input font-mono text-xs"
        />
      </div>
      <button
        onClick={() => onSave(setting.key, value)}
        className="btn-primary !px-4 !py-2.5 !text-sm"
      >
        <Save className="h-4 w-4" /> Save
      </button>
    </div>
  );
}

function AuditLogs() {
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    async function load() {
      if (!configured) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("audit_logs")
        .select("id, actor_email, action, entity, entity_id, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      setLogs((data || []) as Record<string, unknown>[]);
    }
    load();
  }, [configured]);

  if (!configured) return null;
  return (
    <div className="card mt-8 p-7">
      <h2 className="font-display text-lg font-bold text-action">Audit Logs</h2>
      <p className="mt-1 text-sm text-slate2">
        Every administrative create, update and delete is recorded
        automatically.
      </p>
      {logs.length === 0 ? (
        <p className="mt-4 text-sm text-slate2">No audit events yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-mist">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  When
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  Actor
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  Entity
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr
                  key={String(l.id)}
                  className="border-b border-line last:border-0"
                >
                  <td className="px-4 py-3 text-slate2">
                    {new Date(String(l.created_at)).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate2">
                    {String(l.actor_email ?? "—")}
                  </td>
                  <td className="px-4 py-3 font-semibold text-action">
                    {String(l.action)}
                  </td>
                  <td className="px-4 py-3 text-slate2">
                    {String(l.entity)} /{" "}
                    {String(l.entity_id ?? "—").slice(0, 8)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
