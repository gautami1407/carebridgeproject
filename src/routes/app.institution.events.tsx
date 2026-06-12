import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { Calendar, Plus } from "lucide-react";

export const Route = createFileRoute("/app/institution/events")({
  component: EventsList,
});

function EventsList() {
  const instId = useStore((s) => s.session?.institutionId ?? "inst-1");
  const events = useStore((s) => s.events).filter((e) => e.institutionId === instId);
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Events" action={<Link to="/app/institution/events/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />New event</Link>} />
      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((e) => (
          <div key={e.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{e.type}</p>
            <p className="mt-2 text-lg font-bold">{e.title}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3" /> {e.date} • {e.time}</p>
            <p className="mt-3 text-sm">{e.registered}/{e.capacity} registered</p>
            <div className="mt-1 h-2 rounded-full bg-surface-strong"><div className="h-full rounded-full bg-support" style={{ width: `${(e.registered / e.capacity) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
