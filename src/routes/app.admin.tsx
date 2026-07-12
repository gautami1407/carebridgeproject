import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/app/RoleGuard";

export const Route = createFileRoute("/app/admin")({
  component: () => <RoleGuard allow={["admin"]} areaLabel="the admin console" />,
});
