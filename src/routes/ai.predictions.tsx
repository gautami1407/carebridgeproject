import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/ai/predictions")({
  component: () => <ComingSoon title="AI Need Prediction" tagline="Anticipate seasonal and crisis-driven needs before they spike." bullets={["Forecasts by category & geography", "Early-warning alerts", "Smart re-stocking recommendations", "Built on anonymized platform data"]} />,
});
