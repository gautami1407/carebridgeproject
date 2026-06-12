import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/app/volunteer/upcoming")({
  component: Upcoming,
});

function Upcoming() {
  const events = useStore((s) => s.events);
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Upcoming activities" />
      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((e) => (
          <Link key={e.id} to="/events/$id" params={{ id: e.id }} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{e.type}</p>
            <p className="mt-2 text-lg font-bold">{e.title}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3" /> {e.date} • {e.time}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {e.location}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
