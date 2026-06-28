import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useActivity } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/donor/impact")({ component: Impact });

function Impact() {
  const { data: items = [], isLoading } = useActivity();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Your activity timeline" subtitle="Every milestone your support unlocked." />
      {isLoading ? <LoadingState /> :
        items.length === 0 ? <EmptyState title="No activity yet" body="Once you donate, register for events, or apply to volunteer, the timeline will fill up here." /> : (
          <ol className="relative ml-3 border-l-2 border-primary/20">
            {items.map((a) => (
              <li key={a.id} className="ml-6 pb-8">
                <span className="absolute -left-2 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                <p className="mt-1 font-semibold capitalize">{a.type.replace(/_/g, " ")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{a.summary}</p>
              </li>
            ))}
          </ol>
        )}
    </div>
  );
}
