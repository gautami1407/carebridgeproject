import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$id")({
  component: EventDetail,
  notFoundComponent: () => <SiteLayout><div className="p-12 text-center">Event not found.</div></SiteLayout>,
});

function EventDetail() {
  const { id } = Route.useParams();
  const event = useStore((s) => s.events.find((e) => e.id === id));
  const inst = useStore((s) => s.institutions.find((i) => i.id === event?.institutionId));
  const [registered, setRegistered] = useState(false);
  if (!event || !inst) throw notFound();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link to="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All events</Link>
        <p className="mt-6 text-xs font-bold uppercase tracking-wider text-primary">{event.type}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{event.title}</h1>
        <p className="mt-2 text-muted-foreground">{event.description}</p>
        <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
          <div><Calendar className="size-4 text-muted-foreground" /><p className="mt-1 text-xs text-muted-foreground">When</p><p className="text-sm font-bold">{event.date} • {event.time}</p></div>
          <div><MapPin className="size-4 text-muted-foreground" /><p className="mt-1 text-xs text-muted-foreground">Where</p><p className="text-sm font-bold">{event.location}</p></div>
          <div><Users className="size-4 text-muted-foreground" /><p className="mt-1 text-xs text-muted-foreground">Capacity</p><p className="text-sm font-bold">{event.registered}/{event.capacity}</p></div>
        </div>
        {registered ? (
          <p className="mt-6 rounded-md bg-support/10 px-4 py-3 text-sm font-semibold text-support">You're registered. Confirmation sent to your email.</p>
        ) : (
          <button onClick={() => setRegistered(true)} className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:brightness-110">Register to attend</button>
        )}
        <Link to="/institutions/$slug" params={{ slug: inst.slug }} className="mt-3 block rounded-md border border-border px-4 py-2.5 text-center text-sm font-semibold hover:bg-muted">Hosted by {inst.name}</Link>
      </section>
    </SiteLayout>
  );
}
