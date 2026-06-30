import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { usePlatformStats } from "@/lib/queries";
import { LoadingState, ErrorState } from "@/components/app/states";
import { LiveCounter } from "@/components/app/LiveCounter";
import { HeartHandshake, Users, Building2, Activity, Utensils, GraduationCap, Shield, Sparkles } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Our Impact — CareBridge" },
      { name: "description", content: "Live, transparent impact metrics from across the CareBridge platform." },
      { property: "og:title", content: "Our Impact — CareBridge" },
      { property: "og:description", content: "Real-time numbers: meals sponsored, children supported, donations, volunteers." },
    ],
  }),
  component: ImpactPage,
});

function ImpactPage() {
  const { data, isLoading, isError, error, refetch } = usePlatformStats();

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary"><Sparkles className="size-3" /> Live impact</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Our collective impact</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Every number on this page updates in real time as donors, volunteers, and institutions create change together. Full transparency, no rounding.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {isLoading ? <LoadingState /> : isError ? <ErrorState error={error} onRetry={() => refetch()} /> : data && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={HeartHandshake} label="Total donated" value={data.totalAmount} prefix="₹" accent="support" />
              <StatCard icon={Utensils} label="Meals sponsored" value={data.meals} />
              <StatCard icon={GraduationCap} label="Children supported" value={data.childrenBenef} />
              <StatCard icon={Users} label="Seniors supported" value={data.seniorsBenef} />
              <StatCard icon={Activity} label="Needs completed" value={data.completedNeeds} accent="support" />
              <StatCard icon={Building2} label="Verified institutions" value={data.verifiedInsts} />
              <StatCard icon={Users} label="Active volunteers" value={data.volunteersActive} />
              <StatCard icon={Shield} label="Donations made" value={data.donationsCount} />
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h2 className="text-lg font-bold">Donations trend</h2>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.trend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="amt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="url(#amt)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h2 className="text-lg font-bold">Top supported causes</h2>
                <p className="text-xs text-muted-foreground">Total donated by category</p>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.categories} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Bar dataKey="amount" fill="hsl(var(--support))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </SiteLayout>
  );
}

function StatCard({ icon: Icon, label, value, prefix, accent }: { icon: typeof HeartHandshake; label: string; value: number; prefix?: string; accent?: "support" }) {
  const tone = accent === "support" ? "bg-support/10 text-support" : "bg-primary/10 text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={`grid size-9 place-items-center rounded-lg ${tone}`} aria-hidden><Icon className="size-4" /></span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">
        <LiveCounter value={value} prefix={prefix} />
      </p>
    </div>
  );
}
