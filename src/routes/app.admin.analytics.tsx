import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, MetricCard } from "@/components/app/AppShell";
import { TrendingUp, Users, Building2, HeartHandshake } from "lucide-react";
import { useAdminUsers, useInstitutions, useNeeds } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/admin/analytics")({
  component: () => {
    const { data: users = [] } = useAdminUsers();
    const { data: insts = [] } = useInstitutions();
    const { data: needs = [] } = useNeeds();
    const { data: donations = [] } = useQuery({
      queryKey: ["analytics-donations"],
      queryFn: async () => {
        const { data, error } = await supabase.from("donations").select("amount, created_at");
        if (error) throw error;
        return data ?? [];
      },
    });
    const total = donations.reduce((a, b) => a + Number(b.amount), 0);

    // Compute donations per month (last 6 months)
    const buckets = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return { label: d.toLocaleString(undefined, { month: "short" }), key: `${d.getFullYear()}-${d.getMonth()}`, total: 0 };
    });
    donations.forEach((d) => {
      const dt = new Date(d.created_at);
      const k = `${dt.getFullYear()}-${dt.getMonth()}`;
      const b = buckets.find((x) => x.key === k);
      if (b) b.total += Number(d.amount);
    });
    const maxVal = Math.max(1, ...buckets.map((b) => b.total));

    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader title="Platform analytics" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total users" value={users.length} icon={Users} accent="support" />
          <MetricCard label="Institutions" value={insts.length} icon={Building2} />
          <MetricCard label="Active needs" value={needs.filter((n) => n.status === "active").length} icon={TrendingUp} />
          <MetricCard label="Total raised" value={`₹${total.toLocaleString()}`} icon={HeartHandshake} accent="support" />
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold">Donations — last 6 months</h2>
          <div className="mt-6 flex items-end gap-3 h-48">
            {buckets.map((b) => (
              <div key={b.key} className="flex flex-1 flex-col items-center justify-end gap-2" title={`₹${b.total.toLocaleString()}`}>
                <div className="w-full rounded-t-md bg-primary" style={{ height: `${(b.total / maxVal) * 100}%`, minHeight: "4px" }} aria-label={`${b.label}: ₹${b.total}`} />
                <span className="text-xs text-muted-foreground">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
});
