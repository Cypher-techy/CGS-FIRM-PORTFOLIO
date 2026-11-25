import { siteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";
import { optionalCollection } from "@/lib/content";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Never advertise seed slugs for a connected table that is down or unpublished.
  const [DIVISIONS, SERVICES, PRODUCTS, PROJECTS, PUBLICATIONS] =
    await Promise.all([
      optionalCollection("DIVISIONS"),
      optionalCollection("SERVICES"),
      optionalCollection("PRODUCTS"),
      optionalCollection("PROJECTS"),
      optionalCollection("PUBLICATIONS"),
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
