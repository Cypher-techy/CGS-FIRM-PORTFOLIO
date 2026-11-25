import { publicSupabaseConfig } from "@/lib/supabase/public-config";
import { ContentReadError, readFailure } from "./supabase/read-error";
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
  const { url, key } = publicSupabaseConfig();
  if (!url && !key && process.env.VERCEL_ENV !== "production") return null; // intentional unconfigured preview
  if (!url || !key) throw readFailure("public client", 0, "INCOMPLETE_CONFIG");
  try {
    return createClient(url, key, {
      db: { schema: "public", timeout: 5000, retry: false },
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, options) =>
          fetch(url, {
            ...options,
            cache: "no-store",
          }),
      },
    });
  } catch {
    throw readFailure("public client", 0, "INVALID_CONFIG");
  }
}
export const collection = cache(
  async <K extends Key>(k: K): Promise<(typeof defaults)[K]> => {
    const db = publicDb();
    if (!db) return defaults[k];
    const { data, error, status } = await db
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
    if (error) throw readFailure(tables[k], status, error.code);
    return data.map((r) => ({
      ...r,
      ...(k === "SERVICES" ? { division: r.division_name ?? "" } : {}),
      ...(k === "PUBLICATIONS"
        ? { date: r.published_at, excerpt: r.excerpt ?? "" }
        : {}),
    })) as (typeof defaults)[K];
  },
);
// Only optional sections may degrade. An unavailable primary collection is not
// an empty database or a 404; let the directory/detail error boundary handle it.
async function optional<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (e) {
    if (!(e instanceof ContentReadError)) throw e;
    return fallback;
  }
}
export function optionalCollection<K extends Key>(k: K) {
  return optional<(typeof defaults)[K] | never[]>(() => collection(k), []);
}
export const settings = cache(() =>
  optional<Record<string, unknown>>(async () => {
    const db = publicDb();
    if (!db) return {};
    const { data, error, status } = await db
      .from("website_settings")
      .select("key,value");
    if (error) throw readFailure("website_settings", status, error.code);
    return Object.fromEntries(data.map((x) => [x.key, x.value]));
  }, {}),
);
export async function caseNotes(slug: string) {
  return optional(async () => {
    const db = publicDb();
    if (!db) return [];
    const { data, error, status } = await db
      .from("case_studies")
      .select("id,title,body,results,projects!inner(slug,published)")
      .eq("published", true)
      .eq("projects.slug", slug)
      .eq("projects.published", true);
    if (error) throw readFailure("case_studies", status, error.code);
    return data;
  }, []);
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
