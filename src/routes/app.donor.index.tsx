import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Heart, Building2, Activity, ArrowRight, Award } from "lucide-react";
import { MetricCard, PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyDonations, useNeeds, useUserBadges } from "@/lib/queries";
import { LoadingState } from "@/components/app/states";
import { recommendNeedsForDonor } from "@/lib/recommend";
import { iconFor, TIER_STYLES, type BadgeTier } from "@/lib/badges";


export const Route = createFileRoute("/app/donor/")({ component: DonorDashboard });

function DonorDashboard() {
  const { data: donations = [], isLoading } = useMyDonations();
  const { data: openNeeds = [] } = useNeeds({ onlyActive: true });
  const { data: myBadges = [] } = useUserBadges();

  const total = donations.reduce((a, b) => a + Number(b.amount), 0);
  const causes = new Set(donations.map((d) => d.need_id)).size;
  const insts = new Set(
    donations.map((d) => (d.need as { institution_id?: string | null } | null)?.institution_id).filter(Boolean),
  ).size;

  const pastCategories = donations
    .map((d) => (d.need as { category?: string } | null)?.category)
    .filter((c): c is string => !!c);
  const recommended = recommendNeedsForDonor(openNeeds, pastCategories, 3);


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
          <p className="text-xs text-muted-foreground">Based on your giving history</p>
          {recommended.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No open needs right now.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {recommended.map((n) => {
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

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2"><Award className="size-5 text-primary" /> Your achievements</h2>
            <p className="text-xs text-muted-foreground">{myBadges.length} badge{myBadges.length === 1 ? "" : "s"} earned</p>
          </div>
          <Link to="/profile" className="text-sm font-semibold text-primary hover:underline">View profile <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
        </div>
        {myBadges.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Make your first donation to unlock the <span className="font-semibold text-foreground">First Steps</span> badge.</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-3">
            {myBadges.slice(0, 6).map((ub) => {
              const b = ub.badge as { name: string; icon: string; tier: string } | null;
              if (!b) return null;
              const Icon = iconFor(b.icon);
              const tone = TIER_STYLES[(b.tier as BadgeTier) ?? "bronze"];
              return (
                <li key={ub.badge_id} title={b.name} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${tone.chip}`}>
                  <Icon className="size-3.5" aria-hidden />
                  {b.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
