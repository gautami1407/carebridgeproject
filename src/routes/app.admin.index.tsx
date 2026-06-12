import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Building2, HeartHandshake, ListChecks, ArrowRight } from "lucide-react";
import { MetricCard, PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const insts = useStore((s) => s.institutions);
  const needs = useStore((s) => s.needs);
  const donations = useStore((s) => s.donations);
  const total = donations.reduce((a, b) => a + b.amount, 0);
  const pending = insts.filter((i) => i.status === "Pending");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Platform admin" subtitle="Oversee institutions, users and content." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total users" value="1,284" icon={Users} />
        <MetricCard label="Institutions" value={insts.length} icon={Building2} accent="support" />
        <MetricCard label="Active needs" value={needs.filter((n) => n.status !== "Fulfilled").length} icon={ListChecks} accent="urgent" />
        <MetricCard label="Donations" value={`₹${(total / 1000).toFixed(0)}k`} icon={HeartHandshake} accent="support" />
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Verification queue</h2>
          <Link to="/app/admin/institutions" className="text-sm font-semibold text-primary">Review all <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {pending.map((i) => (
            <li key={i.id} className="flex items-center justify-between py-3">
              <div><p className="font-semibold">{i.name}</p><p className="text-xs text-muted-foreground">{i.city}, {i.state} • Submitted {i.createdAt}</p></div>
              <StatusBadge status={i.status} />
            </li>
          ))}
          {pending.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No pending verifications.</li>}
        </ul>
      </div>
    </div>
  );
}
