import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  LineChart,
  Users,
  Building2,
  Quote,
  BadgeCheck,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NeedCard } from "@/components/site/NeedCard";
import { sampleNeeds, sampleInstitutions } from "@/lib/sample-data";
import heroImage from "@/assets/hero-care.jpg";
import storyEducation from "@/assets/story-education.jpg";
import storyGarden from "@/assets/story-garden.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareBridge — Bridging intent and impact" },
      {
        name: "description",
        content:
          "CareBridge connects verified orphanages and old-age homes with donors, volunteers, and mentors — every rupee tracked, every life touched, real.",
      },
      { property: "og:title", content: "CareBridge — Bridging intent and impact" },
      {
        property: "og:description",
        content:
          "A transparent giving platform for verified care institutions across India.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "₹12.5L+", label: "Funds Raised" },
  { value: "3,450", label: "Donations" },
  { value: "127", label: "Verified Homes" },
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

const liveTicker = [
  "₹12,400 raised for Shanti Niketan monthly meals",
  "15 winter kits pledged for Grace Old Age Home",
  "New volunteer applied to Hope Foundation School",
  "82% funded — Diabetes medication at Silver Oaks",
  "Impact report published for Anand Bal Sadan",
  "3 mentors matched this week in Chennai",
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO — deep ocean editorial */}
      <section className="relative isolate overflow-hidden bg-hero-ocean text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden>
          <div className="mx-auto grid h-full max-w-7xl grid-cols-12 px-4 sm:px-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-l border-white/10 last:border-r" />
            ))}
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-mint)] backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--brand-mint)] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[color:var(--brand-mint)]" />
              </span>
              127 verified institutions active
            </span>

            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Bridging the gap between{" "}
              <span className="italic text-[color:var(--brand-mint)]">intent</span> and{" "}
              <span className="italic text-[color:var(--brand-teal)]">impact</span>.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">
              CareBridge connects donors, volunteers, and mentors with verified orphanages
              and old-age homes across India — through a transparent, real-time ecosystem
              where every rupee is tracked and every life touched is real.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-mint)] px-7 py-4 text-sm font-semibold text-[color:var(--brand-ink)] shadow-glow transition hover:brightness-110"
              >
                Donate Now <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Become a Volunteer
              </Link>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">Raised</dt>
                <dd className="mt-1 font-display text-3xl text-white">₹12.5L+</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">Lives</dt>
                <dd className="mt-1 font-display text-3xl text-white">2,100+</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">Homes</dt>
                <dd className="mt-1 font-display text-3xl text-white">127</dd>
              </div>
            </dl>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[color:var(--brand-deep)] p-1 shadow-lift">
              <img
                src={heroImage}
                alt="A young volunteer reading a book with a smiling elderly woman in a sunlit room"
                width={896}
                height={1120}
                className="size-full rounded-[calc(theme(borderRadius.3xl)-4px)] object-cover"
              />
              <div className="pointer-events-none absolute inset-1 rounded-[calc(theme(borderRadius.3xl)-4px)] bg-gradient-to-t from-[color:var(--brand-ink)]/40 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 max-w-[280px] rounded-2xl bg-card p-4 text-card-foreground shadow-lift">
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[color:var(--brand-mint)]/15 text-[color:var(--brand-teal)]">
                  <BadgeCheck className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold">100% Verified</p>
                  <p className="text-xs text-muted-foreground">Real-time impact tracking</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 hidden max-w-[220px] rounded-2xl border border-white/15 bg-white/10 p-3 text-white backdrop-blur-md sm:block">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[color:var(--brand-mint)]" />
                <p className="text-[11px] font-semibold uppercase tracking-wider">Urgent need</p>
              </div>
              <p className="mt-1 text-sm leading-snug">
                50 school bags · Sunshine Home
              </p>
            </div>
          </div>
        </div>

        {/* LIVE TICKER */}
        <div className="border-t border-white/10 bg-[color:var(--brand-mint)] py-4 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
            {[...liveTicker, ...liveTicker].map((line, i) => (
              <span
                key={i}
                className="flex items-center gap-3 text-sm font-semibold text-[color:var(--brand-ink)]"
              >
                <span className="inline-block size-1.5 rounded-full bg-[color:var(--brand-ink)]" />
                {line}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT COUNTER */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-14 sm:px-6 md:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="border-l border-border pl-4 first:border-l-0 first:pl-0 md:border-l md:first:border-l">
              <p className="font-display text-3xl text-foreground sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* URGENT NEEDS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-teal)]">
              Immediate Action
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Prioritized <span className="italic text-[color:var(--brand-teal)]">urgent</span> needs
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Real requests from verified institutions. Every one is time-bound, tracked
              end-to-end, and closed with an impact report.
            </p>
          </div>
          <Link
            to="/explore"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-foreground"
          >
            View all needs
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sampleNeeds.slice(0, 3).map((need) => (
            <NeedCard key={need.title} need={need} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-teal)]">
              How it works
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              A transparent path from{" "}
              <span className="italic text-[color:var(--brand-teal)]">need</span> to{" "}
              <span className="italic text-[color:var(--brand-teal)]">impact</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Four steps — built around verification, choice, and proof.
            </p>
          </div>

          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howSteps.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-3xl border border-border bg-card p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-[color:var(--brand-ink)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--brand-mint)]">
                  Step {i + 1}
                </span>
                <span className="grid size-12 place-items-center rounded-2xl bg-[color:var(--brand-mint)]/15 text-[color:var(--brand-teal)]">
                  <step.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-2xl leading-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FEATURED INSTITUTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-teal)]">
              Verified partners
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Institutions building{" "}
              <span className="italic text-[color:var(--brand-teal)]">real change</span>
            </h2>
          </div>
          <Link
            to="/institutions"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-foreground"
          >
            See all institutions
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {sampleInstitutions.map((inst) => (
            <article
              key={inst.name}
              className="group overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                <img
                  src={inst.image}
                  alt={inst.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--brand-teal)] shadow-sm">
                  <ShieldCheck className="size-3.5" /> Verified
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {inst.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3" /> {inst.residents} residents
                  </span>
                </div>
                <h3 className="mt-2 font-display text-2xl leading-tight">{inst.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{inst.location}</p>
                <p className="mt-3 text-sm text-muted-foreground">{inst.blurb}</p>
                <div className="mt-5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-urgent/10 px-2.5 py-1 text-xs font-semibold text-urgent">
                    {inst.needs} active needs
                  </span>
                  <Link
                    to="/institutions"
                    className="text-sm font-semibold text-[color:var(--brand-teal)] hover:underline"
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
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-teal)]">
              Real impact
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Stories that changed <span className="italic text-[color:var(--brand-teal)]">lives</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
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
                className="group overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Quote className="absolute right-6 top-6 size-8 text-white/70" />
                </div>
                <div className="p-6 md:p-8">
                  <span className="inline-flex rounded-full bg-[color:var(--brand-mint)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--brand-teal)]">
                    {s.tag}
                  </span>
                  <h3 className="mt-3 font-display text-3xl leading-tight">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
                  <Link
                    to="/stories"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.14em] text-foreground hover:text-[color:var(--brand-teal)]"
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
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-hero-ocean px-6 py-16 text-white sm:px-14">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[color:var(--brand-teal)] opacity-20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-[color:var(--brand-mint)] opacity-15 blur-3xl" />

          <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-4xl leading-tight sm:text-5xl">
                Help a child or elder in{" "}
                <span className="italic text-[color:var(--brand-mint)]">under two minutes</span>.
              </h2>
              <p className="mt-4 max-w-xl text-base text-white/70">
                Browse real, verified needs and choose exactly what you support. Every
                contribution comes with proof of delivery and a follow-up impact report.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-mint)] px-7 py-4 text-sm font-semibold text-[color:var(--brand-ink)] transition hover:brightness-110"
              >
                Explore needs <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
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
