import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useMyInstitution, useImpactReports } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/institution/impact-reports")({
  component: () => {
    const { data: inst, isLoading } = useMyInstitution();
    const { data: reports = [] } = useImpactReports(inst?.id);
    if (isLoading) return <LoadingState />;
    if (!inst) return <EmptyState title="No institution linked" />;
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Impact reports" subtitle="Share evidence of how donations transformed lives." />
        {reports.length === 0 ? <EmptyState title="No reports yet" body="Publish a report after a need is fulfilled to keep donors engaged." /> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reports.map((r) => (
              <Link key={r.id} to="/impact-reports/$id" params={{ id: r.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
                <p className="text-xs font-bold uppercase tracking-wider text-support">{r.published_at ? `Published ${new Date(r.published_at).toLocaleDateString()}` : "Draft"}</p>
                <p className="mt-2 text-lg font-bold">{r.title}</p>
                {r.summary && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.summary}</p>}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">Beneficiaries</p><p className="font-bold">{r.beneficiaries ?? "—"}</p></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  },
});
