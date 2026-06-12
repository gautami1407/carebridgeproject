import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/ai/matching")({
  component: () => <ComingSoon title="AI Volunteer Matching" tagline="Match volunteers to opportunities by skills, schedule, and proximity." bullets={["Smart compatibility scoring", "Recurring schedule planning", "Skill-based opportunity filtering", "Reduces drop-off after one event"]} />,
});
