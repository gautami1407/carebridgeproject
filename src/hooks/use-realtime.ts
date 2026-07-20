import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

/**
 * Global realtime sync — mounted once at the root.
 *
 * Two channels:
 *  - `realtime:public`  → live for every visitor (signed in or not). Pushes
 *    need status/progress, volunteer opportunity changes, donations (for
 *    donor counts), applications & event registrations (for participant
 *    counts). All UI count/status reads are keyed off these queries so they
 *    stay in sync without polling.
 *  - `realtime:user:<uid>` → per-user notifications, activity, saved items.
 */
export function useRealtimeSync() {
  const uid = useStore((s) => s.session?.id);
  const qc = useQueryClient();

  // Public channel — always on
  useEffect(() => {
    const invalidateNeeds = (id?: string) => {
      if (id) {
        qc.invalidateQueries({ queryKey: ["need", id] });
        qc.invalidateQueries({ queryKey: ["needs", id] });
      }
      qc.invalidateQueries({ queryKey: ["needs"] });
      qc.invalidateQueries({ queryKey: ["platform-stats"] });
    };
    const invalidateOpps = () => {
      qc.invalidateQueries({ queryKey: ["opportunities"] });
      qc.invalidateQueries({ queryKey: ["all-opportunities"] });
    };

    const channel = supabase
      .channel("realtime:public")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "needs" },
        (payload) => {
          const row = (payload.new ?? payload.old) as { id?: string } | null;
          invalidateNeeds(row?.id);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donations" },
        (payload) => {
          const row = (payload.new ?? payload.old) as { need_id?: string } | null;
          qc.invalidateQueries({ queryKey: ["donations"] });
          invalidateNeeds(row?.need_id);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "volunteer_opportunities" },
        () => invalidateOpps(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "volunteer_applications" },
        () => {
          invalidateOpps();
          qc.invalidateQueries({ queryKey: ["my-applications"] });
          qc.invalidateQueries({ queryKey: ["applications"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_registrations" },
        () => {
          qc.invalidateQueries({ queryKey: ["events"] });
          qc.invalidateQueries({ queryKey: ["my-registrations"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  // User channel — only when signed in
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
        { event: "INSERT", schema: "public", table: "activity_log", filter: `user_id=eq.${uid}` },
        () => {
          qc.invalidateQueries({ queryKey: ["activity"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "saved_items", filter: `user_id=eq.${uid}` },
        () => {
          qc.invalidateQueries({ queryKey: ["saved"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_badges", filter: `user_id=eq.${uid}` },
        () => {
          qc.invalidateQueries({ queryKey: ["user-badges"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [uid, qc]);
}
