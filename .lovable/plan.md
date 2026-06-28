
# Phase 3 — Audit, Connect, Wire to Cloud

Goal: every page in the app reads/writes real Lovable Cloud data, no dead-end buttons, role-based nav is enforced, and image/document uploads work. No new modules, no landing-page work.

## 1. Database additions (one migration)

Tables already live: `profiles`, `profiles_private`, `user_roles`, `institutions`, `needs`, `donations`.

Add these (with GRANTs + RLS scoped to `auth.uid()` and `private.has_role`):

- `events` — institution_id, title, description, starts_at, location, capacity, banner_url
- `event_registrations` — event_id, user_id, status
- `volunteer_opportunities` — institution_id, title, category, skills[], location, starts_at, ends_at, slots
- `volunteer_applications` — opportunity_id, user_id, status, message, hours_logged
- `notifications` — user_id, type, title, body, link, read_at
- `activity_log` — user_id, type, entity_type, entity_id, summary
- `impact_reports` — need_id, institution_id, summary, beneficiaries, photos[], outcomes, published_at
- `feed_posts` — author_id (institution or user), kind, body, media[], related_entity
- `saved_items` — user_id, entity_type, entity_id (replaces mock favorites)

Triggers: insert into `activity_log` + `notifications` on donation, application, registration, need status change.

## 2. Storage buckets

- `institution-docs` (private) — verification PDFs/images; readable by owning institution + admins
- `public-media` (public) — need images, event banners, impact photos, avatars

RLS on `storage.objects` keyed by path prefix `{user_id}/...` or `{institution_id}/...`.

Reusable `<FileUpload>` component (drag/drop, preview, progress) used everywhere uploads happen.

## 3. Replace mock store with real data hooks

Delete the seeded data from `src/lib/store.ts`. Keep only UI state (sidebar collapsed, recent searches). All entity reads/writes move to TanStack Query hooks under `src/lib/queries/`:

- `useNeeds`, `useNeed`, `useCreateNeed`, `useUpdateNeed`
- `useInstitutions`, `useInstitution`, `useUpdateInstitution`
- `useDonations`, `useCreateDonation`
- `useEvents`, `useEventRegistrations`
- `useOpportunities`, `useApplications`
- `useNotifications`, `useMarkRead`
- `useFeed`, `useActivity`, `useImpactReport`
- `useSaved`, `useToggleSave`

Each hook uses the browser supabase client; writes use server functions when they touch other users' data or trigger side effects.

## 4. Auth & role-based routing

- Move every `/app/*` route under `src/routes/_authenticated/` so the integration's managed gate redirects unauth users to `/auth` (replacing the bespoke gate in `AppShell`).
- Add a `useCurrentRole()` hook that reads `user_roles` once per session.
- Sidebar in `AppShell` already filters by role — confirm every nav item points at a real route and remove orphan items.
- Per-role layout routes (`_authenticated/donor`, `/volunteer`, `/mentor`, `/institution`, `/admin`) call `private.has_role` via a server fn in `beforeLoad` and redirect to `/app` if the user lacks the role.

## 5. Connect every page

Audit pass — open each route, replace mock reads with the new hooks, add loading/empty/error states using shared `<EmptyState>`, `<LoadingState>`, `<ErrorState>` components. Wire every button to a real action or remove it.

Public routes that need to work without auth (`/needs/:id`, `/institutions/:slug`, `/events/:id`, `/impact-reports/:id`) get public server functions using the server publishable client + narrow `TO anon` SELECT policies on safe columns only.

Forms (institution profile, new need, new event, new opportunity, donation, application, profile) get Zod validation and toast feedback on success/error.

## 6. Cross-cutting components

Standardise and dedupe:

- `<PageHeader>` (title, description, actions)
- `<StatCard>`, `<ProgressCard>`
- `<NeedCard>`, `<InstitutionCard>`, `<EventCard>`, `<OpportunityCard>`, `<NotificationItem>` — single source of truth, used by both public pages and dashboards
- `<FiltersBar>` driven by URL search params (Zod-validated) so filters survive refresh and are shareable
- `<DataTable>` wrapper around shadcn `Table` for admin pages
- Empty / loading / error state primitives

## 7. Notifications & activity

- Bell in `AppShell` reads `notifications` (with realtime channel subscription), shows unread count, dropdown lists recent, link to `/app/notifications` page.
- Profile dropdown gets an "Activity" link → renders `activity_log` for current user.

## 8. Admin moderation

- Institution verification page: list `pending` institutions with docs from `institution-docs` bucket, approve/reject buttons call server fn requiring `admin` role.
- User list reads from `profiles` + `user_roles`; admins can grant/revoke roles via server fn.
- Need moderation: flag/unpublish.

## 9. Out of scope (explicit)

- No landing-page changes.
- No new feature modules — placeholders (Mentor-a-Child, AI Matching, CSR) stay as "Coming soon" pages.
- No payment integration — donations record an entry only.
- No realtime feed; notifications get realtime, feed is polled.
- No i18n, no PWA, no analytics dashboards (the chart placeholders stay).

## Order of execution

1. Migration (tables + RLS + triggers) and storage buckets — single commit.
2. Replace store with query hooks; move routes under `_authenticated/`; wire `AppShell` and auth gate.
3. Page-by-page audit: dashboards → listings → detail pages → forms → admin.
4. File upload component + plug into institution profile, need form, event form, impact reports.
5. Notifications bell + realtime + activity log surfacing.
6. Final pass: empty/loading/error states, accessibility labels, sidebar dedupe.

This is ~6–10 turns of work. Approving this plan starts step 1 (the migration).
