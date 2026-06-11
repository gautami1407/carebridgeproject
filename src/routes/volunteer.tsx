import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Stethoscope, Code2, Camera, Heart, GraduationCap, MapPin, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer Opportunities — CareBridge" },
      { name: "description", content: "Give your time and skills. Find a volunteer role at a verified institution near you." },
      { property: "og:title", content: "Volunteer Opportunities — CareBridge" },
      { property: "og:description", content: "Real volunteer opportunities at verified care institutions." },
    ],
  }),
  component: VolunteerPage,
});

const skills = [
  { icon: BookOpen, label: "Teaching" },
  { icon: Code2, label: "Tech & coding" },
  { icon: Stethoscope, label: "Healthcare" },
  { icon: Camera, label: "Photography" },
  { icon: Heart, label: "Companionship" },
  { icon: GraduationCap, label: "Mentorship" },
];

const opportunities = [
  {
    title: "Weekend English tutor",
    institution: "Sunshine Children's Home",
    location: "Bangalore",
    commitment: "Sat & Sun • 2 hrs",
    skill: "Teaching",
  },
  {
    title: "Coding mentor for teens",
    institution: "Hope Foundation School",
    location: "Hyderabad",
    commitment: "Online • 1 hr / week",
    skill: "Tech & coding",
  },
  {
    title: "Visit & spend time with elders",
    institution: "Silver Oaks Elderly Care",
    location: "Pune",
    commitment: "Flexible • 2 hrs / visit",
    skill: "Companionship",
  },
  {
    title: "Monthly health checkup support",
    institution: "Karuna Elder Trust",
    location: "Chennai",
    commitment: "First Sunday • 4 hrs",
    skill: "Healthcare",
  },
  {
    title: "Storytelling sessions",
    institution: "Anand Bal Sadan",
    location: "Mumbai",
    commitment: "Sat • 1.5 hrs",
    skill: "Companionship",
  },
  {
    title: "Capture an annual day event",
    institution: "Grace Old Age Home",
    location: "Delhi",
    commitment: "Single day • 6 hrs",
    skill: "Photography",
  },
];

function VolunteerPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-support">Volunteer</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Give what only you can — your time.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Choose how you help: teach, mentor, visit, document, or simply spend time with someone
            who needs company.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {skills.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-sm font-semibold shadow-soft"
              >
                <s.icon className="size-4 shrink-0 text-primary" />
                <span className="truncate">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Open opportunities</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((o) => (
            <article
              key={o.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="inline-flex w-fit rounded-full bg-support/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-support">
                {o.skill}
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight">{o.title}</h3>
              <p className="mt-1 text-sm font-medium">{o.institution}</p>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <p className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> {o.location}</p>
                <p className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> {o.commitment}</p>
              </div>
              <div className="mt-6 flex gap-2">
                <Link
                  to="/register"
                  className="flex-1 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:brightness-110"
                >
                  Apply
                </Link>
                <button className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                  Save
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
