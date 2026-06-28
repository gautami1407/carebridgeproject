import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useAdminUsers } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/admin/users")({
  component: () => {
    const { data: users = [], isLoading } = useAdminUsers();
    if (isLoading) return <LoadingState />;
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader title="Users" subtitle={`${users.length} total`} />
        {users.length === 0 ? <EmptyState title="No users yet" /> : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">City</th><th className="px-4 py-3">Roles</th><th className="px-4 py-3">Joined</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-semibold">{u.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.city ?? "—"}</td>
                    <td className="px-4 py-3 text-xs">
                      {u.roles.map((r) => (
                        <span key={r} className="mr-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary capitalize">{r.replace(/_/g, " ")}</span>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  },
});
