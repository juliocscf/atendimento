import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

async function request(path, init = {}) {
  return fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    ...init,
  });
}

const home = await request("/");
assert.equal(home.status, 200, "home must be public");
assert.equal(home.headers.get("x-content-type-options"), "nosniff");
assert.equal(home.headers.get("x-frame-options"), "DENY");

const login = await request("/login");
assert.equal(login.status, 200, "login must be public");

for (const path of ["/dashboard", "/onboarding", "/clients"]) {
  const response = await request(path);
  assert.equal(response.status, 307, `${path} must redirect without a session`);
  assert.equal(response.headers.get("location"), "/login");
}

const onboardingApi = await request("/api/onboarding", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
assert.equal(onboardingApi.status, 401, "onboarding API must require authentication");

const clientsApi = await request("/api/clients", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
assert.equal(clientsApi.status, 401, "clients API must require authentication");

console.log("security smoke passed");
