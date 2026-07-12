import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/app/RoleGuard";

export const Route = createFileRoute("/app/volunteer")({
  component: () => <RoleGuard allow={["volunteer"]} areaLabel="the volunteer dashboard" />,
});
