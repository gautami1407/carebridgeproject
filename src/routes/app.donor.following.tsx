import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/app/donor/following")({
  component: Following,
});

function Following() {
  const ids = useStore((s) => s.savedInstitutions);
  const insts = useStore((s) => s.institutions).filter((i) => ids.includes(i.id));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Institutions you follow" subtitle="Get updates whenever they post new needs or stories." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insts.map((i) => (
          <Link key={i.id} to="/institutions/$slug" params={{ slug: i.slug }} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-lift">
            <img src={i.image} alt={i.name} className="h-36 w-full object-cover" />
            <div className="p-4">
              <p className="text-sm font-bold">{i.name}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {i.city}, {i.state}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
