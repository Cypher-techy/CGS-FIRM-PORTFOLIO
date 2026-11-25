import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { can } from "@/lib/access";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Package,
  FolderKanban,
  Newspaper,
  Users,
  Inbox,
  Handshake,
  Settings,
  LogOut,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/publications", label: "Publications", icon: Newspaper },
  { href: "/admin/careers", label: "Vacancies", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/partnerships", label: "Partnerships", icon: Handshake },
  { href: "/admin/settings", label: "Settings & Audit", icon: Settings },
  { href: "/admin/business_divisions", label: "Divisions", icon: Briefcase },
  { href: "/admin/industries", label: "Industries", icon: Briefcase },
  { href: "/admin/media", label: "Media library", icon: Package },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/case_studies", label: "Case studies", icon: FolderKanban },
  { href: "/admin/profiles", label: "User roles", icon: Users },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) redirect("/admin/login");
  const db = await createServerSupabase();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!data) redirect("/admin/login");
  const visible = NAV.filter((n) => can(data.role, n.href.split("/")[2]));
  return (
    <div className="min-h-screen bg-mist">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-forest-950 text-white lg:flex">
          <div className="flex items-center gap-3 border-b border-white/10 p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage text-forest-950">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="font-display font-extrabold">CGS Admin</p>
              <p className="text-[11px] uppercase tracking-widest text-emerald2-light">
                Dashboard
              </p>
            </div>
          </div>
          <nav
            className="flex-1 space-y-1 overflow-y-auto p-3"
            aria-label="Admin"
          >
            {visible.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <n.icon className="h-5 w-5" /> {n.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-1 border-t border-white/10 p-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" /> View Website
            </Link>
            <LogoutButton />
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-surface/90 px-5 py-3 lg:hidden">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-display font-extrabold text-action"
            >
              <ShieldCheck className="h-5 w-5 text-emerald2" /> CGS Admin
            </Link>
            <LogoutButton compact />
          </header>
          <nav
            className="flex gap-2 overflow-x-auto border-b border-line bg-surface px-4 py-2 lg:hidden"
            aria-label="Admin mobile"
          >
            {visible.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-xs font-bold text-action"
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
          </nav>
          <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
