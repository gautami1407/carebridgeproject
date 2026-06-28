import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useNeed } from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { LoadingState, ErrorState } from "@/components/app/states";
import { cap, deadlineLabel } from "@/lib/db-mappers";

export const Route = createFileRoute("/app/institution/needs/$id")({
  component: NeedDetail,
  notFoundComponent: () => <p className="p-6">Need not found.</p>,
});

function NeedDetail() {
  const { id } = Route.useParams();
  const { data: need, isLoading, isError, error, refetch } = useNeed(id);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!need) throw notFound();
  const raised = Number(need.raised_amount);
  const goal = Math.max(1, Number(need.goal_amount));
  const pct = Math.round((raised / goal) * 100);

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/institution/needs" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back</Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <PageHeader title={need.title} subtitle={need.description} />
        <div className="flex gap-2"><StatusBadge status={need.urgency} /><StatusBadge status={need.status} /></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Progress</h2>
          <div className="mt-3 flex items-baseline justify-between"><span className="text-3xl font-bold">{pct}%</span><span className="text-sm text-muted-foreground">₹{raised.toLocaleString()} / ₹{goal.toLocaleString()}</span></div>
          <div className="mt-3 h-3 rounded-full bg-surface-strong"><div className="h-full rounded-full bg-support" style={{ width: `${Math.min(100, pct)}%` }} /></div>
        </div>
        <aside className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <Row k="Category" v={cap(need.category)} />
          <Row k="Goal" v={`₹${goal.toLocaleString()}`} />
          <Row k="Beneficiaries" v={(need.beneficiaries ?? "—").toString()} />
          <Row k="Deadline" v={deadlineLabel(need.deadline, need.status)} />
          <Link to="/needs/$id" params={{ id: need.id }} className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">View public page</Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>;
}
