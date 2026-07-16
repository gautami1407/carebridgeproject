/**
 * RLS regression tests — anonymous client.
 *
 * Exercises the Data API with the publishable (anon) key and asserts that
 * sensitive tables refuse reads/writes without a session. This is the
 * backend counterpart to tests/rbac/routes.spec.mjs (which only covers
 * client-side route guards).
 *
 * Run:  node tests/rbac/rls.spec.mjs
 * Env:  SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (read from .env if present)
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Minimal .env loader — avoids adding dotenv as a dep.
try {
  const raw = readFileSync(new URL("../../.env", import.meta.url), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]+)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch { /* .env optional */ }

const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!URL_ || !KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const anon = createClient(URL_, KEY, { auth: { persistSession: false } });

const results = { pass: 0, fail: 0, failures: [] };
function record(name, ok, detail = "") {
  if (ok) { results.pass++; console.log(`  ✓ ${name}`); }
  else { results.fail++; results.failures.push({ name, detail }); console.log(`  ✗ ${name}  ${detail}`); }
}

/** Assert an anonymous SELECT returns zero rows (either denied or filtered by RLS). */
async function expectAnonSelectEmpty(table) {
  const { data, error } = await anon.from(table).select("*").limit(1);
  // Either an RLS error OR an empty resultset is acceptable — both mean
  // no data leaks to anonymous callers.
  const ok = !!error || (Array.isArray(data) && data.length === 0);
  record(`anon SELECT ${table} → blocked/empty`, ok,
    error ? `error=${error.code ?? error.message}` : `rows=${data?.length}`);
}

/** Assert an anonymous INSERT is denied. */
async function expectAnonInsertDenied(table, row) {
  const { error } = await anon.from(table).insert(row).select();
  record(`anon INSERT ${table} → denied`, !!error, error?.message ?? "no error (leak!)");
}

/** Assert an anonymous UPDATE is denied (nothing updated). */
async function expectAnonUpdateDenied(table, patch) {
  const { data, error } = await anon.from(table).update(patch).neq("id", "00000000-0000-0000-0000-000000000000").select();
  const ok = !!error || (Array.isArray(data) && data.length === 0);
  record(`anon UPDATE ${table} → denied`, ok, error?.message ?? `updated=${data?.length}`);
}

/** Assert an anonymous DELETE is denied. */
async function expectAnonDeleteDenied(table) {
  const { data, error } = await anon.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000").select();
  const ok = !!error || (Array.isArray(data) && data.length === 0);
  record(`anon DELETE ${table} → denied`, ok, error?.message ?? `deleted=${data?.length}`);
}

async function main() {
  console.log(`\nRLS regression — ${URL_}\n`);

  // Tables that should NEVER expose data (or writes) to anonymous callers.
  const PRIVATE_TABLES = [
    "donations",
    "donation_certificates",
    "notifications",
    "activity_log",
    "user_roles",
    "user_badges",
    "profiles_private",
    "saved_items",
    "volunteer_applications",
    "impact_reports",
    "institution_documents",
    "event_registrations",
    "feed_posts",
  ];

  console.log("Anonymous SELECT must not leak private data:");
  for (const t of PRIVATE_TABLES) await expectAnonSelectEmpty(t);

  console.log("\nAnonymous writes must be denied:");
  await expectAnonInsertDenied("donations", { amount: 1, need_id: "00000000-0000-0000-0000-000000000000", donor_id: "00000000-0000-0000-0000-000000000000" });
  await expectAnonInsertDenied("volunteer_applications", { opportunity_id: "00000000-0000-0000-0000-000000000000", user_id: "00000000-0000-0000-0000-000000000000" });
  await expectAnonInsertDenied("user_roles", { user_id: "00000000-0000-0000-0000-000000000000", role: "admin" });
  await expectAnonInsertDenied("notifications", { user_id: "00000000-0000-0000-0000-000000000000", type: "generic", title: "x", body: "y" });
  await expectAnonInsertDenied("institutions", { name: "Rogue Institution", owner_id: "00000000-0000-0000-0000-000000000000" });
  await expectAnonInsertDenied("needs", { title: "Rogue Need", institution_id: "00000000-0000-0000-0000-000000000000", category: "other", goal_amount: 1 });

  await expectAnonUpdateDenied("institutions", { verification: "verified" });
  await expectAnonUpdateDenied("user_roles", { role: "admin" });
  await expectAnonUpdateDenied("needs", { status: "fulfilled" });

  await expectAnonDeleteDenied("donations");
  await expectAnonDeleteDenied("user_roles");
  await expectAnonDeleteDenied("institutions");

  // Publicly-listable content should still be reachable for the marketing site.
  console.log("\nPublic-readable tables remain reachable:");
  // NOTE: `institutions` and `needs` are intentionally NOT anon-readable
  // today (marketing pages hydrate them via authenticated queries). Add
  // them here if that policy ever changes.
  for (const t of ["volunteer_opportunities", "events", "badges"]) {
    const { error } = await anon.from(t).select("id").limit(1);
    record(`anon SELECT ${t} → allowed`, !error, error?.message ?? "");
  }

  console.log(`\nSummary: ${results.pass} passed, ${results.fail} failed`);
  if (results.fail > 0) {
    console.log("\nFailures:");
    for (const f of results.failures) console.log(`  - ${f.name} :: ${f.detail}`);
    process.exit(1);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
