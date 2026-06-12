import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { NeedCard } from "@/components/site/NeedCard";

export const Route = createFileRoute("/app/donor/saved")({
  component: SavedNeeds,
});

function SavedNeeds() {
  const saved = useStore((s) => s.savedNeeds);
  const needs = useStore((s) => s.needs).filter((n) => saved.includes(n.id));
  const insts = useStore((s) => s.institutions);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Saved needs" subtitle="Causes you bookmarked to support later." />
      {needs.length === 0 ? (
        <EmptyState title="No saved needs yet" body="Browse current needs and tap the bookmark to save them here." action={<Link to="/explore" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse needs</Link>} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((n) => {
            const inst = insts.find((i) => i.id === n.institutionId)!;
            return <NeedCard key={n.id} need={{ ...n, institution: inst.name, location: `${inst.city}, ${inst.state}`, impact: n.description }} />;
          })}
        </div>
      )}
    </div>
  );
}
