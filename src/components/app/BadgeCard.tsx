import { iconFor, TIER_STYLES, type BadgeTier } from "@/lib/badges";

export type BadgeCatalogItem = {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  tier: string;
  category: string;
};

export function BadgeCard({ badge, earned, earnedAt }: { badge: BadgeCatalogItem; earned?: boolean; earnedAt?: string | null }) {
  const Icon = iconFor(badge.icon);
  const tone = TIER_STYLES[(badge.tier as BadgeTier) ?? "bronze"];
  return (
    <div
      className={`relative rounded-2xl border p-4 transition ${earned ? "border-border bg-card shadow-soft" : "border-dashed border-border/60 bg-muted/30 opacity-60"}`}
      title={badge.description}
    >
      <div className={`grid size-12 place-items-center rounded-xl ring-2 ${tone.ring} ${tone.chip}`}>
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="mt-3">
        <p className="text-sm font-bold leading-tight">{badge.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{badge.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone.chip}`}>{tone.label}</span>
        {earned && earnedAt && (
          <span className="text-[10px] text-muted-foreground">Earned {new Date(earnedAt).toLocaleDateString()}</span>
        )}
        {!earned && <span className="text-[10px] text-muted-foreground">Locked</span>}
      </div>
    </div>
  );
}
