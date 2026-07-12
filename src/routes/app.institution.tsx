import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/app/RoleGuard";

export const Route = createFileRoute("/app/institution")({
  component: () => <RoleGuard allow={["institution_admin"]} areaLabel="the institution dashboard" />,
});
