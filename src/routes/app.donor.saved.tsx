import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { NeedCard } from "@/components/site/NeedCard";
import { useSavedItems, useNeeds } from "@/lib/queries";
import { needToCardUI } from "@/lib/db-mappers";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/donor/saved")({ component: SavedNeeds });

function SavedNeeds() {
  const { data: saved = [], isLoading } = useSavedItems();
  const { data: all = [] } = useNeeds();
  const savedIds = saved.filter((s) => s.entity_type === "need").map((s) => s.entity_id);
  const needs = all.filter((n) => savedIds.includes(n.id));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Saved needs" subtitle="Causes you bookmarked to support later." />
      {isLoading ? <LoadingState /> :
        needs.length === 0 ? (
          <EmptyState title="No saved needs yet" body="Browse current needs and tap the bookmark to save them here." action={<Link to="/explore" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse needs</Link>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {needs.map((n) => <NeedCard key={n.id} need={needToCardUI(n)} />)}
          </div>
        )}
    </div>
  );
}
