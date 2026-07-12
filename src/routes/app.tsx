import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { SessionGuard } from "@/components/app/RoleGuard";

export const Route = createFileRoute("/app")({
  component: () => (
    <AppShell>
      <SessionGuard />
    </AppShell>
  ),
});
