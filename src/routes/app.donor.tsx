import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Heart, Building2, Activity, ArrowRight } from "lucide-react";
import { MetricCard, PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/donor")({
  component: DonorDashboard,
});

function DonorDashboard() {
  const donations = useStore((s) => s.donations).filter((d) => d.donorId === "u-1");
  const total = donations.reduce((a, b) => a + b.amount, 0);
  const causes = new Set(donations.map((d) => d.needId)).size;
  const insts = new Set(donations.map((d) => d.institutionId)).size;
  const beneficiaries = useStore((s) => s.needs).filter((n) => donations.some((d) => d.needId === n.id)).reduce((a, n) => a + n.beneficiaries, 0);
  const needs = useStore((s) => s.needs);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Your impact dashboard" subtitle="Every donation traced from your wallet to a real beneficiary." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total donated" value={`₹${total.toLocaleString()}`} icon={HeartHandshake} accent="support" />
        <MetricCard label="Causes supported" value={causes} icon={Heart} />
        <MetricCard label="Institutions" value={insts} icon={Building2} />
        <MetricCard label="Lives touched" value={beneficiaries} icon={Activity} accent="support" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent donations</h2>
            <Link to="/app/donor/donations" className="text-sm font-semibold text-primary hover:underline">View all <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {donations.slice(0, 5).map((d) => {
              const need = needs.find((n) => n.id === d.needId);
              return (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold">{need?.title ?? d.needId}</p>
                    <p className="text-xs text-muted-foreground">{d.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={d.status} />
                    <span className="font-bold">₹{d.amount.toLocaleString()}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold">Recommended for you</h2>
          <ul className="mt-4 space-y-4">
            {needs.filter((n) => n.status !== "Fulfilled").slice(0, 3).map((n) => (
              <li key={n.id}>
                <Link to="/needs/$id" params={{ id: n.id }} className="block rounded-lg border border-border p-3 hover:bg-muted">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.category} • {Math.round((n.fulfilled / n.goal) * 100)}% funded</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
