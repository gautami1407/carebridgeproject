import { Link } from "@tanstack/react-router";
import { MapPin, Clock } from "lucide-react";

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
};

const urgencyStyles: Record<Need["urgency"], string> = {
  Critical: "bg-urgent/10 text-urgent",
  High: "bg-urgent/10 text-urgent",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-muted text-muted-foreground",
};

export function NeedCard({ need }: { need: Need }) {
  const pct = Math.min(100, Math.round((need.fulfilled / need.goal) * 100));
  const remaining = Math.max(0, need.goal - need.fulfilled);

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${urgencyStyles[need.urgency]}`}
        >
          {need.urgency} Priority
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Clock className="size-3.5" />
          {need.deadline}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">{need.title}</h3>
      <p className="mt-1 text-sm font-medium text-foreground/80">{need.institution}</p>
      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3" /> {need.location} • {need.category}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{need.impact}</p>

      <div className="mt-6 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-foreground">
            {need.fulfilled}/{need.goal} {need.unit}
          </span>
          <span className="text-support">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong">
          <div
            className="h-full rounded-full bg-support transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{remaining} {need.unit} still needed</p>
      </div>

      <div className="mt-6 flex gap-2">
        {need.id ? (
          <Link to="/needs/$id" params={{ id: need.id }} className="flex-1 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
            Support Now
          </Link>
        ) : (
          <Link to="/explore" className="flex-1 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
            Support Now
          </Link>
        )}
        {need.id ? (
          <Link to="/needs/$id" params={{ id: need.id }} className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">Details</Link>
        ) : (
          <button type="button" className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">Details</button>
        )}
      </div>
    </article>
  );
}
