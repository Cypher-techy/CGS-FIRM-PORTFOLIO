"use client";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () =>
      setDark(document.documentElement.dataset.theme === "dark");
    read();
    const sync = (e: StorageEvent) => {
      if (e.key === "cgs-theme" || e.key === null) {
        document.documentElement.dataset.theme =
          e.newValue === "dark" ? "dark" : "light";
        read();
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      onClick={() => {
        const next = document.documentElement.dataset.theme !== "dark";
        document.documentElement.dataset.theme = next ? "dark" : "light";
        setDark(next);
        try {
          localStorage.setItem("cgs-theme", next ? "dark" : "light");
        } catch {
          /* storage is optional */
        }
      }}
    >
      <Sun className="sun-icon" size={18} />
      <Moon className="moon-icon" size={18} />
    </button>
  );
}
