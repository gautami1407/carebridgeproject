import { createFileRoute, Link } from "@tanstack/react-router";
import { ListChecks, HeartHandshake, Users, Calendar, Plus, ArrowRight } from "lucide-react";
import { MetricCard, PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyInstitution, useNeeds, useInstitutionDonations, useEvents } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/institution/")({ component: InstitutionDashboard });

function InstitutionDashboard() {
  const { data: inst, isLoading: instLoading } = useMyInstitution();
  const { data: needs = [] } = useNeeds({ institutionId: inst?.id });
  const { data: donations = [] } = useInstitutionDonations(inst?.id);
  const { data: events = [] } = useEvents({ institutionId: inst?.id, upcomingOnly: true });
  const total = donations.reduce((a, b) => a + Number(b.amount), 0);

  if (instLoading) return <LoadingState label="Loading your institution…" />;
  if (!inst) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="No institution linked to your account"
          body="To manage needs, donations, and events, you need to be the owner of an institution. Contact a platform admin to get linked, or register a new institution."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={inst.name}
        subtitle="Manage your home, your needs and your community."
        action={<Link to="/app/institution/needs/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />New need</Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active needs" value={needs.filter((n) => n.status !== "fulfilled" && n.status !== "closed").length} icon={ListChecks} accent="urgent" />
        <MetricCard label="Donations received" value={`₹${total.toLocaleString()}`} icon={HeartHandshake} accent="support" />
        <MetricCard label="Upcoming events" value={events.length} icon={Calendar} />
        <MetricCard label="Residents" value={inst.residents_count ?? 0} icon={Users} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Active needs</h2>
            <Link to="/app/institution/needs" className="text-sm font-semibold text-primary">Manage <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
          </div>
          {needs.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">No needs yet. <Link to="/app/institution/needs/new" className="font-semibold text-primary">Create one →</Link></p> : (
            <ul className="mt-4 space-y-3">
              {needs.slice(0, 5).map((n) => {
                const pct = Math.round((Number(n.raised_amount) / Math.max(1, Number(n.goal_amount))) * 100);
                return (
                  <li key={n.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Link to="/app/institution/needs/$id" params={{ id: n.id }} className="text-sm font-semibold hover:text-primary">{n.title}</Link>
                      <StatusBadge status={n.status} />
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-surface-strong">
                      <div className="h-full rounded-full bg-support" style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">₹{Number(n.raised_amount).toLocaleString()} / ₹{Number(n.goal_amount).toLocaleString()}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold">Recent donations</h2>
          {donations.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">No donations yet.</p> : (
            <ul className="mt-4 divide-y divide-border">
              {donations.slice(0, 6).map((d) => {
                const donor = d.donor as { full_name?: string | null } | null;
                return (
                  <li key={d.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-semibold">{d.is_anonymous ? "Anonymous" : donor?.full_name ?? "Supporter"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold">₹{Number(d.amount).toLocaleString()}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
