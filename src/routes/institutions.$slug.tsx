import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { NeedCard } from "@/components/site/NeedCard";
import { MapPin, ArrowLeft, Users, Building2 } from "lucide-react";

export const Route = createFileRoute("/institutions/$slug")({
  component: InstitutionPublic,
  notFoundComponent: () => <SiteLayout><div className="p-12 text-center">Institution not found.</div></SiteLayout>,
});

function InstitutionPublic() {
  const { slug } = Route.useParams();
  const inst = useStore((s) => s.institutions.find((i) => i.slug === slug));
  const needs = useStore((s) => s.needs).filter((n) => n.institutionId === inst?.id);
  const events = useStore((s) => s.events).filter((e) => e.institutionId === inst?.id);
  const reports = useStore((s) => s.reports);
  if (!inst) throw notFound();
  const active = needs.filter((n) => n.status !== "Fulfilled");
  const completed = needs.filter((n) => n.status === "Fulfilled");

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link to="/institutions" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All institutions</Link>
        <header className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <img src={inst.image} alt={inst.name} className="h-56 w-full object-cover" />
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{inst.type}</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">{inst.name}</h1>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{inst.city}, {inst.state}</p>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-support/10 px-3 py-1.5 text-xs font-bold text-support">Verified</span>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-foreground/80">{inst.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={Users} label="Residents" value={inst.residents} />
              <Stat icon={Building2} label="Capacity" value={inst.capacity} />
              <Stat icon={Users} label="Active needs" value={active.length} />
              <Stat icon={Users} label="Completed" value={completed.length} />
            </div>
          </div>
        </header>

        <Section title="Current needs">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((n) => <NeedCard key={n.id} need={{ ...n, urgency: n.priority, institution: inst.name, location: `${inst.city}, ${inst.state}`, impact: n.description }} />)}
          </div>
        </Section>

        <Section title="Upcoming events">
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((e) => (
              <Link key={e.id} to="/events/$id" params={{ id: e.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{e.type}</p>
                <p className="mt-2 text-lg font-bold">{e.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{e.date} • {e.time}</p>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="Impact reports">
          <div className="grid gap-4 sm:grid-cols-2">
            {reports.map((r) => (
              <Link key={r.id} to="/impact-reports/$id" params={{ id: r.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
                <p className="text-xs font-bold uppercase tracking-wider text-support">{r.date}</p>
                <p className="mt-2 font-bold">{r.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
              </Link>
            ))}
          </div>
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
  return (<div className="rounded-xl border border-border bg-surface p-3"><Icon className="size-4 text-muted-foreground" /><p className="mt-1 text-xs text-muted-foreground">{label}</p><p className="font-bold">{value}</p></div>);
}
