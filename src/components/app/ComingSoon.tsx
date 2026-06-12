import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";

export function ComingSoon({ title, tagline, bullets }: { title: string; tagline: string; bullets: string[] }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" /> Coming Soon
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{tagline}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {bullets.map((b) => (
            <li key={b} className="rounded-xl border border-border bg-card p-4 text-sm shadow-soft">{b}</li>
          ))}
        </ul>
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm font-semibold">Join the waitlist</p>
          <p className="mt-1 text-sm text-muted-foreground">We'll notify you when this is ready to try.</p>
          {done ? (
            <p className="mt-4 rounded-md bg-support/10 px-4 py-3 text-sm font-semibold text-support">You're on the list — thank you!</p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
                Notify me
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
