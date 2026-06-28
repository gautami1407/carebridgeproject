import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useEvents } from "@/lib/queries";
import { Calendar, MapPin } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/app/states";
import { cap } from "@/lib/db-mappers";

export const Route = createFileRoute("/app/volunteer/upcoming")({ component: Upcoming });

function Upcoming() {
  const { data: events = [], isLoading } = useEvents({ upcomingOnly: true });
  if (isLoading) return <LoadingState />;
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Upcoming activities" />
      {events.length === 0 ? <EmptyState title="Nothing scheduled" body="When you register for events, they'll appear here." /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((e) => (
            <Link key={e.id} to="/events/$id" params={{ id: e.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">{cap(e.kind)}</p>
              <p className="mt-2 text-lg font-bold">{e.title}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3" />{new Date(e.starts_at).toLocaleString()}</p>
              {e.location && <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{e.location}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
