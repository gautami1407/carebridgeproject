import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useSavedItems, useInstitutions } from "@/lib/queries";
import { MapPin } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/donor/following")({ component: Following });

function Following() {
  const { data: saved = [], isLoading } = useSavedItems();
  const { data: all = [] } = useInstitutions();
  const ids = saved.filter((s) => s.entity_type === "institution").map((s) => s.entity_id);
  const insts = all.filter((i) => ids.includes(i.id));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Institutions you follow" subtitle="Get updates whenever they post new needs or stories." />
      {isLoading ? <LoadingState /> :
        insts.length === 0 ? (
          <EmptyState title="Not following anyone yet" body="Visit an institution profile and follow them to see updates here." action={<Link to="/institutions" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse institutions</Link>} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insts.map((i) => (
              <Link key={i.id} to="/institutions/$slug" params={{ slug: i.slug }} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-lift">
                {i.cover_image && <img src={i.cover_image} alt={i.name} className="h-36 w-full object-cover" />}
                <div className="p-4">
                  <p className="text-sm font-bold">{i.name}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{[i.city, i.state].filter(Boolean).join(", ")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
