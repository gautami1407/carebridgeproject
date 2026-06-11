import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import storyEducation from "@/assets/story-education.jpg";
import storyGarden from "@/assets/story-garden.jpg";
import inst2 from "@/assets/institution-2.jpg";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Success Stories — CareBridge" },
      { name: "description", content: "Real outcomes from the CareBridge community." },
      { property: "og:title", content: "Success Stories — CareBridge" },
      { property: "og:description", content: "Tangible proof of community impact." },
    ],
  }),
  component: StoriesPage,
});

const stories = [
  {
    img: storyEducation,
    tag: "Education",
    title: "20 students now learning to code",
    body: "St. Mary's Home didn't have a single working computer. Through 12 donated laptops and 4 volunteer mentors, students are now building their first websites and applying to scholarships.",
    impact: "12 laptops · 4 mentors · 20 students",
  },
  {
    img: storyGarden,
    tag: "Wellbeing",
    title: "A sensory garden for Heritage Senior Care",
    body: "Forty weekend volunteers transformed an empty courtyard into a therapeutic green space. Residents report a 40% improvement in mood and daily social engagement.",
    impact: "40 volunteers · 1 weekend · 60 residents",
  },
  {
    img: inst2,
    tag: "Healthcare",
    title: "Year-long medicine sponsorship at Silver Oaks",
    body: "Thirty donors collectively sponsored chronic diabetes and blood pressure medication for an entire year, freeing the home's budget for residential improvements.",
    impact: "30 donors · 12 months · 38 residents",
  },
];

function StoriesPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-support">Impact</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Stories that changed lives
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every contribution leaves a trace. Here are a few outcomes from the CareBridge community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
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
              <div className="p-6">
                <span className="inline-flex rounded-full bg-support/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-support">
                  {s.tag}
                </span>
                <h3 className="mt-3 text-lg font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <p className="mt-4 border-t border-border pt-4 text-xs font-semibold text-foreground">
                  {s.impact}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
