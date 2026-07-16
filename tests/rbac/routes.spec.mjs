/**
 * RBAC route-guard regression tests (anonymous access).
 *
 * Verifies every protected route redirects anonymous visitors to /login,
 * and that public routes remain reachable. Uses Playwright's bundled
 * Chromium against the running dev server.
 *
 * Run:  node tests/rbac/routes.spec.mjs
 * Env:  BASE_URL (default http://localhost:8080)
 */
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

// Every path here is wrapped by SessionGuard (via /app) or RoleGuard.
// An anonymous visitor MUST be redirected to /login.
const PROTECTED_ROUTES = [
  // session-only
  "/app",
  "/app/index",
  "/notifications",
  "/profile",
  "/onboarding/role",
  "/onboarding/profile",
  // donor
  "/app/donor",
  "/app/donor/donations",
  "/app/donor/saved",
  "/app/donor/following",
  "/app/donor/impact",
  // volunteer
  "/app/volunteer",
  "/app/volunteer/applications",
  "/app/volunteer/upcoming",
  "/app/volunteer/completed",
  "/app/volunteer/certificates",
  // mentor
  "/app/mentor",
  "/app/mentor/mentees",
  "/app/mentor/sessions",
  // institution
  "/app/institution",
  "/app/institution/needs",
  "/app/institution/needs/new",
  "/app/institution/events",
  "/app/institution/events/new",
  "/app/institution/donations",
  "/app/institution/volunteers",
  "/app/institution/impact-reports",
  "/app/institution/profile",
  // admin
  "/app/admin",
  "/app/admin/users",
  "/app/admin/institutions",
  "/app/admin/needs",
  "/app/admin/reports",
  "/app/admin/analytics",
  "/app/admin/audit",
];

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/explore",
  "/institutions",
  "/events",
  "/stories",
  "/impact",
  "/login",
  "/register",
];

const results = { pass: 0, fail: 0, failures: [] };

function record(name, ok, detail = "") {
  if (ok) {
    results.pass++;
    console.log(`  ✓ ${name}`);
  } else {
    results.fail++;
    results.failures.push({ name, detail });
    console.log(`  ✗ ${name}  ${detail}`);
  }
}

async function waitForRedirect(page, timeoutMs = 4000) {
  // RoleGuard/SessionGuard redirect from useEffect; give it a beat.
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const url = new URL(page.url());
    if (url.pathname === "/login") return url.pathname;
    await page.waitForTimeout(120);
  }
  return new URL(page.url()).pathname;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  console.log(`\nRBAC route-guard regression — ${BASE_URL}\n`);

  console.log("Protected routes (anonymous → /login):");
  for (const path of PROTECTED_ROUTES) {
    try {
      await page.context().clearCookies();
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });
      const finalPath = await waitForRedirect(page);
      record(path, finalPath === "/login", `landed on ${finalPath}`);
    } catch (err) {
      record(path, false, `error: ${err.message}`);
    }
  }

  console.log("\nPublic routes (reachable while anonymous):");
  for (const path of PUBLIC_ROUTES) {
    try {
      await page.context().clearCookies();
      const resp = await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(300);
      const finalPath = new URL(page.url()).pathname;
      const ok = (resp?.status() ?? 200) < 400 && finalPath !== "/login";
      record(path, ok, `status=${resp?.status()} path=${finalPath}`);
    } catch (err) {
      record(path, false, `error: ${err.message}`);
    }
  }

  await browser.close();

  console.log(`\nSummary: ${results.pass} passed, ${results.fail} failed`);
  if (results.fail > 0) {
    console.log("\nFailures:");
    for (const f of results.failures) console.log(`  - ${f.name} :: ${f.detail}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
