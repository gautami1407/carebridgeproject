// Donation impact calculator — translates ₹ amount + category into human sentences.
// Deterministic today; swap for ML personalization later without changing call sites.

type Category = "food" | "education" | "medical" | "shelter" | "clothing" | "other";

const TEMPLATES: Record<Category, (n: number) => string> = {
  food: (n) => `Provides ${n} nutritious meal${n === 1 ? "" : "s"} for residents in need.`,
  education: (n) => `Sponsors school supplies for ${n} child${n === 1 ? "" : "ren"} for a month.`,
  medical: (n) => `Funds ${n} essential medical check-up${n === 1 ? "" : "s"} or medication kit${n === 1 ? "" : "s"}.`,
  shelter: (n) => `Covers ${n} night${n === 1 ? "" : "s"} of safe shelter for one resident.`,
  clothing: (n) => `Provides ${n} complete outfit${n === 1 ? "" : "s"} or warm blanket${n === 1 ? "" : "s"}.`,
  other: (n) => `Funds essential care for ${n} resident${n === 1 ? "" : "s"} this week.`,
};

// Per-unit cost (₹) for each category — calibrated for Indian NGOs.
const UNIT_COST: Record<Category, number> = {
  food: 60,
  education: 400,
  medical: 250,
  shelter: 200,
  clothing: 350,
  other: 300,
};

export function impactStatement(amount: number, category: string): string {
  if (!amount || amount <= 0) return "Choose an amount to see your impact.";
  const cat = (category in TEMPLATES ? category : "other") as Category;
  const units = Math.max(1, Math.floor(amount / UNIT_COST[cat]));
  return TEMPLATES[cat](units);
}

export function suggestedAmounts(category: string): number[] {
  const cat = (category in UNIT_COST ? category : "other") as Category;
  const unit = UNIT_COST[cat];
  return [unit, unit * 5, unit * 15, unit * 50];
}

export function cumulativeImpact(donations: { amount: number; category?: string | null }[]) {
  const totals: Record<string, number> = { food: 0, education: 0, medical: 0, shelter: 0, clothing: 0, other: 0 };
  for (const d of donations) {
    const cat = (d.category && d.category in UNIT_COST ? d.category : "other") as Category;
    totals[cat] += Math.floor(Number(d.amount) / UNIT_COST[cat]);
  }
  return {
    meals: totals.food,
    childrenEducated: totals.education,
    medicalKits: totals.medical,
    shelterNights: totals.shelter,
    outfits: totals.clothing,
    other: totals.other,
  };
}
