import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Calendar, Building2, Award, ArrowRight, Sparkles } from "lucide-react";
import { MetricCard, PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyApplications, useEvents, useAllOpportunities, useUserBadges } from "@/lib/queries";
import { recommendOpportunitiesForVolunteer } from "@/lib/recommend";
import { iconFor, TIER_STYLES, type BadgeTier } from "@/lib/badges";

export const Route = createFileRoute("/app/volunteer/")({ component: VolunteerDashboard });

function VolunteerDashboard() {
  const { data: apps = [] } = useMyApplications();
  const { data: events = [] } = useEvents({ upcomingOnly: true });
  const { data: opps = [] } = useAllOpportunities();
  const { data: myBadges = [] } = useUserBadges();
  const hours = apps.reduce((a, b) => a + Number(b.hours_logged ?? 0), 0);
  const insts = new Set(apps.map((a) => (a.opportunity as { institution_id?: string } | null)?.institution_id).filter(Boolean)).size;
  const recommended = recommendOpportunitiesForVolunteer(opps as never[], {}, 3);


  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Volunteer dashboard" subtitle="Your time, your skills, your impact." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Hours volunteered" value={hours} icon={Clock} accent="support" />
        <MetricCard label="Applications" value={apps.length} icon={Calendar} />
        <MetricCard label="Institutions" value={insts} icon={Building2} />
        <MetricCard label="Accepted" value={apps.filter((a) => a.status === "accepted" || a.status === "completed").length} icon={Award} accent="support" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">My applications</h2>
            <Link to="/app/volunteer/applications" className="text-sm font-semibold text-primary">View all <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
          </div>
          {apps.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No applications yet. <Link to="/volunteer" className="font-semibold text-primary">Browse opportunities →</Link></p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {apps.slice(0, 5).map((a) => {
                const o = a.opportunity as { title?: string; institution?: { name?: string } | null } | null;
                return (
                  <li key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold">{o?.title}</p>
                      <p className="text-xs text-muted-foreground">{o?.institution?.name}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold">Upcoming events</h2>
          {events.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No upcoming events.</p> : (
            <ul className="mt-4 space-y-3">
              {events.slice(0, 3).map((e) => (
                <li key={e.id}>
                  <Link to="/events/$id" params={{ id: e.id }} className="block rounded-lg border border-border p-3 hover:bg-muted">
                    <p className="text-sm font-semibold">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(e.starts_at).toLocaleString()}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="text-lg font-bold flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Recommended opportunities</h2>
          <p className="text-xs text-muted-foreground">Matched to your profile and interests</p>
          {recommended.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No open opportunities right now.</p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {recommended.map((o) => (
                <li key={o.id}>
                  <div className="block rounded-lg border border-border p-3 hover:bg-muted">
                    <p className="text-sm font-semibold">{o.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground capitalize">{o.category ?? "General"}{o.city ? ` • ${o.city}` : ""}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold flex items-center gap-2"><Award className="size-4 text-primary" /> Achievements</h2>
          {myBadges.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Apply to your first opportunity to earn your first badge.</p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {myBadges.slice(0, 6).map((ub) => {
                const b = ub.badge as { name: string; icon: string; tier: string } | null;
                if (!b) return null;
                const Icon = iconFor(b.icon);
                const tone = TIER_STYLES[(b.tier as BadgeTier) ?? "bronze"];
                return (
                  <li key={ub.badge_id} title={b.name} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone.chip}`}>
                    <Icon className="size-3" aria-hidden />
                    {b.name}
                  </li>
                );
              })}
            </ul>
          )}
          <Link to="/profile" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">View all badges <ArrowRight className="size-3" /></Link>
        </div>
      </div>
    </div>
  );
}
