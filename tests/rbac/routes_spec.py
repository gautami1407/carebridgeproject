"""RBAC route-guard regression tests (anonymous access).

Verifies every protected route redirects anonymous visitors to /login, and
that public marketing routes remain reachable. Uses Playwright's bundled
Chromium against a running dev server.

Run:   python3 tests/rbac/routes_spec.py
Env:   BASE_URL (default http://localhost:8080)
"""
import asyncio
import os
import sys
from urllib.parse import urlparse

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080")

# Every path here is wrapped by SessionGuard (via /app) or RoleGuard.
# An anonymous visitor MUST be redirected to /login.
PROTECTED_ROUTES = [
    "/app", "/notifications", "/profile",
    "/onboarding/role", "/onboarding/profile",
    # donor
    "/app/donor", "/app/donor/donations", "/app/donor/saved",
    "/app/donor/following", "/app/donor/impact",
    # volunteer
    "/app/volunteer", "/app/volunteer/applications", "/app/volunteer/upcoming",
    "/app/volunteer/completed", "/app/volunteer/certificates",
    # mentor
    "/app/mentor", "/app/mentor/mentees", "/app/mentor/sessions",
    # institution
    "/app/institution", "/app/institution/needs", "/app/institution/needs/new",
    "/app/institution/events", "/app/institution/events/new",
    "/app/institution/donations", "/app/institution/volunteers",
    "/app/institution/impact-reports", "/app/institution/profile",
    # admin
    "/app/admin", "/app/admin/users", "/app/admin/institutions",
    "/app/admin/needs", "/app/admin/reports", "/app/admin/analytics",
    "/app/admin/audit",
]

PUBLIC_ROUTES = [
    "/", "/about", "/contact", "/explore", "/institutions",
    "/events", "/stories", "/impact", "/login", "/register",
]

results = {"pass": 0, "fail": 0, "failures": []}


def record(name, ok, detail=""):
    if ok:
        results["pass"] += 1
        print(f"  ✓ {name}")
    else:
        results["fail"] += 1
        results["failures"].append((name, detail))
        print(f"  ✗ {name}  {detail}")


async def wait_for_redirect(page, timeout_ms=4000):
    """RoleGuard/SessionGuard redirect from useEffect; poll for /login."""
    deadline = asyncio.get_event_loop().time() + timeout_ms / 1000
    while asyncio.get_event_loop().time() < deadline:
        path = urlparse(page.url).path
        if path == "/login":
            return path
        await page.wait_for_timeout(120)
    return urlparse(page.url).path


async def main():
    print(f"\nRBAC route-guard regression — {BASE_URL}\n")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await context.new_page()

        print("Protected routes (anonymous → /login):")
        for path in PROTECTED_ROUTES:
            try:
                await context.clear_cookies()
                await page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded")
                final_path = await wait_for_redirect(page)
                record(path, final_path == "/login", f"landed on {final_path}")
            except Exception as e:
                record(path, False, f"error: {e}")

        print("\nPublic routes (reachable while anonymous):")
        for path in PUBLIC_ROUTES:
            try:
                await context.clear_cookies()
                resp = await page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded")
                await page.wait_for_timeout(300)
                final_path = urlparse(page.url).path
                status = resp.status if resp else 0
                ok = status < 400 and final_path != "/login"
                record(path, ok, f"status={status} path={final_path}")
            except Exception as e:
                record(path, False, f"error: {e}")

        await browser.close()

    print(f"\nSummary: {results['pass']} passed, {results['fail']} failed")
    if results["fail"] > 0:
        print("\nFailures:")
        for name, detail in results["failures"]:
            print(f"  - {name} :: {detail}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
