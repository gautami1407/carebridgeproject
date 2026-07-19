import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

/**
 * Subscribes to Supabase realtime channels for the signed-in user.
 * - Notifications: new rows toast + invalidate the bell/list.
 * - Donations: invalidate donor + institution donation lists.
 * - Needs: invalidate detail & list caches so raised_amount ticks up.
 * - Activity log: refresh the timeline.
 */
export function useRealtimeSync() {
  const uid = useStore((s) => s.session?.id);
  const qc = useQueryClient();

  useEffect(() => {
    if (!uid) return;

    const channel = supabase
      .channel(`realtime:user:${uid}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${uid}` },
        (payload) => {
          const n = payload.new as { title?: string; body?: string };
          if (n?.title) toast(n.title, { description: n.body ?? undefined });
          qc.invalidateQueries({ queryKey: ["notifications"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donations" },
        () => {
          qc.invalidateQueries({ queryKey: ["donations"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "needs" },
        (payload) => {
          const row = payload.new as { id?: string };
          if (row?.id) qc.invalidateQueries({ queryKey: ["needs", row.id] });
          qc.invalidateQueries({ queryKey: ["needs"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log", filter: `user_id=eq.${uid}` },
        () => {
          qc.invalidateQueries({ queryKey: ["activity"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [uid, qc]);
}
