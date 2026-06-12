import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/adopt-a-grandparent")({
  component: () => <ComingSoon title="Adopt a Grandparent" tagline="Build a relationship with an elderly resident — calls, letters, visits." bullets={["Match by interests & language", "Weekly check-ins", "Sponsor essentials together", "Honour their stories"]} />,
});
