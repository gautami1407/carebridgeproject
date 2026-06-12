import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/mentor-a-child")({
  component: () => <ComingSoon title="Mentor a Child" tagline="One-on-one mentorship from caring adults to children in need." bullets={["Vetted volunteer mentors", "Structured 6-month programs", "Weekly virtual or in-person sessions", "Outcomes tracked with the institution"]} />,
});
