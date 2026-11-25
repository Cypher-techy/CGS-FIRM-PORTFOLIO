import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// Safe for the read-only local preview; never post fixtures to production.
const base = process.env.TEST_ORIGIN || "http://127.0.0.1:3000";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname))
  throw Error("Run this smoke suite locally only");
const origin = new URL(base);
const todo = new Set(["/", "/sitemap.xml", "/robots.txt"]),
  seen = new Set(),
  out = new Set();
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
  todo.add(new URL(m[1]).pathname);
while (todo.size) {
  const url = todo.values().next().value;
  todo.delete(url);
  if (seen.has(url) || url.startsWith("/admin")) continue;
  seen.add(url);
  const res = await fetch(base + url);
  assert.equal(res.status, 200, url);
  const html = await res.text();
  if (url.endsWith(".xml") || url.endsWith(".txt")) continue;
  assert.ok(html.includes("<h1"), url);
  for (const m of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)) {
    const link = m[1].replaceAll("&amp;", "&");
    assert.notEqual(link, "#", url);
    if (link.startsWith("/")) {
      const u = new URL(link, origin);
      todo.add(u.pathname + u.search);
    } else if (link.startsWith("https:")) out.add(link);
  }
}
const seed = readFileSync("lib/data.ts", "utf8");
for (const [, u] of seed.matchAll(/url: "(https:\/\/[^"\s]+)"/g))
  assert.ok(out.has(u), u);
for (const route of [
  "dashboard",
  "services",
  "products",
  "projects",
  "publications",
  "careers",
  "applications",
  "inquiries",
  "partnerships",
  "settings",
  "profiles",
  "media",
  "case_studies",
  "industries",
  "business_divisions",
]) {
  const r = await fetch(`${base}/admin/${route}`, { redirect: "manual" });
  assert.ok([307, 308].includes(r.status), route);
  assert.equal(
    new URL(r.headers.get("location"), base).pathname,
    "/admin/login",
  );
}
for (const [name, fixture] of Object.entries({
  inquiries: {
    name: "Test person",
    email: "x@example.test",
    message: "Local smoke check",
  },
  applications: {
    career_slug: "test",
    career_title: "Test",
    applicant_name: "Test person",
    email: "x@example.test",
    cover_letter: "Local smoke check",
  },
  partnerships: {
    partnership_type: "Research",
    organisation: "Example",
    contact_name: "Test person",
    email: "x@example.test",
    proposal: "Local smoke check",
  },
})) {
  const post = (payload) =>
    fetch(`${base}/api/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  assert.equal((await post({})).status, 400);
  assert.equal((await post({ ...fixture, website: "bot" })).status, 200);
  assert.equal((await post(fixture)).status, 503);
}
console.log(
  `Passed: ${seen.size} internal URLs; all 10 portfolio destinations present; 15 admin redirects; 9 intake checks.`,
);
