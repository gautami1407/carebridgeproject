import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useImpactReport } from "@/lib/queries";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { LoadingState, ErrorState } from "@/components/app/states";

export const Route = createFileRoute("/impact-reports/$id")({
  component: ReportDetail,
  notFoundComponent: () => <SiteLayout><div className="p-12 text-center">Report not found.</div></SiteLayout>,
});

function ReportDetail() {
  const { id } = Route.useParams();
  const { data: r, isLoading, isError, error, refetch } = useImpactReport(id);

  if (isLoading) return <SiteLayout><div className="p-12"><LoadingState /></div></SiteLayout>;
  if (isError) return <SiteLayout><div className="p-12"><ErrorState error={error} onRetry={() => refetch()} /></div></SiteLayout>;
  if (!r) throw notFound();
  const outcomes = (r.outcomes ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  const inst = r.institution as { name: string; slug: string } | null;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link to="/stories" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back</Link>
        <span className="mt-6 inline-flex items-center gap-1 rounded-full bg-support/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-support">
          Impact Report{r.published_at ? ` • ${new Date(r.published_at).toLocaleDateString()}` : ""}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{r.title}</h1>
        {r.summary && <p className="mt-3 text-lg text-muted-foreground">{r.summary}</p>}
        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-3">
          <div><p className="text-xs text-muted-foreground">Beneficiaries served</p><p className="mt-1 text-2xl font-bold">{r.beneficiaries ?? "—"}</p></div>
          <div><p className="text-xs text-muted-foreground">Institution</p><p className="mt-1 text-sm font-bold">{inst?.name ?? "—"}</p></div>
          <div><p className="text-xs text-muted-foreground">Published</p><p className="mt-1 text-sm font-bold">{r.published_at ? new Date(r.published_at).toLocaleDateString() : "Draft"}</p></div>
        </div>
        {outcomes.length > 0 && (
          <>
            <h2 className="mt-10 text-lg font-bold">Outcomes</h2>
            <ul className="mt-4 space-y-2">
              {outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-support" aria-hidden />{o}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
