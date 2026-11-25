"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({
  compact = false,
}: {
  compact?: boolean;
}) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className={
        compact
          ? "flex items-center gap-1.5 rounded-full bg-forest-900 px-3 py-1.5 text-xs font-bold text-white"
          : "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
      }
    >
      <LogOut className="h-5 w-5" /> Sign Out
    </button>
  );
}
