import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Info } from "lucide-react";

export type Need = {
  id?: string;
  title: string;
  institution: string;
  location: string;
  category: string;
  urgency: "Critical" | "High" | "Medium" | "Low";
  fulfilled: number;
  goal: number;
  unit: string;
  deadline: string;
  impact: string;
  image?: string;
};

const urgencyStyles: Record<Need["urgency"], string> = {
  Critical: "bg-[color:var(--brand-ink)] text-[color:var(--brand-mint)] ring-[color:var(--brand-ink)]/25",
  High: "bg-urgent text-urgent-foreground ring-urgent/25",
  Medium: "bg-[color:var(--brand-teal)] text-white ring-[color:var(--brand-teal)]/25",
  Low: "bg-muted text-foreground ring-border",
};

function fmtAmount(value: number, unit: string) {
  if (unit === "₹") return `₹${value.toLocaleString("en-IN")}`;
  return `${value.toLocaleString("en-IN")} ${unit}`;
}

export function NeedCard({ need }: { need: Need }) {
  const pct = Math.min(100, Math.round((need.fulfilled / Math.max(1, need.goal)) * 100));
  const remaining = Math.max(0, need.goal - need.fulfilled);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      {need.image && (
        <div className="relative h-52 overflow-hidden rounded-2xl bg-surface">
          <img
            src={need.image}
            alt={need.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-4 ${urgencyStyles[need.urgency]}`}
            >
              {need.urgency}
            </span>
          </div>
          <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-sm">
            <Clock className="size-3" /> {need.deadline}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {!need.image && (
          <div className="mb-4 flex items-start justify-between gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-4 ${urgencyStyles[need.urgency]}`}
            >
              {need.urgency}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Clock className="size-3.5" />
              {need.deadline}
            </span>
          </div>
        )}

        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--brand-teal)]">
          {need.category}
        </p>
        <h3 className="mt-1.5 font-display text-2xl leading-[1.15] text-foreground">
          {need.title}
        </h3>
        <p className="mt-2 text-sm font-medium text-foreground/80">{need.institution}</p>
        {need.location && (
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> {need.location}
          </p>
        )}

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {need.impact}
        </p>

        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {fmtAmount(need.fulfilled, need.unit)} raised
            </span>
            <span className="text-muted-foreground">Goal {fmtAmount(need.goal, need.unit)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong">
            <div
              className="h-full rounded-full bg-[color:var(--brand-teal)] transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{pct}% funded</span>
            {remaining > 0 && <span>{fmtAmount(remaining, need.unit)} still needed</span>}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {need.id ? (
            <Link
              to="/needs/$id"
              params={{ id: need.id }}
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Support Now
            </Link>
          ) : (
            <Link
              to="/explore"
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Support Now
            </Link>
          )}
          {need.id ? (
            <Link
              to="/needs/$id"
              params={{ id: need.id }}
              aria-label="View details"
              className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <Info className="size-4" />
            </Link>
          ) : (
            <button
              type="button"
              aria-label="View details"
              className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <Info className="size-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
