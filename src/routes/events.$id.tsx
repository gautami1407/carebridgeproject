import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useEvent, useRegisterForEvent } from "@/lib/queries";
import { useStore } from "@/lib/store";
import { Calendar, MapPin, Users, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { cap } from "@/lib/db-mappers";
import { LoadingState, ErrorState } from "@/components/app/states";

export const Route = createFileRoute("/events/$id")({
  component: EventDetail,
  notFoundComponent: () => <SiteLayout><div className="p-12 text-center">Event not found.</div></SiteLayout>,
});

function EventDetail() {
  const { id } = Route.useParams();
  const { data: event, isLoading, isError, error, refetch } = useEvent(id);
  const register = useRegisterForEvent();
  const session = useStore((s) => s.session);
  const [registered, setRegistered] = useState(false);

  if (isLoading) return <SiteLayout><div className="p-12"><LoadingState /></div></SiteLayout>;
  if (isError) return <SiteLayout><div className="p-12"><ErrorState error={error} onRetry={() => refetch()} /></div></SiteLayout>;
  if (!event) throw notFound();
  const inst = event.institution as { name: string; slug: string } | null;

  async function handleRegister() {
    if (!session) { window.location.href = `/login?next=/events/${id}`; return; }
    try { await register.mutateAsync(id); setRegistered(true); }
    catch (e) { alert(e instanceof Error ? e.message : "Could not register"); }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link to="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All events</Link>
        <p className="mt-6 text-xs font-bold uppercase tracking-wider text-primary">{cap(event.kind)}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{event.title}</h1>
        {event.description && <p className="mt-2 text-muted-foreground">{event.description}</p>}
        <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
          <div><Calendar className="size-4 text-muted-foreground" /><p className="mt-1 text-xs text-muted-foreground">When</p><p className="text-sm font-bold">{new Date(event.starts_at).toLocaleString()}</p></div>
          <div><MapPin className="size-4 text-muted-foreground" /><p className="mt-1 text-xs text-muted-foreground">Where</p><p className="text-sm font-bold">{event.location ?? "TBA"}</p></div>
          <div><Users className="size-4 text-muted-foreground" /><p className="mt-1 text-xs text-muted-foreground">Capacity</p><p className="text-sm font-bold">{event.capacity ?? "Open"}</p></div>
        </div>
        {registered ? (
          <p className="mt-6 rounded-md bg-support/10 px-4 py-3 text-sm font-semibold text-support">You're registered. Check your notifications for details.</p>
        ) : (
          <button
            onClick={handleRegister}
            disabled={register.isPending}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:brightness-110 disabled:opacity-60"
          >
            {register.isPending && <Loader2 className="size-4 animate-spin" />}
            Register to attend
          </button>
        )}
        {inst && (
          <Link to="/institutions/$slug" params={{ slug: inst.slug }} className="mt-3 block rounded-md border border-border px-4 py-2.5 text-center text-sm font-semibold hover:bg-muted">Hosted by {inst.name}</Link>
        )}
      </section>
    </SiteLayout>
  );
}
