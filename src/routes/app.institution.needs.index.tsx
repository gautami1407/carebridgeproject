import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyInstitution, useNeeds } from "@/lib/queries";
import { Plus } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/institution/needs/")({ component: NeedsList });

function NeedsList() {
  const { data: inst, isLoading } = useMyInstitution();
  const { data: needs = [] } = useNeeds({ institutionId: inst?.id });

  if (isLoading) return <LoadingState />;
  if (!inst) return <EmptyState title="No institution linked" body="Contact a platform admin to link your institution." />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Needs"
        subtitle="All needs your institution has posted."
        action={<Link to="/app/institution/needs/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />Create need</Link>}
      />
      {needs.length === 0 ? (
        <EmptyState title="No needs yet" body="Post your first need to start receiving support." action={<Link to="/app/institution/needs/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create your first need</Link>} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Urgency</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {needs.map((n) => (
                <tr key={n.id}>
                  <td className="px-4 py-3 font-semibold">{n.title}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{n.category}</td>
                  <td className="px-4 py-3">₹{Number(n.raised_amount).toLocaleString()} / ₹{Number(n.goal_amount).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={n.urgency} /></td>
                  <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                  <td className="px-4 py-3 text-right"><Link to="/app/institution/needs/$id" params={{ id: n.id }} className="text-xs font-semibold text-primary hover:underline">Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
