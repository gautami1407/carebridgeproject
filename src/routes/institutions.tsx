import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Users, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { sampleInstitutions } from "@/lib/sample-data";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "Verified Institutions — CareBridge" },
      { name: "description", content: "Browse verified orphanages and old-age homes on CareBridge." },
      { property: "og:title", content: "Verified Institutions — CareBridge" },
      { property: "og:description", content: "Every institution on CareBridge is document- and visit-verified." },
    ],
  }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Institutions</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Verified care institutions
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every home is verified through registration documents, financial filings, and on-ground visits.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleInstitutions.concat(sampleInstitutions).map((inst, i) => (
            <article
              key={i}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <img
                  src={inst.image}
                  alt={inst.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-support">
                  <ShieldCheck className="size-3" /> Verified
                </span>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {inst.type}
                </span>
                <h3 className="mt-1 text-lg font-bold tracking-tight">{inst.name}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {inst.location}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{inst.blurb}</p>
                <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3.5" /> {inst.residents} residents
                  </span>
                  <Link to="/explore" className="text-sm font-semibold text-primary hover:underline">
                    View needs →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
