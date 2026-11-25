import { siteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";
import { collection } from "@/lib/content";
import * as fallback from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Sitemap generation must not take down the deployment when Supabase is
  // temporarily unavailable or a content table has not been provisioned yet.
  // Use the checked-in content catalogue as a fallback for each collection.
  const [DIVISIONS, SERVICES, PRODUCTS, PROJECTS, PUBLICATIONS] =
    await Promise.all([
      collection("DIVISIONS").catch(() => fallback.DIVISIONS),
      collection("SERVICES").catch(() => fallback.SERVICES),
      collection("PRODUCTS").catch(() => fallback.PRODUCTS),
      collection("PROJECTS").catch(() => fallback.PROJECTS),
      collection("PUBLICATIONS").catch(() => fallback.PUBLICATIONS),
    ]);

  const base = siteUrl;
  const staticRoutes = [
    "",
    "/about",
    "/divisions",
    "/services",
    "/products",
    "/projects",
    "/industries",
    "/research",
    "/insights",
    "/partnerships",
    "/careers",
    "/contact",
  ].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.8,
  }));

  const dynamic = [
    ...DIVISIONS.map((d) => `/divisions/${d.slug}`),
    ...SERVICES.map((s) => `/services/${s.slug}`),
    ...PRODUCTS.map((p) => `/products/${p.slug}`),
    ...PROJECTS.map((p) => `/projects/${p.slug}`),
    ...PUBLICATIONS.map((p) => `/insights/${p.slug}`),
  ].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamic];
}
