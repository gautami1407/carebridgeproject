import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";

const vols = [
  { name: "Priya N.", skill: "Teaching", hours: 24, status: "Active" },
  { name: "Rohit S.", skill: "Mentorship", hours: 12, status: "Active" },
  { name: "Dr. Patel", skill: "Healthcare", hours: 8, status: "Pending" },
  { name: "Megha J.", skill: "Event support", hours: 36, status: "Completed" },
];

export const Route = createFileRoute("/app/institution/volunteers")({
  component: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Volunteers" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Skill</th><th className="px-4 py-3">Hours</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vols.map((v) => (
              <tr key={v.name}><td className="px-4 py-3 font-semibold">{v.name}</td><td className="px-4 py-3 text-muted-foreground">{v.skill}</td><td className="px-4 py-3">{v.hours}</td><td className="px-4 py-3"><StatusBadge status={v.status} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
});
