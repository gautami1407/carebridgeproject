import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Users, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useInstitutions } from "@/lib/queries";
import { LoadingState, ErrorState, EmptyState, SkeletonCards } from "@/components/app/states";
import { cap } from "@/lib/db-mappers";
import { useState } from "react";

export const Route = createFileRoute("/institutions/")({
  head: () => ({
    meta: [
      { title: "Verified Institutions — CareBridge" },
      { name: "description", content: "Browse verified orphanages and old-age homes on CareBridge." },
    ],
  }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const { data: insts = [], isLoading, isError, error, refetch } = useInstitutions({ verified: true, state: state || undefined, type: type || undefined });

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Institutions</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Verified care institutions</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Every home is verified through registration documents, financial filings, and on-ground visits.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <input aria-label="Filter by state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <select aria-label="Filter by type" value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="">All types</option>
              <option value="orphanage">Orphanage</option>
              <option value="old_age_home">Old-Age Home</option>
              <option value="shelter">Shelter</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {isLoading ? <SkeletonCards /> :
          isError ? <ErrorState error={error} onRetry={() => refetch()} /> :
          insts.length === 0 ? (
            <EmptyState title="No institutions yet" body="As verified homes onboard, they'll appear here." />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {insts.map((inst) => (
                <Link key={inst.id} to="/institutions/$slug" params={{ slug: inst.slug }} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    {inst.cover_image ? (
                      <img src={inst.cover_image} alt={inst.name} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="grid size-full place-items-center text-primary/40"><Users className="size-10" /></div>
                    )}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-support">
                      <ShieldCheck className="size-3" /> Verified
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{cap(inst.type)}</span>
                    <h3 className="mt-1 text-lg font-bold tracking-tight">{inst.name}</h3>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{[inst.city, inst.state].filter(Boolean).join(", ")}</p>
                    {inst.description && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{inst.description}</p>}
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Users className="size-3.5" />{inst.residents_count ?? 0} residents</span>
                      <span className="text-sm font-semibold text-primary">View profile →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </section>
    </SiteLayout>
  );
}
