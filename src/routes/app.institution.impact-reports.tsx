import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/institution/impact-reports")({
  component: () => {
    const reports = useStore((s) => s.reports);
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Impact reports" subtitle="Auto-generated when a need is fulfilled." />
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((r) => (
            <Link key={r.id} to="/impact-reports/$id" params={{ id: r.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
              <p className="text-xs font-bold uppercase tracking-wider text-support">Published {r.date}</p>
              <p className="mt-2 text-lg font-bold">{r.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-muted-foreground">Beneficiaries</p><p className="font-bold">{r.beneficiariesServed}</p></div><div><p className="text-xs text-muted-foreground">Raised</p><p className="font-bold">₹{r.donationsTotal.toLocaleString()}</p></div></div>
            </Link>
          ))}
        </div>
      </div>
    );
  },
});
