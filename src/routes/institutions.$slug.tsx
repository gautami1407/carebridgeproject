import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useInstitutionBySlug, useNeeds, useEvents, useImpactReports, useInstitutionTimeline } from "@/lib/queries";
import { NeedCard } from "@/components/site/NeedCard";
import { MapPin, ArrowLeft, Users, Building2, Calendar, HeartHandshake, FileText, Activity, CheckCircle2 } from "lucide-react";
import { needToCardUI, cap } from "@/lib/db-mappers";
import { LoadingState, ErrorState, EmptyState } from "@/components/app/states";
import { transparencyScore } from "@/lib/transparency";
import { TransparencyScore } from "@/components/app/TransparencyScore";
import type { TimelineEvent } from "@/lib/queries";

export const Route = createFileRoute("/institutions/$slug")({
  component: InstitutionPublic,
  notFoundComponent: () => <SiteLayout><div className="p-12 text-center">Institution not found.</div></SiteLayout>,
});

function InstitutionPublic() {
  const { slug } = Route.useParams();
  const { data: inst, isLoading, isError, error, refetch } = useInstitutionBySlug(slug);
  const { data: needs = [] } = useNeeds({ institutionId: inst?.id });
  const { data: events = [] } = useEvents({ institutionId: inst?.id, upcomingOnly: true });
  const { data: reports = [] } = useImpactReports(inst?.id);
  const { data: timeline = [] } = useInstitutionTimeline(inst?.id);

  if (isLoading) return <SiteLayout><div className="p-12"><LoadingState /></div></SiteLayout>;
  if (isError) return <SiteLayout><div className="p-12"><ErrorState error={error} onRetry={() => refetch()} /></div></SiteLayout>;
  if (!inst) throw notFound();
  const active = needs.filter((n) => n.status !== "fulfilled" && n.status !== "closed");
  const completed = needs.filter((n) => n.status === "fulfilled");
  const totalRaised = needs.reduce((s, n) => s + Number(n.raised_amount ?? 0), 0);
  const totalGoal = needs.reduce((s, n) => s + Number(n.goal_amount ?? 0), 0);
  const trust = transparencyScore({
    inst,
    reportsCount: reports.length,
    needsCount: needs.length,
    completedNeedsCount: completed.length,
    totalRaised,
    totalGoal,
    lastActivityAt: timeline[0]?.at ?? inst.created_at,
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link to="/institutions" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All institutions</Link>
        <header className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {inst.cover_image && <img src={inst.cover_image} alt={inst.name} className="h-56 w-full object-cover" />}
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{cap(inst.type)}</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">{inst.name}</h1>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{[inst.city, inst.state].filter(Boolean).join(", ")}</p>
              </div>
              {inst.verification === "verified" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-support/10 px-3 py-1.5 text-xs font-bold text-support">Verified</span>
              )}
            </div>
            {inst.description && <p className="mt-4 leading-relaxed text-foreground/80">{inst.description}</p>}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={Users} label="Residents" value={inst.residents_count ?? "—"} />
              <Stat icon={Building2} label="Type" value={cap(inst.type)} />
              <Stat icon={Users} label="Active needs" value={active.length} />
              <Stat icon={Users} label="Completed" value={completed.length} />
            </div>
          </div>
        </header>

        <Section title="Current needs">
          {active.length === 0 ? (
            <EmptyState title="No open needs right now" body="Follow this institution to be notified when new needs are posted." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((n) => <NeedCard key={n.id} need={needToCardUI({ ...n, institution: inst })} />)}
            </div>
          )}
        </Section>

        <Section title="Upcoming events">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming events.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map((e) => (
                <Link key={e.id} to="/events/$id" params={{ id: e.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">{cap(e.kind)}</p>
                  <p className="mt-2 text-lg font-bold">{e.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3" />{new Date(e.starts_at).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          )}
        </Section>

        <Section title="Impact reports">
          {reports.length === 0 ? (
            <p className="text-sm text-muted-foreground">Impact reports will appear after needs are completed.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {reports.map((r) => (
                <Link key={r.id} to="/impact-reports/$id" params={{ id: r.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
                  <p className="text-xs font-bold uppercase tracking-wider text-support">{r.published_at ? new Date(r.published_at).toLocaleDateString() : ""}</p>
                  <p className="mt-2 font-bold">{r.title}</p>
                  {r.summary && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.summary}</p>}
                </Link>
              ))}
            </div>
          )}
        </Section>
      </section>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return (<div className="rounded-xl border border-border bg-surface p-3"><Icon className="size-4 text-muted-foreground" aria-hidden /><p className="mt-1 text-xs text-muted-foreground">{label}</p><p className="font-bold">{value}</p></div>);
}
