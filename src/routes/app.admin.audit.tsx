import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/admin/audit")({
  component: () => {
    const { data: logs = [], isLoading } = useQuery({
      queryKey: ["audit-logs"],
      queryFn: async () => {
        const { data, error } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) throw error;
        return data ?? [];
      },
    });
    if (isLoading) return <LoadingState />;
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Audit logs" subtitle="Recent platform activity." />
        {logs.length === 0 ? <EmptyState title="No activity yet" /> : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Summary</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-[11px]">{l.user_id.slice(0, 8)}</td>
                    <td className="px-4 py-3 font-semibold capitalize">{l.type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.summary}</td>
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
