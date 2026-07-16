# RBAC / RLS regression tests

Automated checks that protected routes stay locked to anonymous visitors,
and that Supabase RLS policies keep private data private.

Two suites, run independently:

| Suite | File | What it verifies |
| ----- | ---- | ---------------- |
| Route guards | `tests/rbac/routes_spec.py` | Every `/app/*` route (donor, volunteer, mentor, institution, admin) redirects an anonymous browser to `/login`; marketing routes stay public. |
| RLS policies | `tests/rbac/rls.spec.mjs` | The anonymous Supabase client cannot read private tables (`donations`, `notifications`, `user_roles`, `profiles_private`, …) and cannot INSERT/UPDATE/DELETE sensitive tables. Known-public tables (`volunteer_opportunities`, `events`, `badges`) remain readable. |

## Running

```bash
# 1) Route guards — needs the dev server running on :8080
python3 tests/rbac/routes_spec.py

# 2) RLS — hits the live Supabase Data API with the anon key
node tests/rbac/rls.spec.mjs
```

Both scripts exit non-zero on the first failure, making them safe to wire
into CI. `routes_spec.py` uses Playwright's bundled Chromium; `rls.spec.mjs`
uses `@supabase/supabase-js` (already a project dependency) and reads
`SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` from `.env`.

## What is NOT covered

- Authenticated cross-role checks (e.g. a signed-in *donor* hitting
  `/app/admin`). Those require real user accounts per role; add fixture
  users and extend `routes.spec.mjs` with a signed-in context using the
  `LOVABLE_BROWSER_SUPABASE_*` env vars documented in the browser-use
  guide. The current suite only proves the anonymous baseline, which is
  where regressions most often slip in.
- Server-function authorization. Those live behind `requireSupabaseAuth`
  middleware and should get their own targeted tests when new privileged
  server functions land.
