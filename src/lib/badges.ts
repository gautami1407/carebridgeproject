// Badge catalog metadata & UI helpers. The catalog is seeded in the database,
// but this file provides icon/color mapping for rendering.
import { Award, Heart, Gift, Trophy, Star, HandHeart, ShieldCheck, BadgeCheck, FileText, type LucideIcon } from "lucide-react";

export type BadgeTier = "bronze" | "silver" | "gold" | "platinum";

export const BADGE_ICONS: Record<string, LucideIcon> = {
  award: Award,
  heart: Heart,
  gift: Gift,
  trophy: Trophy,
  star: Star,
  "hand-heart": HandHeart,
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  "file-text": FileText,
};

export const TIER_STYLES: Record<BadgeTier, { chip: string; ring: string; label: string }> = {
  bronze: { chip: "bg-amber-100 text-amber-800 border-amber-200", ring: "ring-amber-300", label: "Bronze" },
  silver: { chip: "bg-slate-100 text-slate-700 border-slate-200", ring: "ring-slate-300", label: "Silver" },
  gold: { chip: "bg-yellow-100 text-yellow-800 border-yellow-200", ring: "ring-yellow-400", label: "Gold" },
  platinum: { chip: "bg-primary/10 text-primary border-primary/20", ring: "ring-primary/40", label: "Platinum" },
};

export function iconFor(name: string): LucideIcon {
  return BADGE_ICONS[name] ?? Award;
}
