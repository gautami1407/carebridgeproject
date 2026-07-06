// Personalised recommendations. Deterministic heuristics that can later be
// swapped for a real model. Scoring is per-role.
import type { NeedWithInst } from "./db-mappers";
import { priorityScore } from "./scoring";

type OppRow = { id: string; title: string; category: string | null; city?: string | null; state?: string | null; skills?: string[] | null };

/** Recommend needs to a donor based on their past donation categories. */
export function recommendNeedsForDonor(
  needs: NeedWithInst[],
  pastCategories: string[],
  limit = 4,
): NeedWithInst[] {
  const catCounts = new Map<string, number>();
  pastCategories.forEach((c) => catCounts.set(c, (catCounts.get(c) ?? 0) + 1));

  return [...needs]
    .filter((n) => n.status === "active")
    .map((n) => {
      const affinity = (catCounts.get(n.category) ?? 0) * 15;
      const priority = priorityScore(n).score;
      return { n, score: priority + affinity };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.n);
}

/** Recommend volunteer opportunities. Simple location + category affinity. */
export function recommendOpportunitiesForVolunteer(
  opps: OppRow[],
  profile: { city?: string | null; state?: string | null; skills?: string[] },
  limit = 4,
): OppRow[] {
  return [...opps]
    .map((o) => {
      let score = 20;
      if (profile.city && o.city && profile.city.toLowerCase() === o.city.toLowerCase()) score += 40;
      else if (profile.state && o.state && profile.state.toLowerCase() === o.state.toLowerCase()) score += 20;
      if (profile.skills?.length && o.skills?.length) {
        const overlap = o.skills.filter((s) => profile.skills!.includes(s)).length;
        score += overlap * 15;
      }
      return { o, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.o);
}
