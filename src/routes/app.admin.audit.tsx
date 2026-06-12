import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";

const logs = [
  { ts: "2026-06-09 14:32", actor: "admin@carebridge", action: "Verified institution", target: "Anand Bal Sadan" },
  { ts: "2026-06-09 11:08", actor: "system", action: "Auto-published need", target: "Diabetes Medication Kits" },
  { ts: "2026-06-08 19:44", actor: "admin@carebridge", action: "Flagged content removed", target: "feed/post-87" },
];

export const Route = createFileRoute("/app/admin/audit")({
  component: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Audit logs" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Target</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((l, i) => (
              <tr key={i}><td className="px-4 py-3 text-xs text-muted-foreground">{l.ts}</td><td className="px-4 py-3 font-mono text-xs">{l.actor}</td><td className="px-4 py-3 font-semibold">{l.action}</td><td className="px-4 py-3 text-muted-foreground">{l.target}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
});
