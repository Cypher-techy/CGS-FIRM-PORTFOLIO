import defaultsByPage from "./copy-defaults.json";
import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import * as defaults from "./data";
const tables = {
  DIVISIONS: "business_divisions",
  SERVICES: "services",
  PRODUCTS: "products",
  PROJECTS: "projects",
  INDUSTRIES: "industries",
  PUBLICATIONS: "publications",
  VACANCIES: "careers",
} as const;
type Key = keyof typeof tables;
function publicDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: (url, options) =>
            fetch(url, { ...options, cache: "no-store" }),
        },
      })
    : null;
}
export const collection = cache(
  async <K extends Key>(k: K): Promise<(typeof defaults)[K]> => {
    const db = publicDb();
    if (!db) return defaults[k];
    const { data, error } = await db
      .from(tables[k])
      .select("*")
      .eq("published", true)
      .order(
        k === "PUBLICATIONS"
          ? "published_at"
          : k === "DIVISIONS" || k === "INDUSTRIES"
            ? "sort_order"
            : "created_at",
        { ascending: k !== "PUBLICATIONS" },
      )
      .order("slug");
    if (error) throw Error(`Could not load ${tables[k]}`);
    return data.map((r) => ({
      ...r,
      division: r.division_name,
      date: r.published_at,
    })) as (typeof defaults)[K];
  },
);
export const settings = cache(async (): Promise<Record<string, unknown>> => {
  const db = publicDb();
  if (!db) return {};
  const { data, error } = await db.from("website_settings").select("key,value");
  if (error) throw Error("Could not load website settings");
  return Object.fromEntries(data.map((x) => [x.key, x.value]));
});
export async function caseNotes(slug: string) {
  const db = publicDb();
  if (!db) return [];
  const { data, error } = await db
    .from("case_studies")
    .select("id,title,body,results,projects!inner(slug,published)")
    .eq("published", true)
    .eq("projects.slug", slug)
    .eq("projects.published", true);
  if (error) throw Error("Could not load case study");
  return data;
}
export async function copyFor(
  section: string,
): Promise<Record<string, string>> {
  const all = await settings(),
    key = `copy.${section}`,
    entry = all[key];
  const overrides =
    entry && typeof entry === "object"
      ? Object.fromEntries(
          Object.entries(entry).filter(([, v]) => typeof v === "string"),
        )
      : {};
  return {
    ...defaultsByPage[key as keyof typeof defaultsByPage],
    ...overrides,
  };
}
