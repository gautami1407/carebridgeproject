import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CareBridge" },
      { name: "description", content: "Get in touch with the CareBridge team." },
      { property: "og:title", content: "Contact — CareBridge" },
      { property: "og:description", content: "Reach out for partnerships, support, or institution onboarding." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Contact</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">We'd love to hear from you</h1>
            <p className="mt-3 text-muted-foreground">
              Partnerships, institution onboarding, CSR programs, or feedback — drop us a line.
            </p>

            <ul className="mt-10 space-y-5">
              <li className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold">Email</p>
                  <p className="truncate text-sm text-muted-foreground">hello@carebridge.org</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold">Phone</p>
                  <p className="text-sm text-muted-foreground">+91 80 4567 8900</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold">Office</p>
                  <p className="text-sm text-muted-foreground">3rd floor, Indiranagar, Bangalore 560 038</p>
                </div>
              </li>
            </ul>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">First name</span>
                <input className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Last name</span>
                <input className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold">Email</span>
              <input type="email" className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-semibold">How can we help?</span>
              <textarea rows={5} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
            <button className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110">
              Send message
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
