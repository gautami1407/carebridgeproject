import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Calendar, Building2, Award, ArrowRight } from "lucide-react";
import { MetricCard, PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/volunteer/")({
  component: VolunteerDashboard,
});

function VolunteerDashboard() {
  const apps = useStore((s) => s.applications);
  const events = useStore((s) => s.events);
  const insts = useStore((s) => s.institutions);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Volunteer dashboard" subtitle="Your time, your skills, your impact." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Hours volunteered" value="48" icon={Clock} accent="support" />
        <MetricCard label="Events attended" value="6" icon={Calendar} />
        <MetricCard label="Institutions" value="3" icon={Building2} />
        <MetricCard label="Badges earned" value="4" icon={Award} accent="support" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">My applications</h2>
            <Link to="/app/volunteer/applications" className="text-sm font-semibold text-primary">View all <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {apps.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold">{a.opportunity}</p>
                  <p className="text-xs text-muted-foreground">{insts.find((i) => i.id === a.institutionId)?.name}</p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold">Upcoming events</h2>
          <ul className="mt-4 space-y-3">
            {events.slice(0, 3).map((e) => (
              <li key={e.id}>
                <Link to="/events/$id" params={{ id: e.id }} className="block rounded-lg border border-border p-3 hover:bg-muted">
                  <p className="text-sm font-semibold">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.date} • {e.time}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
