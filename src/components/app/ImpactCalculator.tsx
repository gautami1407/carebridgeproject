import { Sparkles } from "lucide-react";
import { impactStatement } from "@/lib/impact";

export function ImpactCalculator({ amount, category }: { amount: number; category: string }) {
  const text = impactStatement(amount, category);
  return (
    <div className="rounded-lg border border-support/30 bg-support/5 p-3 text-xs">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-support">
        <Sparkles className="size-3" aria-hidden /> Your impact
      </div>
      <p className="mt-1 text-sm font-medium text-foreground/90">{text}</p>
    </div>
  );
}
