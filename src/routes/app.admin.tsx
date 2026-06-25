import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/admin")({ component: AdminGuard });

function AdminGuard() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error || !data) {
        setState("denied");
        setTimeout(() => navigate({ to: "/app" }), 1200);
        return;
      }
      setState("ok");
    })();
  }, [navigate]);

  if (state === "checking") {
    return <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Verifying access…</div>;
  }
  if (state === "denied") {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <p className="text-lg font-semibold">Access denied</p>
          <p className="mt-1 text-sm text-muted-foreground">Admin role required. Redirecting…</p>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
