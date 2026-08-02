import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  useInstitutionBySlug, useInstitutionTrustStats, useInstitutionTimeline, useImpactReports,
  type TimelineEvent,
} from "@/lib/queries";
import { transparencyScore } from "@/lib/transparency";
import { TransparencyScore } from "@/components/app/TransparencyScore";
import { LoadingState, ErrorState } from "@/components/app/states";
import { cap } from "@/lib/db-mappers";
import {
  ShieldCheck, Star, Clock, MapPin, ArrowLeft, HeartHandshake, Calendar, FileText,
  CheckCircle2, Activity, Users, BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/trust/$slug")({
  component: TrustPage,
  head: () => ({
    meta: [
      { title: "Institution Trust Report | CareBridge" },
      { name: "description", content: "Verification status, transparency score, response time, ratings, photos and full activity history for a CareBridge institution." },
      { property: "og:title", content: "Institution Trust Report | CareBridge" },
      { property: "og:description", content: "See verification, transparency score, response time and activity history before you give." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: () => <SiteLayout><div className="p-12 text-center">Institution not found.</div></SiteLayout>,
});

function TrustPage() {
  const { slug } = Route.useParams();
  const { data: inst, isLoading, isError, error, refetch } = useInstitutionBySlug(slug);
  const { data: stats } = useInstitutionTrustStats(inst?.id);
  const { data: timeline = [] } = useInstitutionTimeline(inst?.id);
  const { data: reports = [] } = useImpactReports(inst?.id);

  if (isLoading) return <SiteLayout><div className="p-12"><LoadingState /></div></SiteLayout>;
  if (isError) return <SiteLayout><div className="p-12"><ErrorState error={error} onRetry={() => refetch()} /></div></SiteLayout>;
  if (!inst) throw notFound();

  const trust = transparencyScore({
    inst,
    reportsCount: stats?.reportsCount ?? reports.length,
    needsCount: stats?.needsCount ?? 0,
    completedNeedsCount: stats?.completedNeedsCount ?? 0,
    totalRaised: stats?.totalRaised ?? 0,
    totalGoal: stats?.totalGoal ?? 0,
    lastActivityAt: timeline[0]?.at ?? inst.created_at,
  });

  const rating = Math.round((trust.score / 20) * 10) / 10; // 0–5, one decimal
  const responseLabel =
    stats?.responseDays == null
      ? "No data yet"
      : stats.responseDays < 1
        ? "Under 24 hours"
        : `${Math.round(stats.responseDays)} day${Math.round(stats.responseDays) === 1 ? "" : "s"}`;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link to="/institutions/$slug" params={{ slug }} className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to {inst.name}
        </Link>

        <header className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Trust report</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{inst.name}</h1>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />{[inst.city, inst.state].filter(Boolean).join(", ") || "Location not set"} · {cap(inst.type)}
              </p>
            </div>
            <TransparencyScore breakdown={trust} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TrustTile
              icon={inst.verification === "verified" ? BadgeCheck : ShieldCheck}
              label="Verification"
              value={inst.verification === "verified" ? "Verified" : inst.verification === "pending" ? "Pending review" : "Not verified"}
              tone={inst.verification === "verified" ? "support" : "muted"}
              detail={inst.verification === "verified" ? "Documents reviewed by CareBridge" : "Awaiting document review"}
            />
            <TrustTile icon={Star} label="Community rating" value={`${rating.toFixed(1)} / 5`} detail={`${trust.tier} transparency`} tone="primary" />
            <TrustTile icon={Clock} label="Response time" value={responseLabel} detail={`${stats?.acceptedCount ?? 0} of ${stats?.applicationsCount ?? 0} applications answered`} />
            <TrustTile icon={CheckCircle2} label="Fulfilment rate" value={`${stats?.fulfilmentRate ?? 0}%`} detail={`${stats?.completedNeedsCount ?? 0} of ${stats?.needsCount ?? 0} needs completed`} tone="support" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`size-4 ${i <= Math.round(rating) ? "fill-urgent text-urgent" : "text-muted-foreground/40"}`} aria-hidden />
            ))}
            <span className="ml-2 text-xs text-muted-foreground">Rating derived from verification, reporting, fulfilment and activity signals</span>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Panel title="Score breakdown">
              <ul className="space-y-3">
                {trust.components.map((c) => (
                  <li key={c.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{c.label}</span>
                      <span className="text-muted-foreground">{c.got}/{c.max}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-strong">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(c.got / c.max) * 100}%` }} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.detail}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Photos & proof">
              {!stats?.photos.length ? (
                <p className="text-sm text-muted-foreground">No photos published yet. Impact reports, needs and events add photos here automatically.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {stats.photos.map((p, idx) => (
                    <figure key={`${p.url}-${idx}`} className="overflow-hidden rounded-xl border border-border">
                      <img src={p.url} alt={p.caption} loading="lazy" className="h-32 w-full object-cover" />
                      <figcaption className="truncate bg-surface px-2 py-1 text-[10px] text-muted-foreground">{p.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Activity timeline">
              {timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recorded activity yet.</p>
              ) : (
                <ol className="relative ml-3 border-l-2 border-primary/20">
                  {timeline.slice(0, 30).map((t) => (
                    <li key={t.id} className="ml-6 pb-5">
                      <span className="absolute -left-[9px] grid size-4 place-items-center rounded-full bg-primary text-primary-foreground" aria-hidden>
                        <TimelineIcon kind={t.kind} />
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{new Date(t.at).toLocaleString()}</p>
                      <p className="mt-0.5 text-sm font-semibold">{t.title}</p>
                      {t.subtitle && <p className="text-xs text-muted-foreground">{t.subtitle}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="At a glance">
              <dl className="space-y-3 text-sm">
                <Row label="Total raised" value={`₹${(stats?.totalRaised ?? 0).toLocaleString()}`} />
                <Row label="Funding goal" value={`₹${(stats?.totalGoal ?? 0).toLocaleString()}`} />
                <Row label="Impact reports" value={String(stats?.reportsCount ?? 0)} />
                <Row label="Beneficiaries reported" value={String(stats?.beneficiaries ?? 0)} />
                <Row label="Residents" value={String(inst.residents_count ?? "—")} />
                <Row label="On CareBridge since" value={new Date(inst.created_at).toLocaleDateString()} />
              </dl>
            </Panel>

            <Panel title="Published impact reports">
              {reports.length === 0 ? (
                <p className="text-sm text-muted-foreground">None published yet.</p>
              ) : (
                <ul className="space-y-3">
                  {reports.slice(0, 6).map((r) => (
                    <li key={r.id}>
                      <Link to="/impact-reports/$id" params={{ id: r.id }} className="block rounded-lg border border-border p-3 hover:bg-muted">
                        <p className="text-sm font-semibold">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.published_at ? new Date(r.published_at).toLocaleDateString() : "Draft"}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <p className="rounded-xl bg-surface p-4 text-xs text-muted-foreground">
              This trust report is generated from activity recorded on CareBridge. It is not an independent audit or certification.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function TimelineIcon({ kind }: { kind: TimelineEvent["kind"] }) {
  const cls = "size-2.5";
  switch (kind) {
    case "donation_received": return <HeartHandshake className={cls} />;
    case "event_conducted": return <Calendar className={cls} />;
    case "report_published": return <FileText className={cls} />;
    case "need_completed": return <CheckCircle2 className={cls} />;
    case "volunteer_joined": return <Users className={cls} />;
    default: return <Activity className={cls} />;
  }
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function TrustTile({
  icon: Icon, label, value, detail, tone = "muted",
}: { icon: typeof Star; label: string; value: string; detail?: string; tone?: "support" | "primary" | "muted" }) {
  const toneCls = tone === "support" ? "text-support" : tone === "primary" ? "text-primary" : "text-muted-foreground";
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <Icon className={`size-4 ${toneCls}`} aria-hidden />
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-lg font-bold leading-tight">{value}</p>
      {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}
