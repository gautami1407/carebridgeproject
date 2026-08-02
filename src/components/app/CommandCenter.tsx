import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, TrendingUp } from "lucide-react";

export function CommandGreeting({ name, subtitle, right }: { name?: string | null; subtitle: string; right?: ReactNode }) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Command centre</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {part}{name ? `, ${name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}

export type UrgentItem = { id: string; title: string; detail: string; href: string; tone?: "urgent" | "primary" | "support" };

export function UrgentPanel({ title = "Needs your attention", items, emptyBody }: { title?: string; items: UrgentItem[]; emptyBody: string }) {
  return (
    <div className="rounded-2xl border border-urgent/30 bg-urgent/5 p-5 shadow-soft">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <AlertTriangle className="size-4 text-urgent" aria-hidden /> {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{emptyBody}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.slice(0, 6).map((i) => (
            <li key={i.id}>
              <Link to={i.href as never} className="block rounded-lg border border-border bg-card p-3 hover:bg-muted">
                <p className="text-sm font-semibold">{i.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{i.detail}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MonthlySummary({ items, note }: { items: { label: string; value: string | number }[]; note?: string }) {
  const month = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });
  return (
    <div className="rounded-2xl border border-support/30 bg-support/5 p-5 shadow-soft">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <TrendingUp className="size-4 text-support" aria-hidden /> This month
      </h2>
      <p className="text-xs text-muted-foreground">{month}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {items.map((i) => (
          <div key={i.label} className="rounded-xl border border-border bg-card p-3">
            <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{i.label}</dt>
            <dd className="text-lg font-bold">{i.value}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="mt-3 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export function UpNext({ items, emptyBody }: { items: { id: string; title: string; when: string; href: string }[]; emptyBody: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 text-lg font-bold"><CalendarClock className="size-4 text-primary" aria-hidden /> Up next</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{emptyBody}</p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {items.slice(0, 5).map((i) => (
            <li key={i.id} className="py-2.5">
              <Link to={i.href as never} className="block hover:text-primary">
                <p className="text-sm font-semibold">{i.title}</p>
                <p className="text-xs text-muted-foreground">{i.when}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function isThisMonth(iso?: string | null) {
  if (!iso) return false;
  const d = new Date(iso);
  const n = new Date();
  return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}
