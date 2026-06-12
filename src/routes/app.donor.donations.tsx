import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/donor/donations")({
  component: DonationsHistory,
});

function DonationsHistory() {
  const donations = useStore((s) => s.donations);
  const needs = useStore((s) => s.needs);
  const insts = useStore((s) => s.institutions);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Donation history" subtitle="Full audit trail of every contribution." />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
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
            {donations.map((d) => (
              <tr key={d.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 text-xs text-muted-foreground">{d.date}</td>
                <td className="px-4 py-3 font-semibold">{needs.find((n) => n.id === d.needId)?.title ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{insts.find((i) => i.id === d.institutionId)?.name ?? "—"}</td>
                <td className="px-4 py-3 font-bold">₹{d.amount.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
