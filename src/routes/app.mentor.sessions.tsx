import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";

const sessions = [
  { d: "2026-06-14", t: "5:00 PM", mentee: "Arjun K.", topic: "JEE Physics — kinematics", status: "Confirmed" },
  { d: "2026-06-16", t: "6:30 PM", mentee: "Sneha M.", topic: "College essay review", status: "Pending" },
  { d: "2026-06-20", t: "4:00 PM", mentee: "Ravi P.", topic: "Resume coaching", status: "Confirmed" },
];

export const Route = createFileRoute("/app/mentor/sessions")({
  component: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Sessions" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Mentee</th><th className="px-4 py-3">Topic</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sessions.map((s) => (
              <tr key={s.d}><td className="px-4 py-3">{s.d} • {s.t}</td><td className="px-4 py-3 font-semibold">{s.mentee}</td><td className="px-4 py-3 text-muted-foreground">{s.topic}</td><td className="px-4 py-3"><StatusBadge status={s.status} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
});
