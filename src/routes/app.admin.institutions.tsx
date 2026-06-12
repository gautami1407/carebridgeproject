import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/admin/institutions")({
  component: () => {
    const insts = useStore((s) => s.institutions);
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader title="Institution verification" />
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {insts.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-3 font-semibold">{i.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.city}, {i.state}</td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-4 py-3 text-right">{i.status === "Pending" ? (<div className="flex justify-end gap-2"><button className="rounded-md bg-support px-3 py-1.5 text-xs font-semibold text-support-foreground">Approve</button><button className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold">Reject</button></div>) : <span className="text-xs text-muted-foreground">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
