import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/app/institution/needs/$id")({
  component: NeedDetail,
  notFoundComponent: () => <p className="p-6">Need not found.</p>,
});

function NeedDetail() {
  const { id } = Route.useParams();
  const need = useStore((s) => s.needs.find((n) => n.id === id));
  if (!need) throw notFound();
  const pct = Math.round((need.fulfilled / need.goal) * 100);
  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/institution/needs" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back</Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <PageHeader title={need.title} subtitle={need.description} />
        <div className="flex gap-2"><StatusBadge status={need.priority} /><StatusBadge status={need.status} /></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Progress</h2>
          <div className="mt-3 flex items-baseline justify-between"><span className="text-3xl font-bold">{pct}%</span><span className="text-sm text-muted-foreground">{need.fulfilled}/{need.goal} {need.unit}</span></div>
          <div className="mt-3 h-3 rounded-full bg-surface-strong"><div className="h-full rounded-full bg-support" style={{ width: `${pct}%` }} /></div>
          <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">Updates timeline</h2>
          <ol className="mt-4 space-y-4 border-l-2 border-primary/20 pl-5">
            {need.updates.map((u, i) => (
              <li key={i} className="relative"><span className="absolute -left-[26px] mt-1 grid size-3 place-items-center rounded-full bg-primary" /><p className="text-xs text-muted-foreground">{u.date}</p><p className="text-sm">{u.note}</p></li>
            ))}
          </ol>
        </div>
        <aside className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <Row k="Category" v={need.category} />
          <Row k="Estimated cost" v={`₹${need.estimatedCost.toLocaleString()}`} />
          <Row k="Beneficiaries" v={need.beneficiaries.toString()} />
          <Row k="Deadline" v={need.deadline} />
          <button className="mt-3 w-full rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">Add an update</button>
          <Link to="/needs/$id" params={{ id: need.id }} className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">View public page</Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>;
}
