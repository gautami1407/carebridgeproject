import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Calendar, Users, Activity, ArrowRight } from "lucide-react";
import { MetricCard } from "@/components/app/AppShell";
import { CommandGreeting, UrgentPanel, MonthlySummary, UpNext, isThisMonth, type UrgentItem } from "@/components/app/CommandCenter";
import { LiveActivityFeed } from "@/components/app/LiveActivityFeed";
import { LoadingState } from "@/components/app/states";
import { useMentorApplications, useOpenMentorships } from "@/lib/queries";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/mentor/")({ component: MentorDashboard });

function MentorDashboard() {
  const name = useStore((s) => s.session?.name);
  const { data: apps = [], isLoading } = useMentorApplications();
  const { data: open = [] } = useOpenMentorships(6);

  if (isLoading) return <LoadingState label="Loading your mentorships…" />;

  const accepted = apps.filter((a) => a.status === "accepted");
  const pending = apps.filter((a) => a.status === "pending");
  const hours = apps.reduce((sum, a) => sum + Number(a.hours_logged ?? 0), 0);
  const institutions = new Set(accepted.map((a) => a.opportunity?.institution_id).filter(Boolean));
  const sessionsThisMonth = apps.filter((a) => isThisMonth(a.updated_at)).length;

  const urgent: UrgentItem[] = [
    ...pending.map((a) => ({
      id: a.id,
      title: `Awaiting decision — ${a.opportunity?.title ?? "Mentorship"}`,
      detail: `${a.opportunity?.institution?.name ?? "Institution"} · applied ${new Date(a.created_at).toLocaleDateString()}`,
      href: "/app/mentor/sessions",
    })),
    ...(accepted.length === 0
      ? open.slice(0, 3).map((o) => ({
          id: o.id,
          title: `Open mentorship — ${o.title}`,
          detail: `${o.institution?.name ?? "Institution"}${o.location ? ` · ${o.location}` : ""}`,
          href: "/volunteer",
        }))
      : []),
  ];

  const upNext = accepted
    .filter((a) => a.opportunity?.starts_at && new Date(a.opportunity.starts_at) >= new Date())
    .sort((a, b) => new Date(a.opportunity!.starts_at!).getTime() - new Date(b.opportunity!.starts_at!).getTime())
    .map((a) => ({
      id: a.id,
      title: a.opportunity?.title ?? "Mentorship session",
      when: new Date(a.opportunity!.starts_at!).toLocaleString(),
      href: "/app/mentor/sessions",
    }));

  return (
    <div className="mx-auto max-w-6xl">
      <CommandGreeting name={name} subtitle="Guide a child or young adult through their journey." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active mentees" value={accepted.length} icon={GraduationCap} />
        <MetricCard label="Updates this month" value={sessionsThisMonth} icon={Calendar} accent="support" />
        <MetricCard label="Hours logged" value={hours} icon={Activity} />
        <MetricCard label="Institutions" value={institutions.size} icon={Users} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <UrgentPanel items={urgent} emptyBody="Nothing needs your attention right now. Great work." />
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Open mentorship roles</h2>
              <Link to="/volunteer" className="text-sm font-semibold text-primary">
                Browse all <ArrowRight className="ml-0.5 inline size-3.5" />
              </Link>
            </div>
            {open.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No mentorship roles are open right now — check back soon.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {open.map((o) => (
                  <li key={o.id} className="py-3">
                    <p className="text-sm font-semibold">{o.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.institution?.name ?? "Institution"}
                      {o.location ? ` · ${o.location}` : ""}
                      {o.slots ? ` · ${o.slots} slots` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <MonthlySummary
            items={[
              { label: "Mentees", value: accepted.length },
              { label: "Pending", value: pending.length },
              { label: "Hours", value: hours },
              { label: "Institutions", value: institutions.size },
            ]}
            note="Hours are logged by the institution as sessions complete."
          />
          <UpNext items={upNext} emptyBody="No scheduled sessions yet." />
          <LiveActivityFeed limit={8} compact />
        </div>
      </div>
    </div>
  );
}
