import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/admin/reports")({
  component: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Content reports" />
      <EmptyState title="No open reports" body="Flagged content will appear here for review." />
    </div>
  ),
});
