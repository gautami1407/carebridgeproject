import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/app/RoleGuard";

export const Route = createFileRoute("/app/donor")({
  component: () => <RoleGuard allow={["donor"]} areaLabel="the donor dashboard" />,
});
