# CareBridge Phase 2 — Platform Build Plan

This phase converts CareBridge from a marketing site into a working multi-role platform. The landing page stays as-is.

## Approach

Given the scope (auth, 5 roles, institution onboarding, need lifecycle, donations, volunteer flows, events, impact reports, community feed, notifications, admin, analytics, plus 6 "coming soon" modules), I'll build this in two passes:

**Pass 1 (this turn): Foundation + working frontend platform with mock data**
- Enable Lovable Cloud (for auth + DB in pass 2)
- Build complete UI/UX for every role with realistic seeded data
- All routes, dashboards, forms, workflows navigable end-to-end
- Role switcher in header (dev mode) so you can preview each role without real auth yet
- State persisted in localStorage so flows feel real (create need → appears in list → donate → progress updates)

**Pass 2 (next turn, after you confirm UX): Wire to Cloud**
- Real Supabase auth (email/password + Google), profiles, role table
- Migrate localStorage models to Postgres tables with RLS
- Replace mock calls with `createServerFn` handlers
- Storage buckets for institution photos, verification docs, impact report images

This split keeps Pass 1 reviewable without you having to sign up to click around, and avoids spending credits on schema we might iterate on.

## Pass 1 deliverables

### Auth shell (UI only, mock)
- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/onboarding/role`, `/onboarding/profile`
- Mock "session" in localStorage; role switcher pill in header

### Role-gated app shell
- `/app` layout with sidebar nav that adapts per role
- Donor, Volunteer, Mentor, Institution Admin, Platform Admin

### Donor
- `/app/donor` dashboard (4 metric cards + recent activity)
- `/app/donor/donations` history table, `/app/donor/saved`, `/app/donor/following`, `/app/donor/impact`

### Volunteer
- `/app/volunteer` dashboard
- `/app/volunteer/applications`, `/upcoming`, `/completed`, `/certificates`

### Mentor
- `/app/mentor` dashboard, `/sessions`, `/mentees`

### Institution
- `/app/institution` dashboard (active needs, donations, volunteers, events, residents, pending)
- `/app/institution/needs` list + `/needs/new` form + `/needs/$id` detail with updates timeline
- `/app/institution/events` list + `/new`
- `/app/institution/donations`, `/volunteers`, `/profile`, `/impact-reports`

### Platform Admin
- `/app/admin` dashboard
- `/app/admin/institutions` verification queue, `/users`, `/needs` moderation, `/reports`, `/analytics`, `/audit`

### Public platform pages (enhanced)
- `/institutions/$slug` full public profile (overview, mission, current/completed needs, events, gallery, impact reports, support CTAs)
- `/needs/$id` detail conversion page (overview, institution, why it matters, beneficiaries, progress, updates timeline, gallery, related, donate/volunteer/share/save actions)
- `/feed` community feed
- `/notifications` + header bell dropdown
- `/impact-reports/$id` public report
- `/events`, `/events/$id`

### Coming soon
- `/mentor-a-child`, `/adopt-a-grandparent`, `/ai/predictions`, `/ai/matching`, `/qr-tracking`, `/csr` — each a real route with a styled "Coming Soon" page and waitlist input

### Data layer
- `src/lib/store/` — typed mock store (zustand + localStorage) for users, institutions, needs, donations, applications, events, reports, notifications, feed posts
- Rich seed data so every dashboard shows real numbers

### Shared components
- `AppSidebar`, `RoleSwitcher`, `MetricCard`, `StatusBadge`, `ProgressBar` (already), `Timeline`, `EmptyState`, `DataTable`, `FormField`, `FileDropzone` (UI only), `NotificationBell`, `ComingSoon`

## Technical notes

- TanStack Router file routes under `src/routes/app/...` for the authenticated shell, public routes stay at root
- No `_authenticated/` gate in Pass 1 since auth is mocked; will add in Pass 2 with the integration-managed layout
- `zustand` for the mock store (small, no boilerplate)
- All forms use react-hook-form + zod (already present via shadcn form)
- Keep landing untouched

## What I will NOT do in Pass 1

- No backend, no real auth, no DB migrations, no edge functions
- No payment integration (donate buttons open a mock confirmation modal)
- No redesign of `/`, `/about`, `/explore`, etc. — only minor header tweak to add the "Sign in" → "Open app" affordance when a mock session exists

Confirm and I'll start building Pass 1. After you click through and approve the UX, Pass 2 wires it to Lovable Cloud.