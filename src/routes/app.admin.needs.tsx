import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/admin/needs")({
  component: () => {
    const needs = useStore((s) => s.needs);
    const insts = useStore((s) => s.institutions);
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader title="Need moderation" />
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Institution</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {needs.map((n) => (
                <tr key={n.id}><td className="px-4 py-3 font-semibold">{n.title}</td><td className="px-4 py-3 text-muted-foreground">{insts.find((i) => i.id === n.institutionId)?.name}</td><td className="px-4 py-3"><StatusBadge status={n.priority} /></td><td className="px-4 py-3"><StatusBadge status={n.status} /></td><td className="px-4 py-3 text-right"><button className="text-xs font-semibold text-urgent hover:underline">Flag</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
