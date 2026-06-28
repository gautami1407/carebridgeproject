import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyInstitution, useInstitutionDonations } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/institution/donations")({
  component: () => {
    const { data: inst, isLoading } = useMyInstitution();
    const { data: donations = [] } = useInstitutionDonations(inst?.id);
    if (isLoading) return <LoadingState />;
    if (!inst) return <EmptyState title="No institution linked" />;
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader title="Donations received" />
        {donations.length === 0 ? <EmptyState title="No donations yet" body="When supporters donate to your needs, they'll show up here." /> : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3">Donor</th><th className="px-4 py-3">Need</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {donations.map((d) => {
                  const donor = d.donor as { full_name?: string | null } | null;
                  const need = d.need as { title?: string } | null;
                  return (
                    <tr key={d.id}>
                      <td className="px-4 py-3 font-semibold">{d.is_anonymous ? "Anonymous" : donor?.full_name ?? "Supporter"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{need?.title}</td>
                      <td className="px-4 py-3 font-bold">₹{Number(d.amount).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</td>
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
  },
});
