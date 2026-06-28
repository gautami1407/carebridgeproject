import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NeedCard } from "@/components/site/NeedCard";
import { useNeeds } from "@/lib/queries";
import { needToCardUI } from "@/lib/db-mappers";
import { LoadingState, ErrorState, EmptyState, SkeletonCards } from "@/components/app/states";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Needs — CareBridge" },
      { name: "description", content: "Browse and support verified needs from orphanages and old-age homes across India." },
    ],
  }),
  component: ExplorePage,
});

const categories = ["All", "food", "education", "medical", "shelter", "clothing", "other"] as const;
const urgencies = ["All", "critical", "high", "medium", "low"] as const;

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function ExplorePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [urg, setUrg] = useState<(typeof urgencies)[number]>("All");
  const [city, setCity] = useState("");
  const { data: rows = [], isLoading, isError, error, refetch } = useNeeds({ onlyActive: true });

  const all = useMemo(() => rows.map(needToCardUI), [rows]);

  const filtered = useMemo(() => {
    return all.filter((n, idx) => {
      const r = rows[idx];
      if (cat !== "All" && r.category !== cat) return false;
      if (urg !== "All" && r.urgency !== urg) return false;
      if (city && !(`${n.location}`.toLowerCase().includes(city.toLowerCase()))) return false;
      if (q && !(`${n.title} ${n.institution} ${n.location}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [all, rows, q, cat, urg, city]);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Explore</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Find a need that moves you</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Filter by category, urgency, or city. Every need is from a verified care institution.</p>

          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <label className="sr-only" htmlFor="search-needs">Search needs</label>
              <input id="search-needs" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search institution, need, or city…" className="w-full rounded-md border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden />
              <select aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value as typeof cat)} className="rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium">
                {categories.map((c) => <option key={c} value={c}>{c === "All" ? "All categories" : cap(c)}</option>)}
              </select>
              <select aria-label="Filter by urgency" value={urg} onChange={(e) => setUrg(e.target.value as typeof urg)} className="rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium">
                {urgencies.map((u) => <option key={u} value={u}>{u === "All" ? "All urgencies" : cap(u)}</option>)}
              </select>
              <input aria-label="Filter by city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-28 rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {isLoading ? (
          <SkeletonCards />
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="No needs match your filters" body="Try clearing filters or check back soon — new needs are posted weekly." />
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {all.length} active needs
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((n) => <NeedCard key={n.id} need={n} />)}
            </div>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
