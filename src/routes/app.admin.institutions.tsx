import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useInstitutions, useVerifyInstitution } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/admin/institutions")({
  component: () => {
    const { data: insts = [], isLoading } = useInstitutions();
    const verify = useVerifyInstitution();
    if (isLoading) return <LoadingState />;
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader title="Institution verification" />
        {insts.length === 0 ? <EmptyState title="No institutions registered yet" /> : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {insts.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-3 font-semibold">{i.name}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{i.type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{[i.city, i.state].filter(Boolean).join(", ")}</td>
                    <td className="px-4 py-3"><StatusBadge status={i.verification} /></td>
                    <td className="px-4 py-3 text-right">{i.verification === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button disabled={verify.isPending} onClick={() => verify.mutate({ id: i.id, status: "verified" })} className="rounded-md bg-support px-3 py-1.5 text-xs font-semibold text-support-foreground disabled:opacity-60">Approve</button>
                        <button disabled={verify.isPending} onClick={() => verify.mutate({ id: i.id, status: "rejected" })} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-60">Reject</button>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  },
});
