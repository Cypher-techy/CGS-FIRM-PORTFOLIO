"use client";
import { createContext, useContext } from "react";
const Copy = createContext<Record<string, unknown>>({});
export function CopyProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Record<string, unknown>;
}) {
  return <Copy.Provider value={value}>{children}</Copy.Provider>;
}
export function useCopy(section: string) {
  const settings = useContext(Copy);
  return (key: string, fallback = key) => {
    const data = settings[`copy.${section}`];
    const val =
      data && typeof data === "object"
        ? (data as Record<string, unknown>)[key]
        : null;
    return typeof val === "string" ? val : fallback;
  };
}

export function useBusinessContact() {
  const s = useContext(Copy);
  return {
    email: typeof s.contact_email === "string" ? s.contact_email : "",
    location: typeof s.office_location === "string" ? s.office_location : "",
  };
}
