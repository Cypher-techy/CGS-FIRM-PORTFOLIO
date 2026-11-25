// Runtime regression test, exclusively for the loopback-configured CI build.
// Exercise the real SDK against a controlled HTTP fixture, not a hosted database.
import assert from "node:assert/strict";
import { createServer } from "node:http";
const app = `http://127.0.0.1:${Number(process.env.TEST_PORT || 3000)}`;
let published = true,
  omitProducts = false;
const product = {
  slug: "fixture-software",
  name: "Runtime fixture platform",
  category: "Test",
  classification: "Test",
  description: "Fixture",
  features: [],
  status: "Beta",
  stack: [],
  url: "https://example.invalid",
  accent: "",
  screenshots: [],
  published: true,
};
const service = {
  slug: "fixture-service",
  title: "Runtime service",
  division_name: "Geospatial",
  summary: "Fixture",
  scope: [],
  deliverables: [],
  industries: [],
  technologies: [],
  published: true,
};
const project = {
  slug: "fixture-project",
  name: "Runtime project",
  client: "Test",
  category: "Test",
  description: "Fixture",
  objectives: [],
  scope: [],
  features: [],
  technologies: [],
  url: "https://example.invalid",
  featured: true,
  ownership: "Client-commissioned",
  screenshots: [],
  published: true,
};
const rows = {
  products: [product],
  services: [service],
  projects: [project],
  publications: [
    {
      slug: "fixture-publication",
      title: "Runtime publication",
      published_at: "2026-01-01",
      excerpt: null,
      body: [],
      tags: [],
      type: "Article",
      published: true,
    },
  ],
  website_settings: [{ key: "site_title", value: "Runtime site title" }],
};
const requests = [];
const server = createServer((req, res) => {
  const u = new URL(req.url, "http://localhost");
  const table = u.pathname.replace("/rest/v1/", "");
  requests.push([table, u.searchParams.get("published"), req.headers.apikey]);
  res.setHeader("Content-Type", "application/json");
  if (table === "products" && omitProducts) {
    res.statusCode = 403;
    res.end(JSON.stringify({ code: "42501", message: "fixture read denied" }));
    return;
  }
  res.end(
    JSON.stringify(table === "products" && !published ? [] : rows[table] || []),
  );
});
await new Promise((ok, fail) =>
  server.once("error", fail).listen(3399, "127.0.0.1", ok),
);
const text = async (path) => {
  const response = await fetch(app + path);
  assert.equal(response.status, 200, path);
  return response.text();
};
try {
  for (const [path, needle] of [
    ["/", "Runtime site title"],
    ["/products/fixture-software", "Runtime fixture platform"],
    ["/projects/fixture-project", "Runtime project"],
    ["/services/fixture-service", "Geospatial"],
    ["/insights?q=unmatched", "<h1"],
    ["/sitemap.xml", "/products/fixture-software</loc>"],
  ])
    assert.ok((await text(path)).includes(needle), path);
  published = false;
  assert.ok(
    !(await text("/sitemap.xml")).includes("/products/fixture-software"),
  );
  omitProducts = true;
  const degraded = await text("/sitemap.xml");
  assert.ok(degraded.includes("/projects/fixture-project"));
  assert.ok(!degraded.includes("/products/cypher-terra"));
  assert.ok((await text("/contact")).includes("mailto:"));
  assert.ok(requests.length > 0);
  for (const [table, filter, key] of requests) {
    assert.equal(key, "sb_publishable_local_fixture");
    if (table !== "website_settings") assert.equal(filter, "eq.true", table);
  }
  console.log(
    "Live SDK / local fixture: request-time content, detail pages, published-only queries, withdrawal, partial failure, and metadata passed.",
  );
} finally {
  await new Promise((ok) => server.close(ok));
}
