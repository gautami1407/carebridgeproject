import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/app/institution/needs/")({
  component: NeedsList,
});

function NeedsList() {
  const instId = useStore((s) => s.session?.institutionId ?? "inst-1");
  const needs = useStore((s) => s.needs).filter((n) => n.institutionId === instId);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Needs" subtitle="All needs your institution has posted."
        action={<Link to="/app/institution/needs/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />Create need</Link>}
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {needs.map((n) => (
              <tr key={n.id}>
                <td className="px-4 py-3 font-semibold">{n.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{n.category}</td>
                <td className="px-4 py-3">{n.fulfilled}/{n.goal} {n.unit}</td>
                <td className="px-4 py-3"><StatusBadge status={n.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                <td className="px-4 py-3 text-right"><Link to="/app/institution/needs/$id" params={{ id: n.id }} className="text-xs font-semibold text-primary hover:underline">Manage</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
