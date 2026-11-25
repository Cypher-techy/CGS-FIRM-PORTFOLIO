"use client";

import { useEffect, useState } from "react";
import { can } from "@/lib/access";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Briefcase,
  Package,
  FolderKanban,
  Newspaper,
  Inbox,
  Handshake,
  Users,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";

const CARDS = [
  {
    label: "Services",
    table: "services",
    href: "/techy/services",
    icon: Briefcase,
  },
  {
    label: "Products",
    table: "products",
    href: "/techy/products",
    icon: Package,
  },
  {
    label: "Projects",
    table: "projects",
    href: "/techy/projects",
    icon: FolderKanban,
  },
  {
    label: "Publications",
    table: "publications",
    href: "/techy/publications",
    icon: Newspaper,
  },
  {
    label: "New Inquiries",
    table: "inquiries",
    href: "/techy/inquiries",
    icon: Inbox,
    filter: { status: "New" },
  },
  {
    label: "New Applications",
    table: "applications",
    href: "/techy/applications",
    icon: Users,
    filter: { status: "New" },
  },
  {
    label: "New Partnerships",
    table: "partnerships",
    href: "/techy/partnerships",
    icon: Handshake,
    filter: { status: "New" },
  },
];

export default function DashboardPage() {
  const [role, setRole] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    async function load() {
      if (!configured) {
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!data) return;
      setRole(data.role);
      const results: Record<string, number> = {};
      await Promise.all(
        CARDS.filter((c) => can(data.role, c.href.split("/")[2])).map(
          async (c) => {
            let q = supabase
              .from(c.table)
              .select("id", { count: "exact", head: true });
            if (c.filter) q = q.eq("status", c.filter.status);
            const { count } = await q;
            results[c.label] = count ?? 0;
          },
        ),
      );
      setCounts(results);
      setLoading(false);
    }
    load();
  }, [configured]);

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-action">
        Overview
      </h1>
      <p className="mt-1 text-slate2">
        Manage the entire CGS public website from here — no code changes
        required.
      </p>

      {!configured && (
        <div className="mt-6 flex gap-3 rounded-xl2 border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            <strong>Demo mode.</strong> Connect Supabase to see live counts and
            manage content. Follow <code>supabase/README.md</code> — it takes
            about 10 minutes.
          </p>
        </div>
      )}

      {loading ? (
        <div className="mt-10 flex items-center gap-2 text-slate2">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading analytics…
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CARDS.filter((c) => can(role, c.href.split("/")[2])).map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
                  <c.icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-5 w-5 text-slate2 transition group-hover:translate-x-1 group-hover:text-emerald2" />
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold text-action">
                {configured ? (counts[c.label] ?? 0) : "—"}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate2">
                {c.label}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
