import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useMyApplications } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/volunteer/completed")({
  component: () => {
    const { data: apps = [], isLoading } = useMyApplications();
    const completed = apps.filter((a) => a.status === "completed");
    if (isLoading) return <LoadingState />;
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Completed activities" />
        {completed.length === 0 ? <EmptyState title="No completed activities yet" body="Once your volunteer work is marked complete by the institution, it will appear here." /> : (
          <div className="space-y-3">
            {completed.map((a) => {
              const o = a.opportunity as { title?: string; institution?: { name?: string } | null } | null;
              return (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div>
                    <p className="font-semibold">{o?.title}</p>
                    <p className="text-xs text-muted-foreground">{o?.institution?.name} • {new Date(a.updated_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-bold text-support">{a.hours_logged} hrs</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
});
