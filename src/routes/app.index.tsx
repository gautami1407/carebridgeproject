import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/")({
  component: AppIndexRedirect,
});

function AppIndexRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const order = ["admin", "institution_admin", "mentor", "volunteer", "donor"] as const;
      const dbRole = roles?.map((r) => r.role).sort(
        (a, b) => order.indexOf(a as typeof order[number]) - order.indexOf(b as typeof order[number]),
      )[0] ?? "donor";
      const segment =
        dbRole === "institution_admin" ? "institution" :
        dbRole === "admin" ? "admin" :
        dbRole;
      navigate({ to: `/app/${segment}`, replace: true });
    })();
  }, [navigate]);
  return <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Loading…</div>;
}
