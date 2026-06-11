import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, ShieldCheck, HeartHandshake } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CareBridge" },
      { name: "description", content: "CareBridge is a transparent platform connecting verified care institutions with donors, volunteers, and mentors." },
      { property: "og:title", content: "About CareBridge" },
      { property: "og:description", content: "Our mission, vision, and how we build trust." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, title: "Mission", body: "Make it effortless for any person to help a verified care institution in under two minutes." },
  { icon: Eye, title: "Vision", body: "A world where no child or elder lacks support because of disconnected systems." },
  { icon: ShieldCheck, title: "Trust", body: "Every institution is document- and visit-verified. Every donation comes with proof of use." },
  { icon: HeartHandshake, title: "Community", body: "We measure success not in donations alone — but in volunteers, mentors, and long-term relationships." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">About</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            A trusted bridge between care institutions and the people who want to help.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Many orphanages and old-age homes struggle with visibility and inconsistent support.
            CareBridge gives them a transparent home — and gives donors and volunteers a clear path
            from intention to impact.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <v.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">The problem</h2>
              <ul className="mt-6 space-y-3 text-muted-foreground">
                {[
                  "Care institutions struggle with limited visibility and inconsistent donations.",
                  "Volunteers don't know where their skills are needed.",
                  "Donors rarely see what their contribution actually achieved.",
                  "Emergency needs go unmet because there's no rapid distribution channel.",
                ].map((p) => (
                  <li key={p} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-urgent" />{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Our answer</h2>
              <ul className="mt-6 space-y-3 text-muted-foreground">
                {[
                  "Verified directory of orphanages and old-age homes.",
                  "Specific, time-bound needs — donate items, money, or hours.",
                  "End-to-end tracking with photo and delivery confirmation.",
                  "Skill-based matching for volunteers, mentors, and professionals.",
                ].map((p) => (
                  <li key={p} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-support" />{p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/explore" className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110">
              Explore needs
            </Link>
            <Link to="/contact" className="rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
