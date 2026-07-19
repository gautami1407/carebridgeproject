import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, HeartHandshake, LineChart, Users, Building2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NeedCard } from "@/components/site/NeedCard";
import { sampleNeeds, sampleInstitutions } from "@/lib/sample-data";
import heroImage from "@/assets/hero-care.jpg";
import storyEducation from "@/assets/story-education.jpg";
import storyGarden from "@/assets/story-garden.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareBridge — Every Need Deserves a Helping Hand" },
      {
        name: "description",
        content:
          "Connect with verified orphanages and old-age homes. Donate, volunteer, and mentor to create transparent, measurable impact.",
      },
      { property: "og:title", content: "CareBridge — Every Need Deserves a Helping Hand" },
      { property: "og:description", content: "A trusted platform connecting communities with care institutions." },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "₹12.5L+", label: "Raised" },
  { value: "3,450", label: "Donations" },
  { value: "127", label: "Verified Institutions" },
  { value: "980", label: "Active Volunteers" },
  { value: "2,100", label: "Lives Impacted" },
];

const howSteps = [
  {
    icon: ShieldCheck,
    title: "Institutions verified",
    body: "Every orphanage and old-age home is verified through documents and on-ground visits.",
  },
  {
    icon: Sparkles,
    title: "Needs published",
    body: "Institutions post specific, time-bound needs — bags, meals, medicine, mentors.",
  },
  {
    icon: HeartHandshake,
    title: "You contribute",
    body: "Donate funds, donate items, or give your time. Choose exactly what you support.",
  },
  {
    icon: LineChart,
    title: "Impact tracked",
    body: "See delivery confirmations, photos of utilization, and follow-up impact reports.",
  },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-support opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-support" />
              </span>
              127 verified institutions active right now
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.05] text-foreground text-balance sm:text-5xl md:text-6xl">
              Every need deserves a <span className="text-primary">helping hand.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Connect with verified orphanages and old-age homes. Donate essentials, volunteer your
              time, or mentor a resident — and see exactly how your support is used.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:brightness-110"
              >
                Donate Now <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Become a Volunteer
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Raised</dt>
                <dd className="mt-1 text-2xl font-bold text-foreground">₹12.5L+</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lives</dt>
                <dd className="mt-1 text-2xl font-bold text-foreground">2,100+</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Homes</dt>
                <dd className="mt-1 text-2xl font-bold text-foreground">127</dd>
              </div>
            </dl>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl shadow-lift">
              <img
                src={heroImage}
                alt="A young volunteer reading a book with a smiling elderly woman in a sunlit room"
                width={896}
                height={1120}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden max-w-[260px] rounded-2xl border border-border bg-card p-4 shadow-lift sm:block">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-urgent/10 text-urgent">
                  <Sparkles className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">Urgent need</p>
                  <p className="truncate text-xs text-muted-foreground">
                    50 school bags · Sunshine Home
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT COUNTER */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* URGENT NEEDS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-urgent">Urgent</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Needs you can fulfill this week
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Real requests from verified institutions. Each one is time-bound and tracked end-to-end.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View all needs <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleNeeds.slice(0, 3).map((need) => (
            <NeedCard key={need.title} need={need} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-support">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A transparent path from need to impact
            </h2>
            <p className="mt-3 text-muted-foreground">
              Four simple steps — built around verification, choice, and proof.
            </p>
          </div>

          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howSteps.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Step {i + 1}
                </span>
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FEATURED INSTITUTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Verified partners</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Institutions building real change
            </h2>
          </div>
          <Link
            to="/institutions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            See all institutions <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {sampleInstitutions.map((inst) => (
            <article
              key={inst.name}
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
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {inst.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3" /> {inst.residents} residents
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold tracking-tight">{inst.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{inst.location}</p>
                <p className="mt-3 text-sm text-muted-foreground">{inst.blurb}</p>
                <div className="mt-5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-urgent/10 px-2 py-1 text-xs font-semibold text-urgent">
                    {inst.needs} active needs
                  </span>
                  <Link
                    to="/institutions"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View profile →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-support">Real impact</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Stories that changed lives
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              {
                img: storyEducation,
                tag: "Education",
                title: "20 students now learning to code",
                body: "St. Mary's Home had no computers. Through 12 donated laptops and 4 volunteer mentors, students are now building their first websites and applying to scholarships.",
              },
              {
                img: storyGarden,
                tag: "Wellbeing",
                title: "A sensory garden for Heritage Senior Care",
                body: "40 weekend volunteers transformed an empty courtyard into a therapeutic garden. Residents report a 40% improvement in mood and social engagement.",
              },
            ].map((s) => (
              <article
                key={s.title}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="p-6 md:p-8">
                  <span className="inline-flex rounded-full bg-support/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-support">
                    {s.tag}
                  </span>
                  <h3 className="mt-3 text-xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
                  <Link
                    to="/stories"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Read full story <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Help a child or elder in under two minutes.
              </h2>
              <p className="mt-3 max-w-xl text-base text-primary-foreground/80">
                Browse real, verified needs and choose exactly what you support. Every contribution
                comes with proof of delivery.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-background/90"
              >
                Explore needs <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Building2 className="size-4" /> Register institution
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
