import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/impact-reports/$id")({
  component: ReportDetail,
  notFoundComponent: () => <SiteLayout><div className="p-12 text-center">Report not found.</div></SiteLayout>,
});

function ReportDetail() {
  const { id } = Route.useParams();
  const r = useStore((s) => s.reports.find((x) => x.id === id));
  const need = useStore((s) => s.needs.find((n) => n.id === r?.needId));
  if (!r) throw notFound();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link to="/stories" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back</Link>
        <span className="mt-6 inline-flex items-center gap-1 rounded-full bg-support/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-support">Impact Report • {r.date}</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{r.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{r.summary}</p>
        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-3">
          <div><p className="text-xs text-muted-foreground">Beneficiaries served</p><p className="mt-1 text-2xl font-bold">{r.beneficiariesServed}</p></div>
          <div><p className="text-xs text-muted-foreground">Total raised</p><p className="mt-1 text-2xl font-bold">₹{r.donationsTotal.toLocaleString()}</p></div>
          <div><p className="text-xs text-muted-foreground">Source need</p><p className="mt-1 text-sm font-bold">{need?.title}</p></div>
        </div>
        <h2 className="mt-10 text-lg font-bold">Outcomes</h2>
        <ul className="mt-4 space-y-2">
          {r.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-support" />{o}</li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
