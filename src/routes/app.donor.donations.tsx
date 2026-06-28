import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyDonations } from "@/lib/queries";
import { LoadingState, ErrorState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/donor/donations")({ component: DonationsHistory });

function DonationsHistory() {
  const { data: donations = [], isLoading, isError, error, refetch } = useMyDonations();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Donation history" subtitle="Full audit trail of every contribution." />
      {isLoading ? <LoadingState /> :
        isError ? <ErrorState error={error} onRetry={() => refetch()} /> :
        donations.length === 0 ? <EmptyState title="No donations yet" body="When you donate, your contributions will show up here." /> : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Need</th>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {donations.map((d) => {
                  const need = d.need as { title?: string; institution?: { name?: string } | null } | null;
                  return (
                    <tr key={d.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-semibold">{need?.title ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{need?.institution?.name ?? "—"}</td>
                      <td className="px-4 py-3 font-bold">₹{Number(d.amount).toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status="Confirmed" /></td>
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
