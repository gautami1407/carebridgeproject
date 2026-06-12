import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events — CareBridge" }, { name: "description", content: "Health camps, education programs, birthdays, fundraisers." }] }),
  component: EventsPage,
});

function EventsPage() {
  const events = useStore((s) => s.events);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Events & drives</h1>
        <p className="mt-2 text-muted-foreground">Join the community for impact in person.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Link key={e.id} to="/events/$id" params={{ id: e.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">{e.type}</p>
              <p className="mt-2 text-lg font-bold">{e.title}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3" />{e.date} • {e.time}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{e.location}</p>
              <p className="mt-4 text-sm">{e.registered}/{e.capacity} registered</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
