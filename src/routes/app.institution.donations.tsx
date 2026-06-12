import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/institution/donations")({
  component: () => {
    const instId = useStore((s) => s.session?.institutionId ?? "inst-1");
    const donations = useStore((s) => s.donations).filter((d) => d.institutionId === instId);
    const needs = useStore((s) => s.needs);
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader title="Donations received" />
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Donor</th><th className="px-4 py-3">Need</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.map((d) => (
                <tr key={d.id}><td className="px-4 py-3 font-semibold">{d.donorName}</td><td className="px-4 py-3 text-muted-foreground">{needs.find((n) => n.id === d.needId)?.title}</td><td className="px-4 py-3 font-bold">₹{d.amount.toLocaleString()}</td><td className="px-4 py-3 text-xs text-muted-foreground">{d.date}</td><td className="px-4 py-3"><StatusBadge status={d.status} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
