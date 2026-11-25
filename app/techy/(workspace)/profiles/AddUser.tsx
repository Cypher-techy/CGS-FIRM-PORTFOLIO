"use client";
import { useState } from "react";
import { choices } from "@/lib/editor";
export default function AddUser() {
  const [msg, set] = useState("");
  return (
    <details className="card mb-5 p-5">
      <summary className="cursor-pointer font-bold">
        Create a staff account
      </summary>
      <form
        className="mt-4 grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          set("Creating…");
          try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(new FormData(form))),
              }),
              body = await res.json();
            set(
              res.ok
                ? "Account created. Refresh the user list below."
                : body.error,
            );
            if (res.ok) form.reset();
          } catch {
            set("Request failed. Please retry.");
          }
        }}
      >
        <label>
          Email
          <input required className="input" type="email" name="email" />
        </label>
        <label>
          Password (14 or more characters)
          <input
            required
            minLength={14}
            className="input"
            type="password"
            autoComplete="new-password"
            name="password"
          />
        </label>
        <label>
          Access role
          <select className="input" name="role">
            {choices["profiles.role"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <button className="btn-primary">Create account</button>
        <p role="status">{msg}</p>
      </form>
    </details>
  );
}
