import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";
import { useMyApplications } from "@/lib/queries";
import { EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/volunteer/certificates")({
  component: () => {
    const { data: apps = [] } = useMyApplications();
    const completed = apps.filter((a) => a.status === "completed");
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Certificates & badges" subtitle="Recognition for your contributions." />
        {completed.length === 0 ? (
          <EmptyState title="No certificates yet" body="Complete a volunteer engagement to earn your first certificate." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((c) => {
              const o = c.opportunity as { title?: string; institution?: { name?: string } | null } | null;
              return (
                <div key={c.id} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-support/10 text-support" aria-hidden><Award className="size-7" /></span>
                  <p className="mt-3 font-bold">{o?.title ?? "Certificate"}</p>
                  <p className="text-xs text-muted-foreground">{o?.institution?.name} • {c.hours_logged} hrs</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
});
