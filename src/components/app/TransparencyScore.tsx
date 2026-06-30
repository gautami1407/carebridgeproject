import { useState } from "react";
import { ShieldCheck, Info, X } from "lucide-react";
import type { TrustBreakdown } from "@/lib/transparency";

const TIER_STYLES = {
  Excellent: "bg-support/10 text-support border-support/30",
  "Very Good": "bg-primary/10 text-primary border-primary/30",
  Good: "bg-amber-100 text-amber-800 border-amber-200",
  "Needs Improvement": "bg-urgent/10 text-urgent border-urgent/20",
} as const;

export function TransparencyScore({ breakdown }: { breakdown: TrustBreakdown }) {
  const [open, setOpen] = useState(false);
  const tone = TIER_STYLES[breakdown.tier];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group inline-flex items-center gap-2 rounded-xl border p-3 text-left transition hover:shadow-soft ${tone}`}
        aria-label="View transparency score breakdown"
      >
        <ShieldCheck className="size-5 shrink-0" aria-hidden />
        <div className="leading-tight">
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Trust Score</div>
          <div className="text-sm font-bold">{breakdown.tier} · {breakdown.score}/100</div>
        </div>
        <Info className="size-3.5 opacity-60" aria-hidden />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Trust score breakdown</p>
                <h2 className="mt-1 text-2xl font-bold">{breakdown.score} <span className="text-base font-medium text-muted-foreground">/100</span></h2>
                <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone}`}>{breakdown.tier}</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="grid size-8 place-items-center rounded hover:bg-muted"><X className="size-4" /></button>
            </div>
            <ul className="mt-5 space-y-3">
              {breakdown.components.map((c) => (
                <li key={c.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{c.label}</span>
                    <span className="text-muted-foreground">{c.got}/{c.max}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-strong">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(c.got / c.max) * 100}%` }} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-md bg-surface p-3 text-xs text-muted-foreground">
              Trust scores are computed from verification status, profile completeness, published impact reports, donation utilization, funding progress, and recent activity. Scores update automatically as institutions deliver impact.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
