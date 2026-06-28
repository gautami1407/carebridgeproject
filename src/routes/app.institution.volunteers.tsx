import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyInstitution } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/app/institution/volunteers")({
  component: () => {
    const { data: inst, isLoading } = useMyInstitution();
    const { data: apps = [] } = useQuery({
      queryKey: ["inst-apps", inst?.id],
      enabled: !!inst?.id,
      queryFn: async () => {
        const { data, error } = await supabase
          .from("volunteer_applications")
          .select("*, opportunity:volunteer_opportunities!inner(title, institution_id), user:profiles(full_name)")
          .eq("opportunity.institution_id", inst!.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data ?? [];
      },
    });
    if (isLoading) return <LoadingState />;
    if (!inst) return <EmptyState title="No institution linked" />;
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Volunteers" subtitle="Applications to your opportunities." />
        {apps.length === 0 ? <EmptyState title="No applications yet" body="Post a volunteer opportunity to get started." /> : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3">Volunteer</th><th className="px-4 py-3">Opportunity</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apps.map((a) => {
                  const u = a.user as { full_name?: string | null } | null;
                  const o = a.opportunity as { title?: string } | null;
                  return (
                    <tr key={a.id}>
                      <td className="px-4 py-3 font-semibold">{u?.full_name ?? "Volunteer"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{o?.title}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  },
});
