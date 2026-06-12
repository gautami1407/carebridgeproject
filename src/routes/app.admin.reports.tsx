import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/admin/reports")({
  component: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Content reports" />
      <EmptyState title="No open reports" body="All flagged content has been reviewed." />
    </div>
  ),
});
