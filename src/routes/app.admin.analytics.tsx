import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, MetricCard } from "@/components/app/AppShell";
import { TrendingUp, Users, Building2, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/app/admin/analytics")({
  component: () => (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Platform analytics" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="MoM user growth" value="+24%" icon={TrendingUp} accent="support" delta="vs last month" />
        <MetricCard label="DAU" value="412" icon={Users} />
        <MetricCard label="New institutions" value="6" icon={Building2} />
        <MetricCard label="Total raised" value="₹14.2L" icon={HeartHandshake} accent="support" />
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-lg font-bold">Donation trends — last 6 months</h2>
        <div className="mt-6 flex items-end gap-3">
          {[40, 65, 50, 80, 95, 120].map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-primary" style={{ height: `${v * 1.5}px` }} />
              <span className="text-xs text-muted-foreground">M{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});
