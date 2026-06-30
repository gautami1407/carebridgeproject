import { Sparkles } from "lucide-react";
import type { PriorityTier } from "@/lib/scoring";

const STYLES: Record<PriorityTier, string> = {
  Critical: "bg-urgent/10 text-urgent border-urgent/20",
  High: "bg-amber-100 text-amber-800 border-amber-200",
  Medium: "bg-primary/10 text-primary border-primary/20",
  Low: "bg-muted text-muted-foreground border-border",
};

export function PriorityBadge({ tier, score, compact }: { tier: PriorityTier; score?: number; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STYLES[tier]}`}
      title={score !== undefined ? `AI priority score: ${score}/100` : undefined}
    >
      <Sparkles className="size-3" aria-hidden />
      {compact ? tier : `${tier} priority`}
      {score !== undefined && !compact && <span className="opacity-70">· {score}</span>}
    </span>
  );
}
