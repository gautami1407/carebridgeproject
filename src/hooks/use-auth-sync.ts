import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore, type Role } from "@/lib/store";

// Map DB role -> store role
function mapRole(dbRole: string | null | undefined): Role {
  switch (dbRole) {
    case "volunteer": return "volunteer";
    case "mentor": return "mentor";
    case "institution_admin": return "institution";
    case "admin": return "admin";
    default: return "donor";
  }
}

async function loadSession() {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) {
    useStore.getState().syncSession(null);
    return;
  }

  // Fetch primary role + profile in parallel (best-effort)
  const [{ data: roles }, { data: profile }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", user.id),
    supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).maybeSingle(),
  ]);

  // Pick highest-priority role
  const order = ["admin", "institution_admin", "mentor", "volunteer", "donor"];
  const dbRole = roles?.map((r) => r.role).sort((a, b) => order.indexOf(a) - order.indexOf(b))[0];

  useStore.getState().syncSession({
    id: user.id,
    email: user.email ?? "",
    name: profile?.full_name || (user.email?.split("@")[0] ?? "Friend"),
    avatar: profile?.avatar_url ?? undefined,
    role: mapRole(dbRole),
  });
}

export function useAuthSync() {
  useEffect(() => {
    // Listener first to avoid races
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
        // defer to avoid calling supabase synchronously inside callback
        setTimeout(() => { void loadSession(); }, 0);
      }
    });
    void loadSession();
    return () => subscription.unsubscribe();
  }, []);
}
