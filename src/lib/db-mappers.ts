// Translates DB rows to the UI shapes used by existing components.
import type { Database } from "@/integrations/supabase/types";

type NeedRow = Database["public"]["Tables"]["needs"]["Row"];
type InstRow = Database["public"]["Tables"]["institutions"]["Row"];
type EventRow = Database["public"]["Tables"]["events"]["Row"];
type DonationRow = Database["public"]["Tables"]["donations"]["Row"];
type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export type NeedWithInst = NeedRow & { institution?: InstRow | null };

export const cap = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "";

// Days remaining (or "Past deadline" / "Completed")
export function deadlineLabel(deadline: string | null, status?: string) {
  if (status === "fulfilled") return "Completed";
  if (!deadline) return "Ongoing";
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (days < 0) return "Past deadline";
  if (days === 0) return "Today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function urgencyLabel(u: string): "Critical" | "High" | "Medium" | "Low" {
  return (u.charAt(0).toUpperCase() + u.slice(1)) as "Critical" | "High" | "Medium" | "Low";
}

export function needToCardUI(n: NeedWithInst) {
  const inst = n.institution;
  return {
    id: n.id,
    title: n.title,
    institution: inst?.name ?? "Verified institution",
    location: inst ? [inst.city, inst.state].filter(Boolean).join(", ") : "",
    category: cap(n.category),
    urgency: urgencyLabel(n.urgency),
    fulfilled: Number(n.raised_amount ?? 0),
    goal: Math.max(1, Number(n.goal_amount ?? 1)),
    unit: "₹",
    deadline: deadlineLabel(n.deadline, n.status),
    impact: n.description,
  };
}

export type { NeedRow, InstRow, EventRow, DonationRow, NotificationRow };
