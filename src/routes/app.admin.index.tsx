import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Building2, HeartHandshake, ListChecks, ArrowRight } from "lucide-react";
import { MetricCard, PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useInstitutions, useNeeds, useAdminUsers } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const { data: insts = [] } = useInstitutions();
  const { data: needs = [] } = useNeeds();
  const { data: users = [] } = useAdminUsers();
  const { data: donationsTotal = 0 } = useQuery({
    queryKey: ["admin-donations-total"],
    queryFn: async () => {
      const { data, error } = await supabase.from("donations").select("amount");
      if (error) throw error;
      return (data ?? []).reduce((a, b) => a + Number(b.amount), 0);
    },
  });
  const pending = insts.filter((i) => i.verification === "pending");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Platform admin" subtitle="Oversee institutions, users and content." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total users" value={users.length} icon={Users} />
        <MetricCard label="Institutions" value={insts.length} icon={Building2} accent="support" />
        <MetricCard label="Active needs" value={needs.filter((n) => n.status === "active").length} icon={ListChecks} accent="urgent" />
        <MetricCard label="Donations" value={`₹${donationsTotal.toLocaleString()}`} icon={HeartHandshake} accent="support" />
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Verification queue</h2>
          <Link to="/app/admin/institutions" className="text-sm font-semibold text-primary">Review all <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {pending.map((i) => (
            <li key={i.id} className="flex items-center justify-between py-3">
              <div><p className="font-semibold">{i.name}</p><p className="text-xs text-muted-foreground">{[i.city, i.state].filter(Boolean).join(", ")} • Submitted {new Date(i.created_at).toLocaleDateString()}</p></div>
              <StatusBadge status={i.verification} />
            </li>
          ))}
          {pending.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No pending verifications.</li>}
        </ul>
      </div>
    </div>
  );
}
