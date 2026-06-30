// Smart need prioritization — deterministic scorer.
// Returns a 0–100 score and a tier label. Easy to swap for ML later.
import type { NeedWithInst } from "./db-mappers";

export type PriorityTier = "Critical" | "High" | "Medium" | "Low";

const URGENCY_WEIGHT: Record<string, number> = {
  critical: 35,
  high: 25,
  medium: 12,
  low: 4,
};

const CATEGORY_WEIGHT: Record<string, number> = {
  medical: 12,
  food: 10,
  shelter: 10,
  education: 7,
  clothing: 5,
  other: 3,
};

export function priorityScore(need: NeedWithInst): { score: number; tier: PriorityTier } {
  let s = 0;

  // Urgency (0-35)
  s += URGENCY_WEIGHT[need.urgency] ?? 8;

  // Deadline proximity (0-20)
  if (need.deadline) {
    const days = Math.max(0, Math.ceil((new Date(need.deadline).getTime() - Date.now()) / 86400000));
    if (days <= 3) s += 20;
    else if (days <= 7) s += 15;
    else if (days <= 14) s += 10;
    else if (days <= 30) s += 5;
  }

  // Beneficiaries (0-15) — log scale
  const b = Number((need as { beneficiaries_count?: number | null }).beneficiaries_count ?? need.beneficiaries ?? 0);
  if (b > 0) s += Math.min(15, Math.round(Math.log10(b + 1) * 8));

  // Progress (0-10) — under-funded gets more priority
  const goal = Math.max(1, Number(need.goal_amount ?? 1));
  const raised = Number(need.raised_amount ?? 0);
  const pct = raised / goal;
  if (pct < 0.25) s += 10;
  else if (pct < 0.5) s += 7;
  else if (pct < 0.75) s += 4;

  // Category essentialness (0-12)
  s += CATEGORY_WEIGHT[need.category] ?? 3;

  // Institution verified (+8)
  if (need.institution?.verification === "verified") s += 8;

  // Cap
  s = Math.min(100, Math.round(s));

  const tier: PriorityTier =
    s >= 75 ? "Critical" : s >= 55 ? "High" : s >= 30 ? "Medium" : "Low";

  return { score: s, tier };
}

export const TIER_RANK: Record<PriorityTier, number> = { Critical: 3, High: 2, Medium: 1, Low: 0 };

export function sortByPriority<T extends NeedWithInst>(arr: T[]): T[] {
  return [...arr].sort((a, b) => priorityScore(b).score - priorityScore(a).score);
}
