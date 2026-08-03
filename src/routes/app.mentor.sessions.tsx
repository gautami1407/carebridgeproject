import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { LoadingState, EmptyState, ErrorState } from "@/components/app/states";
import { useMentorApplications } from "@/lib/queries";

export const Route = createFileRoute("/app/mentor/sessions")({ component: Sessions });

function Sessions() {
  const { data: apps = [], isLoading, isError, error, refetch } = useMentorApplications();
  if (isLoading) return <LoadingState label="Loading sessions…" />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

  const rows = [...apps].sort((a, b) => {
    const at = a.opportunity?.starts_at ?? a.created_at;
    const bt = b.opportunity?.starts_at ?? b.created_at;
    return new Date(bt).getTime() - new Date(at).getTime();
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Sessions" subtitle="Every mentorship placement you have applied to, with its schedule and status." />
      {rows.length === 0 ? (
        <EmptyState
          title="No sessions scheduled"
          body="Apply to a mentorship or teaching role to start scheduling sessions."
          action={
            <Link to="/volunteer" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Find a role
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {a.opportunity?.starts_at
                      ? new Date(a.opportunity.starts_at).toLocaleString()
                      : `Applied ${new Date(a.created_at).toLocaleDateString()}`}
                  </td>
                  <td className="px-4 py-3 font-semibold">{a.opportunity?.institution?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.opportunity?.title ?? "Mentorship"}</td>
                  <td className="px-4 py-3">{Number(a.hours_logged ?? 0)}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
