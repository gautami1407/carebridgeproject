import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle, Loader2, Download, Award, Quote } from "lucide-react";
import { useDonationJourney, type JourneyStage } from "@/lib/queries";
import { PageHeader } from "@/components/app/AppShell";
import { LoadingState, ErrorState, EmptyState } from "@/components/app/states";
import { downloadCertificate } from "@/lib/certificate";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/donor/journey/$id")({ component: JourneyPage });

function StageIcon({ state }: { state: JourneyStage["state"] }) {
  if (state === "done") return <CheckCircle2 className="size-4" />;
  if (state === "current") return <Loader2 className="size-4 animate-spin" />;
  return <Circle className="size-4" />;
}

function JourneyPage() {
  const { id } = Route.useParams();
  const { data, isLoading, isError, error, refetch } = useDonationJourney(id);
  const donorName = useStore((s) => s.session?.name) ?? "Generous Donor";

  if (isLoading) return <div className="mx-auto max-w-4xl"><LoadingState label="Tracing your donation…" /></div>;
  if (isError) return <div className="mx-auto max-w-4xl"><ErrorState error={error} onRetry={() => refetch()} /></div>;
  if (!data) return <div className="mx-auto max-w-4xl"><EmptyState title="Donation not found" body="This donation is unavailable or you don't have access to it." /></div>;

  const doneCount = data.stages.filter((s) => s.state === "done").length;
  const pct = Math.round((doneCount / data.stages.length) * 100);

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/donor/donations" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Donation history
      </Link>
      <PageHeader
        title="Donation journey"
        subtitle={`₹${data.donation.amount.toLocaleString()} · ${data.need?.title ?? "Need"} · ${data.institution?.name ?? "CareBridge institution"}`}
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{doneCount} of {data.stages.length} stages complete</span>
          <span className="text-muted-foreground">{pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-strong">
          <div className="h-full rounded-full bg-support transition-all" style={{ width: `${pct}%` }} />
        </div>

        <ol className="relative mt-8 ml-3 border-l-2 border-primary/20">
          {data.stages.map((s) => (
            <li key={s.key} className="ml-7 pb-8 last:pb-0">
              <span
                className={`absolute -left-[15px] grid size-7 place-items-center rounded-full border ${
                  s.state === "done"
                    ? "border-support/30 bg-support text-white"
                    : s.state === "current"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-surface text-muted-foreground"
                }`}
                aria-hidden
              >
                <StageIcon state={s.state} />
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold">{s.label}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  s.state === "done" ? "bg-support/10 text-support" : s.state === "current" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {s.state === "done" ? "Complete" : s.state === "current" ? "In progress" : "Pending"}
                </span>
              </div>
              {s.at && <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{new Date(s.at).toLocaleString()}</p>}
              <p className="mt-1 text-sm text-foreground/80">{s.detail}</p>
              {s.href && (
                <Link to={s.href as never} className="mt-1 inline-block text-xs font-semibold text-primary hover:underline">View details →</Link>
              )}
            </li>
          ))}
        </ol>
      </div>

      {data.donorMessage && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground"><Quote className="size-4" /> Your message</h2>
          <p className="mt-2 text-sm italic text-foreground/80">“{data.donorMessage}”</p>
        </div>
      )}

      {data.certificateNo && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-support/30 bg-support/5 p-6">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold"><Award className="size-4 text-support" /> Appreciation certificate issued</p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">{data.certificateNo}</p>
          </div>
          <button
            onClick={() =>
              downloadCertificate({
                certificateNo: data.certificateNo!,
                donorName,
                institutionName: data.institution?.name ?? "CareBridge Institution",
                needTitle: data.need?.title ?? "Donation",
                amount: data.donation.amount,
                issuedAt: data.certificateIssuedAt ?? data.donation.createdAt,
              })
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
          >
            <Download className="size-3.5" /> Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
