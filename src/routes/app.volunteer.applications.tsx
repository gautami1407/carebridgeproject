import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/volunteer/applications")({
  component: Applications,
});

function Applications() {
  const apps = useStore((s) => s.applications);
  const insts = useStore((s) => s.institutions);
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Applications" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Opportunity</th><th className="px-4 py-3">Institution</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {apps.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-semibold">{a.opportunity}</td>
                <td className="px-4 py-3 text-muted-foreground">{insts.find((i) => i.id === a.institutionId)?.name}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{a.appliedAt}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
