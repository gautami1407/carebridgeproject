import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useMyInstitution, useEvents } from "@/lib/queries";
import { Calendar, Plus } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/app/states";
import { cap } from "@/lib/db-mappers";

export const Route = createFileRoute("/app/institution/events/")({ component: EventsList });

function EventsList() {
  const { data: inst, isLoading } = useMyInstitution();
  const { data: events = [] } = useEvents({ institutionId: inst?.id });
  if (isLoading) return <LoadingState />;
  if (!inst) return <EmptyState title="No institution linked" />;
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Events" action={<Link to="/app/institution/events/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />New event</Link>} />
      {events.length === 0 ? <EmptyState title="No events yet" body="Create an event to engage your community." action={<Link to="/app/institution/events/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create event</Link>} /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((e) => (
            <Link key={e.id} to="/events/$id" params={{ id: e.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">{cap(e.kind)}</p>
              <p className="mt-2 text-lg font-bold">{e.title}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3" />{new Date(e.starts_at).toLocaleString()}</p>
              {e.capacity && <p className="mt-3 text-sm">Capacity {e.capacity}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
