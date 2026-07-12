import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export type DbRole = "donor" | "volunteer" | "mentor" | "institution_admin" | "admin";

type Props = {
  allow: DbRole[];
  /** Label shown while denied. Defaults to "this area". */
  areaLabel?: string;
};

/**
 * Client-side role gate. Redirects unauthenticated users to /login and
 * users lacking a required role back to /app. Admins always pass.
 *
 * NOTE: This is a UX guard only. Real authorization is enforced by RLS on
 * every table in the backend — this just avoids showing pages the user
 * cannot use.
 */
export function RoleGuard({ allow, areaLabel = "this area" }: Props) {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ok" | "denied" | "anon">("checking");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (cancelled) return;
        setState("anon");
        navigate({ to: "/login" });
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (cancelled) return;
      if (error) {
        setState("denied");
        setTimeout(() => navigate({ to: "/app" }), 1200);
        return;
      }
      const roles = new Set((data ?? []).map((r) => r.role as DbRole));
      const permitted = roles.has("admin") || allow.some((r) => roles.has(r));
      if (!permitted) {
        setState("denied");
        setTimeout(() => navigate({ to: "/app" }), 1400);
        return;
      }
      setState("ok");
    })();
    return () => { cancelled = true; };
    // allow is a stable literal array in each caller; safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (state === "checking" || state === "anon") {
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">
        Verifying access…
      </div>
    );
  }
  if (state === "denied") {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <p className="text-lg font-semibold">Access denied</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You don't have permission to view {areaLabel}. Redirecting…
          </p>
        </div>
      </div>
    );
  }
  return <Outlet />;
}

/** Session-only gate: any signed-in user passes; anon → /login. */
export function SessionGuard() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        navigate({ to: "/login" });
        return;
      }
      setState("ok");
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  if (state === "checking") {
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <Outlet />;
}
