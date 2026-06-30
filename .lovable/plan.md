# CareBridge Phase 4 — Intelligence & Differentiation Layer

Phase 4 is large (15 modules + polish). To stay safe and avoid breaking the working platform, I'll ship it in **4 waves**, each independently usable. No existing dashboards, routes, queries, or tables get rewritten — everything is **additive**.

## Ground rules (apply to every wave)

- Reuse existing primitives: `AppShell`, `MetricCard`, `StatusBadge`, `LoadingState`/`ErrorState`/`EmptyState`, `NeedCard`, `useNeeds`/`useDonations`/etc. in `src/lib/queries.ts`.
- New logic lives in small new files: `src/lib/scoring.ts`, `src/lib/impact.ts`, `src/lib/badges.ts`, `src/components/app/*` additions.
- New DB only where needed (badges, certificates, feed reactions, AI placeholders). Existing tables get **derived** values in code, not schema rewrites.
- One migration per wave, batched.

---

## Wave 1 — Trust & Impact Surfaces (highest user-visible value)

**Modules 1, 2, 3, 4, 5, 7**

1. **Smart prioritization** (M1) — pure client scorer in `src/lib/scoring.ts` using `beneficiaries_count`, `deadline`, progress %, category weight, `verification`, `urgency`. Returns `{score, tier}` → `PriorityBadge` component. Add "Sort by AI Priority" option to `explore.tsx` and admin needs list. No schema change.
2. **Donation impact calculator** (M2) — `src/lib/impact.ts` maps category + amount → human sentences ("₹500 = school supplies for 5 children"). Render live in `needs.$id.tsx` donate form and post-donation toast. Cumulative impact shown on donor dashboard.
3. **Institution impact timeline** (M3) — new public route `institutions.$slug.timeline.tsx` (or tab on existing slug page). Reads `activity_log` filtered by institution + needs/donations/events join. Vertical timeline component reusing donor impact timeline styles.
4. **Transparency score** (M4) — `src/lib/transparency.ts` computes 0–100 from verification, reports count, donation utilisation %, profile completeness, recency. Surfaced as badge + explainer popover on institution profile.
5. **Public impact dashboard** (M5) — new route `impact.tsx` with live counters (animated) and 2–3 Recharts. Aggregates via `supabase.rpc`-style client queries (sum, count). Linked from header.
6. **Donation certificates** (M7) — new table `donation_certificates(id, donation_id, certificate_no, issued_at)`, auto-issued via trigger after `donations` insert. Client renders PDF with `jspdf` from a styled template; download button on donation history.

**Migration 1:** `donation_certificates` table + trigger; add `beneficiaries_count int` to `needs` if missing; add `priority_score numeric generated` column (optional, code-only fallback otherwise).

---

## Wave 2 — Personalization & Gamification

**Modules 6, 8, 13**

7. **Personalized recommendation panels** (M6) — `src/lib/recommend.ts` with role-specific heuristics (category overlap, city match, recency). Add `<RecommendedFor role=… />` widget block to each dashboard index (donor/volunteer/institution/admin) — appended, no existing layout removed.
8. **Achievements & badges** (M8) — `src/lib/badges.ts` defines catalog + earn rules. New tables `badges(code, label, description, icon, kind)` seeded via migration and `user_badges(user_id, badge_code, earned_at)`. Awarding done in DB triggers on donations, volunteer_applications, hours, institutions. UI: badge grid on profile, toast on earn.
9. **Profile achievements page** (M13) — new route `profile.tsx` (authenticated) showing contribution summary, hours, impact, certificates, badges, mini-timeline. Reuses existing query hooks.

**Migration 2:** `badges`, `user_badges`, award triggers.

---

## Wave 3 — Discovery, Community & Matching

**Modules 9, 10, 11, 12, 14**

10. **Advanced community feed** (M9) — extend `feed_posts` with `media_urls text[]`, `post_kind enum('update','announcement','impact','story')`. New tables `feed_reactions(post_id,user_id,kind)`, `feed_comments`, `feed_bookmarks`, `feed_reports`. Upgrade `feed.tsx` and add composer media upload via existing `FileUpload`.
11. **Volunteer matching** (M10) — `src/lib/matching.ts` scores opportunities vs profile (location, skills, languages, availability). Add `skills`, `languages`, `availability` to `profiles_private` (or new `volunteer_profiles`). UI: match % chip + "why" tooltip on opportunities; "Recommended for you" row on volunteer dashboard.
12. **Smart search upgrade** (M11) — extend existing `GlobalSearch` with sections (Institutions/Needs/Volunteers/Events/Reports/Users), trending causes (from view counts/donations 7d), quick-filter chips, popular searches table.
13. **Institution discovery map** (M12) — new route `map.tsx` using `leaflet` + `react-leaflet` (OpenStreetMap tiles, no key). Pins for institutions w/ lat/lng; filters by type + urgent needs; click → profile. Add nullable `lat`/`lng` to institutions.
14. **Public stats page** (M14) — `our-impact.tsx` with growth charts (donations over time, volunteers over time, top causes, top institutions). Recharts area/line/bar.

**Migration 3:** feed extensions, reactions/comments/bookmarks/reports tables, volunteer skill fields, popular_searches log, institution lat/lng.

---

## Wave 4 — AI-Ready Scaffolding & Polish

**Module 15 + platform polish**

15. **AI scaffolding** (M15) — empty tables: `ai_predictions(entity_type, entity_id, model, score, payload, created_at)`, `ai_recommendations(user_id, entity_type, entity_id, score, reason)`. Server fn stubs in `src/lib/ai.functions.ts` returning deterministic placeholders today. Routes `ai.predictions.tsx` / `ai.matching.tsx` already exist — wire to read these tables and show "Preview — model coming soon" cards. Architecture is the contract; no real model calls yet.
16. **Polish pass** — only where missing:
    - Add success animations (subtle `framer-motion` already not installed → use Tailwind keyframes; no new dep).
    - Confirm dialogs for destructive actions using existing `alert-dialog`.
    - Toasts via existing `sonner`.
    - Skeleton loading on remaining pages still using bare spinners.
    - Keyboard: `g d`, `g e`, `g i` shortcuts; `?` opens cheat-sheet.
    - A11y: focus rings, aria-labels on icon buttons, alt text audit.
    - Dark-mode token sweep (no toggle yet — tokens only).

**Migration 4:** `ai_predictions`, `ai_recommendations`, `popular_searches` (if not in W3).

---

## Technical notes

- **No external AI calls** this phase. Scoring, impact text, matching, transparency are all deterministic functions — easy to swap for real models later by replacing the function body, keeping the same return shape.
- **PDFs**: `jspdf` (~50KB, pure JS, edge-safe) — install once in Wave 1.
- **Maps**: `leaflet` + `react-leaflet` — installed Wave 3, lazy-loaded only on `/map`.
- **Charts**: existing `recharts` already in stack (shadcn chart).
- **All new tables** ship with explicit `GRANT`s and RLS scoped to `authenticated` (per project security memory).
- **Security memory**: continue revoking `EXECUTE` on new trigger functions from `PUBLIC`/`authenticated`.

## Order of operations next turn

If you approve, I'll start **Wave 1** in the next turn:
1. Migration 1 (certificates + need fields).
2. New libs: `scoring.ts`, `impact.ts`, `transparency.ts`.
3. New components: `PriorityBadge`, `ImpactCalculator`, `TransparencyScore`, `LiveCounter`.
4. New routes: `impact.tsx`, institution timeline tab.
5. Wire into `explore.tsx`, `needs.$id.tsx`, donor dashboard, institution profile, donations history.

Reply **"go"** to start Wave 1, or tell me to reshuffle / drop modules.
