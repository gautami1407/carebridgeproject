import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NeedCard } from "@/components/site/NeedCard";
import { sampleNeeds } from "@/lib/sample-data";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Needs — CareBridge" },
      { name: "description", content: "Browse and support verified needs from orphanages and old-age homes across India." },
      { property: "og:title", content: "Explore Needs — CareBridge" },
      { property: "og:description", content: "Real, time-bound needs from verified institutions." },
    ],
  }),
  component: ExplorePage,
});

const categories = ["All", "Food", "Education", "Medical", "Clothing", "Infrastructure"] as const;
const urgencies = ["All", "Critical", "High", "Medium", "Low"] as const;

function ExplorePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [urg, setUrg] = useState<(typeof urgencies)[number]>("All");

  const filtered = useMemo(() => {
    return sampleNeeds.filter((n) => {
      if (cat !== "All" && n.category !== cat) return false;
      if (urg !== "All" && n.urgency !== urg) return false;
      if (q && !(`${n.title} ${n.institution} ${n.location}`.toLowerCase().includes(q.toLowerCase())))
        return false;
      return true;
    });
  }, [q, cat, urg]);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Explore</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Find a need that moves you
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Filter by category, urgency, or location. Every need is from a verified care institution.
          </p>

          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search institution, need, or city…"
                className="w-full rounded-md border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value as typeof cat)}
                className="rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c} {c === "All" ? "categories" : ""}</option>
                ))}
              </select>
              <select
                value={urg}
                onChange={(e) => setUrg(e.target.value as typeof urg)}
                className="rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium"
              >
                {urgencies.map((u) => (
                  <option key={u} value={u}>{u} {u === "All" ? "urgency" : ""}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="mb-6 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
          {sampleNeeds.length} needs
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No needs match your filters yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((n) => (
              <NeedCard key={n.title} need={n} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
