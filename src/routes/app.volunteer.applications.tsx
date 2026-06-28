import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyApplications } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/volunteer/applications")({ component: Applications });

function Applications() {
  const { data: apps = [], isLoading } = useMyApplications();
  if (isLoading) return <LoadingState />;
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Applications" />
      {apps.length === 0 ? <EmptyState title="No applications yet" body="Browse open volunteer opportunities to get started." /> : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Opportunity</th><th className="px-4 py-3">Institution</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apps.map((a) => {
                const o = a.opportunity as { title?: string; institution?: { name?: string } | null } | null;
                return (
                  <tr key={a.id}>
                    <td className="px-4 py-3 font-semibold">{o?.title ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o?.institution?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
