import { createFileRoute, Link } from "@tanstack/react-router";
import { ListChecks, HeartHandshake, Users, Calendar, Plus, ArrowRight } from "lucide-react";
import { MetricCard, PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/institution/")({
  component: InstitutionDashboard,
});

function InstitutionDashboard() {
  const session = useStore((s) => s.session);
  const instId = session?.institutionId ?? "inst-1";
  const needs = useStore((s) => s.needs).filter((n) => n.institutionId === instId);
  const donations = useStore((s) => s.donations).filter((d) => d.institutionId === instId);
  const events = useStore((s) => s.events).filter((e) => e.institutionId === instId);
  const inst = useStore((s) => s.institutions).find((i) => i.id === instId);
  const total = donations.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={inst?.name ?? "Institution"}
        subtitle="Manage your home, your needs and your community."
        action={<Link to="/app/institution/needs/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />New need</Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active needs" value={needs.filter((n) => n.status !== "Fulfilled").length} icon={ListChecks} accent="urgent" />
        <MetricCard label="Donations received" value={`₹${total.toLocaleString()}`} icon={HeartHandshake} accent="support" />
        <MetricCard label="Volunteers" value="14" icon={Users} />
        <MetricCard label="Upcoming events" value={events.length} icon={Calendar} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Active needs</h2>
            <Link to="/app/institution/needs" className="text-sm font-semibold text-primary">Manage <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
          </div>
          <ul className="mt-4 space-y-3">
            {needs.map((n) => (
              <li key={n.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <StatusBadge status={n.status} />
                </div>
                <div className="mt-2 h-2 rounded-full bg-surface-strong">
                  <div className="h-full rounded-full bg-support" style={{ width: `${(n.fulfilled / n.goal) * 100}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{n.fulfilled}/{n.goal} {n.unit}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold">Recent donations</h2>
          <ul className="mt-4 divide-y divide-border">
            {donations.slice(0, 6).map((d) => (
              <li key={d.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold">{d.donorName}</p>
                  <p className="text-xs text-muted-foreground">{d.date}</p>
                </div>
                <span className="font-bold">₹{d.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
