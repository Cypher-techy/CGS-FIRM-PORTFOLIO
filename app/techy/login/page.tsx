"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, AlertTriangle, Lock } from "lucide-react";
import { publicSupabaseConfig } from "@/lib/supabase/public-config";

function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { url, key } = publicSupabaseConfig();
  const missing = [
    !url && "NEXT_PUBLIC_SUPABASE_URL",
    !key && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ].filter(Boolean);
  const configured = missing.length === 0;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/techy/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="card w-full max-w-md p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-900 text-emerald2-light">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-xl font-extrabold text-action">
            CGS Admin
          </h1>
          <p className="text-sm text-slate2">Secure administrator sign-in</p>
        </div>
      </div>

      {!configured && (
        <div className="mt-5 flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="min-w-0 break-words">
            This deployment is missing {missing.join(" and ")}. Set the missing
            environment variables and rebuild to enable sign-in.
          </p>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
            placeholder="admin@cyphergreensystems.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="input"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !configured}
          className="btn-primary w-full disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Sign In
            </>
          )}
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-slate2">
        Access is restricted to authorised CGS administrators. Content and
        access changes are audit-logged.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-forest-950 px-5 py-16">
      <div
        className="grid-bg pointer-events-none fixed inset-0 opacity-40"
        aria-hidden
      />
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
