// Loopback-only integration fixture for the offline-cms-build job. The test Auth
// service issues its own opaque-to-the-app session and validates it on /user.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { randomUUID, createHmac, randomBytes } from "node:crypto";
const app = `http://127.0.0.1:${Number(process.env.TEST_PORT || 3000)}`;
const user = {
  id: randomUUID(),
  aud: "authenticated",
  role: "authenticated",
  email: "staff@example.test",
  app_metadata: { provider: "email" },
  user_metadata: {},
  created_at: new Date().toISOString(),
};
const encode = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const exp = Math.floor(Date.now() / 1000) + 3600;
const headerPayload = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: user.id, aud: "authenticated", role: "authenticated", exp })}`;
const token =
  headerPayload +
  "." +
  createHmac("sha256", randomBytes(32))
    .update(headerPayload)
    .digest("base64url");
let signedIn = false,
  role = null,
  logoutCalls = 0;
const password = randomUUID();
const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  const send = (status, body) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(body === undefined ? "" : JSON.stringify(body));
  };
  if (path === "/auth/v1/token" && req.method === "POST") {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const data = JSON.parse(raw);
    if (data.password !== password || data.email !== user.email)
      return send(400, {
        error_code: "invalid_credentials",
        msg: "Invalid credentials",
      });
    signedIn = true;
    return send(200, {
      access_token: token,
      refresh_token: randomUUID(),
      token_type: "bearer",
      expires_in: 3600,
      expires_at: exp,
      user,
    });
  }
  if (!signedIn || req.headers.authorization !== "Bearer " + token)
    return send(401, { msg: "No session" });
  if (path === "/auth/v1/user") return send(200, user);
  if (path === "/auth/v1/logout") {
    signedIn = false;
    logoutCalls++;
    return send(204);
  }
  if (path === "/rest/v1/profiles") return send(200, role ? [{ role }] : []);
  return send(404, {});
});
await new Promise((ok, fail) =>
  server.once("error", fail).listen(3399, "127.0.0.1", ok),
);
const jar = new Map();
async function visit(path, body) {
  const res = await fetch(app + path, {
    redirect: "manual",
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  for (const line of res.headers.getSetCookie()) {
    const pair = line.split(";")[0],
      i = pair.indexOf("="),
      k = pair.slice(0, i),
      v = pair.slice(i + 1);
    if (v) jar.set(k, v);
    else jar.delete(k);
  }
  return res;
}
try {
  const login = (p) =>
    visit("/api/admin/login", { email: user.email, password: p });
  assert.equal((await login("invalid")).status, 401);
  assert.equal(
    (await login(password)).status,
    403,
    "confirmed account without a staff profile",
  );
  assert.equal((await visit("/techy/dashboard")).status, 307);
  role = "editor";
  assert.equal((await login(password)).status, 200);
  assert.ok(jar.size);
  for (let i = 0; i < 2; i++)
    assert.ok(
      (await (await visit("/techy/dashboard")).text()).includes("Overview"),
      "session persists across requests",
    );
  assert.equal(
    (await visit("/techy/profiles")).status,
    403,
    "editor cannot manage roles",
  );
  assert.equal((await visit("/api/admin/logout", {})).status, 200);
  assert.ok(logoutCalls >= 2);
  const end = await visit("/techy/dashboard");
  assert.equal(end.status, 307);
  assert.equal(new URL(end.headers.get("location")).pathname, "/techy/login");
  console.log(
    "Password/session contract with local Auth fixture: invalid credentials, missing profile, dashboard, session reuse, role denial and logout passed.",
  );
} finally {
  await new Promise((ok) => server.close(ok));
}
