import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/app/RoleGuard";

export const Route = createFileRoute("/app/mentor")({
  component: () => <RoleGuard allow={["mentor"]} areaLabel="the mentor dashboard" />,
});
