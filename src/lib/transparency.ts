// Institution transparency / trust score (0-100).
import type { InstRow } from "./db-mappers";

export type TrustTier = "Excellent" | "Very Good" | "Good" | "Needs Improvement";

export type TrustInputs = {
  inst: InstRow;
  reportsCount: number;
  needsCount: number;
  completedNeedsCount: number;
  totalRaised: number;
  totalGoal: number;
  lastActivityAt?: string | null;
};

export type TrustBreakdown = {
  score: number;
  tier: TrustTier;
  components: { label: string; max: number; got: number; detail: string }[];
};

export function transparencyScore(inp: TrustInputs): TrustBreakdown {
  const components: TrustBreakdown["components"] = [];

  // Verification (25)
  const verifiedPts = inp.inst.verification === "verified" ? 25 : inp.inst.verification === "pending" ? 8 : 0;
  components.push({ label: "Verification", max: 25, got: verifiedPts, detail: `Status: ${inp.inst.verification ?? "unverified"}` });

  // Profile completion (15)
  const fields = [inp.inst.description, inp.inst.cover_image, inp.inst.city, inp.inst.state, inp.inst.residents_count, inp.inst.contact_email];
  const filled = fields.filter(Boolean).length;
  const profilePts = Math.round((filled / fields.length) * 15);
  components.push({ label: "Profile completion", max: 15, got: profilePts, detail: `${filled}/${fields.length} fields filled` });

  // Impact reports published (20)
  const reportPts = Math.min(20, inp.reportsCount * 5);
  components.push({ label: "Impact reports", max: 20, got: reportPts, detail: `${inp.reportsCount} published` });

  // Donation utilization (20) — completed needs / total needs
  const ratio = inp.needsCount > 0 ? inp.completedNeedsCount / inp.needsCount : 0;
  const utilPts = Math.round(ratio * 20);
  components.push({ label: "Donation utilization", max: 20, got: utilPts, detail: `${inp.completedNeedsCount}/${inp.needsCount} needs fulfilled` });

  // Funding progress (10) — raised/goal across needs
  const fundRatio = inp.totalGoal > 0 ? Math.min(1, inp.totalRaised / inp.totalGoal) : 0;
  const fundPts = Math.round(fundRatio * 10);
  components.push({ label: "Funding progress", max: 10, got: fundPts, detail: `₹${inp.totalRaised.toLocaleString()} / ₹${inp.totalGoal.toLocaleString()}` });

  // Recent activity (10)
  let actPts = 0;
  let actDetail = "No recent activity";
  if (inp.lastActivityAt) {
    const days = Math.floor((Date.now() - new Date(inp.lastActivityAt).getTime()) / 86400000);
    if (days <= 7) { actPts = 10; actDetail = "Active this week"; }
    else if (days <= 30) { actPts = 7; actDetail = "Active this month"; }
    else if (days <= 90) { actPts = 4; actDetail = `Last activity ${days} days ago`; }
    else { actPts = 1; actDetail = `Last activity ${days} days ago`; }
  }
  components.push({ label: "Recent activity", max: 10, got: actPts, detail: actDetail });

  const score = components.reduce((s, c) => s + c.got, 0);
  const tier: TrustTier =
    score >= 85 ? "Excellent" : score >= 65 ? "Very Good" : score >= 45 ? "Good" : "Needs Improvement";

  return { score, tier, components };
}
