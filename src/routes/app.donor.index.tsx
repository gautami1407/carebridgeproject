import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Heart, Building2, Activity, ArrowRight } from "lucide-react";
import { MetricCard, PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyDonations, useNeeds } from "@/lib/queries";
import { LoadingState } from "@/components/app/states";

export const Route = createFileRoute("/app/donor/")({ component: DonorDashboard });

function DonorDashboard() {
  const { data: donations = [], isLoading } = useMyDonations();
  const { data: openNeeds = [] } = useNeeds({ onlyActive: true });

  const total = donations.reduce((a, b) => a + Number(b.amount), 0);
  const causes = new Set(donations.map((d) => d.need_id)).size;
  const insts = new Set(
    donations.map((d) => (d.need as { institution_id?: string | null } | null)?.institution_id).filter(Boolean),
  ).size;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Your impact dashboard" subtitle="Every donation traced from your wallet to a real beneficiary." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total donated" value={`₹${total.toLocaleString()}`} icon={HeartHandshake} accent="support" />
        <MetricCard label="Causes supported" value={causes} icon={Heart} />
        <MetricCard label="Institutions" value={insts} icon={Building2} />
        <MetricCard label="Donations made" value={donations.length} icon={Activity} accent="support" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent donations</h2>
            <Link to="/app/donor/donations" className="text-sm font-semibold text-primary hover:underline">View all <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
          </div>
          {isLoading ? <div className="mt-4"><LoadingState /></div> : donations.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">You haven't donated yet. <Link to="/explore" className="font-semibold text-primary">Browse needs →</Link></p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {donations.slice(0, 5).map((d) => {
                const need = d.need as { title?: string } | null;
                return (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold">{need?.title ?? "Need"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status="Confirmed" />
                      <span className="font-bold">₹{Number(d.amount).toLocaleString()}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold">Recommended for you</h2>
          {openNeeds.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No open needs right now.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {openNeeds.slice(0, 3).map((n) => {
                const pct = Math.round((Number(n.raised_amount) / Math.max(1, Number(n.goal_amount))) * 100);
                return (
                  <li key={n.id}>
                    <Link to="/needs/$id" params={{ id: n.id }} className="block rounded-lg border border-border p-3 hover:bg-muted">
                      <p className="text-sm font-semibold">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground capitalize">{n.category} • {pct}% funded</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
