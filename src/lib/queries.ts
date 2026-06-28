// Central TanStack Query hooks for CareBridge. All real Supabase reads/writes.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import type { Database } from "@/integrations/supabase/types";
import type { NeedRow, InstRow, EventRow, DonationRow, NotificationRow, NeedWithInst } from "./db-mappers";

const keys = {
  needs: ["needs"] as const,
  need: (id: string) => ["need", id] as const,
  institutions: ["institutions"] as const,
  institution: (slug: string) => ["institution", slug] as const,
  myInstitution: (uid: string) => ["my-institution", uid] as const,
  events: ["events"] as const,
  event: (id: string) => ["event", id] as const,
  donations: (filter: string) => ["donations", filter] as const,
  notifications: (uid: string) => ["notifications", uid] as const,
  unread: (uid: string) => ["unread-count", uid] as const,
  saved: (uid: string) => ["saved", uid] as const,
  feed: ["feed"] as const,
  activity: (uid: string) => ["activity", uid] as const,
  roles: (uid: string) => ["roles", uid] as const,
  adminUsers: ["admin-users"] as const,
  reports: ["impact-reports"] as const,
  report: (id: string) => ["impact-report", id] as const,
};

/* ---------- Needs ---------- */

export function useNeeds(opts?: { onlyActive?: boolean; institutionId?: string }) {
  return useQuery({
    queryKey: [...keys.needs, opts?.onlyActive ?? false, opts?.institutionId ?? null],
    queryFn: async () => {
      let q = supabase
        .from("needs")
        .select("*, institution:institutions(*)")
        .order("created_at", { ascending: false });
      if (opts?.onlyActive) q = q.eq("status", "active");
      if (opts?.institutionId) q = q.eq("institution_id", opts.institutionId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as NeedWithInst[];
    },
  });
}

export function useNeed(id: string) {
  return useQuery({
    queryKey: keys.need(id),
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("needs")
        .select("*, institution:institutions(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as NeedWithInst | null;
    },
  });
}

export function useCreateNeed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Database["public"]["Tables"]["needs"]["Insert"]) => {
      const { data, error } = await supabase.from("needs").insert(payload).select("*").single();
      if (error) throw error;
      return data as NeedRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.needs }),
  });
}

/* ---------- Institutions ---------- */

export function useInstitutions(filter?: { state?: string; type?: string; verified?: boolean }) {
  return useQuery({
    queryKey: [...keys.institutions, filter ?? null],
    queryFn: async () => {
      let q = supabase.from("institutions").select("*").order("created_at", { ascending: false });
      if (filter?.state) q = q.eq("state", filter.state);
      if (filter?.type) q = q.eq("type", filter.type as never);
      if (filter?.verified) q = q.eq("verification", "verified");
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as InstRow[];
    },
  });
}

export function useInstitutionBySlug(slug: string) {
  return useQuery({
    queryKey: keys.institution(slug),
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase.from("institutions").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data as InstRow | null;
    },
  });
}

export function useMyInstitution() {
  const uid = useStore((s) => s.session?.id);
  return useQuery({
    queryKey: uid ? keys.myInstitution(uid) : ["my-institution", "anon"],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institutions")
        .select("*")
        .eq("owner_id", uid!)
        .maybeSingle();
      if (error) throw error;
      return data as InstRow | null;
    },
  });
}

export function useUpdateInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Database["public"]["Tables"]["institutions"]["Update"] }) => {
      const { data, error } = await supabase.from("institutions").update(patch).eq("id", id).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.institutions }),
  });
}

export function useVerifyInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "verified" | "rejected" }) => {
      const { error } = await supabase.from("institutions").update({ verification: status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.institutions }),
  });
}

/* ---------- Events ---------- */

export function useEvents(opts?: { institutionId?: string; upcomingOnly?: boolean }) {
  return useQuery({
    queryKey: [...keys.events, opts ?? null],
    queryFn: async () => {
      let q = supabase
        .from("events")
        .select("*, institution:institutions(name, slug, city, state)")
        .eq("is_published", true)
        .order("starts_at", { ascending: true });
      if (opts?.institutionId) q = q.eq("institution_id", opts.institutionId);
      if (opts?.upcomingOnly) q = q.gte("starts_at", new Date().toISOString());
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: keys.event(id),
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, institution:institutions(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Database["public"]["Tables"]["events"]["Insert"]) => {
      const { data, error } = await supabase.from("events").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.events }),
  });
}

export function useRegisterForEvent() {
  const qc = useQueryClient();
  const uid = useStore((s) => s.session?.id);
  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!uid) throw new Error("Sign in to register.");
      const { error } = await supabase
        .from("event_registrations")
        .insert({ event_id: eventId, user_id: uid });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.events }),
  });
}

/* ---------- Donations ---------- */

export function useMyDonations() {
  const uid = useStore((s) => s.session?.id);
  return useQuery({
    queryKey: keys.donations(uid ?? "anon"),
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*, need:needs(title, institution_id, institution:institutions(name, slug))")
        .eq("donor_id", uid!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useInstitutionDonations(institutionId?: string) {
  return useQuery({
    queryKey: keys.donations(`inst:${institutionId ?? ""}`),
    enabled: !!institutionId,
    queryFn: async () => {
      // Donations for any need belonging to this institution
      const { data, error } = await supabase
        .from("donations")
        .select("*, need:needs!inner(title, institution_id), donor:profiles(full_name)")
        .eq("need.institution_id", institutionId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useDonate() {
  const qc = useQueryClient();
  const uid = useStore((s) => s.session?.id);
  return useMutation({
    mutationFn: async ({ needId, amount, message, anonymous }: { needId: string; amount: number; message?: string; anonymous?: boolean }) => {
      if (!uid) throw new Error("Please sign in to donate.");
      const { data, error } = await supabase
        .from("donations")
        .insert({ donor_id: uid, need_id: needId, amount, message: message ?? null, is_anonymous: !!anonymous })
        .select()
        .single();
      if (error) throw error;
      return data as DonationRow;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: keys.need(vars.needId) });
      qc.invalidateQueries({ queryKey: keys.needs });
      qc.invalidateQueries({ queryKey: ["donations"] });
    },
  });
}

/* ---------- Saved items ---------- */

export function useSavedItems() {
  const uid = useStore((s) => s.session?.id);
  return useQuery({
    queryKey: keys.saved(uid ?? "anon"),
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_items").select("*").eq("user_id", uid!);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useToggleSaved() {
  const qc = useQueryClient();
  const uid = useStore((s) => s.session?.id);
  return useMutation({
    mutationFn: async ({ entityId, entityType }: { entityId: string; entityType: "need" | "institution" | "event" | "opportunity" }) => {
      if (!uid) throw new Error("Sign in to save items.");
      const { data: existing } = await supabase
        .from("saved_items")
        .select("id")
        .eq("user_id", uid)
        .eq("entity_id", entityId)
        .eq("entity_type", entityType)
        .maybeSingle();
      if (existing) {
        await supabase.from("saved_items").delete().eq("id", existing.id);
        return { saved: false };
      }
      await supabase.from("saved_items").insert({ user_id: uid, entity_id: entityId, entity_type: entityType });
      return { saved: true };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved"] }),
  });
}

/* ---------- Notifications ---------- */

export function useNotifications() {
  const uid = useStore((s) => s.session?.id);
  return useQuery({
    queryKey: keys.notifications(uid ?? "anon"),
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as NotificationRow[];
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  const uid = useStore((s) => s.session?.id);
  return useMutation({
    mutationFn: async () => {
      if (!uid) return;
      await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", uid).is("read_at", null);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

/* ---------- Activity timeline ---------- */

export function useActivity() {
  const uid = useStore((s) => s.session?.id);
  return useQuery({
    queryKey: keys.activity(uid ?? "anon"),
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(40);
      if (error) throw error;
      return data ?? [];
    },
  });
}

/* ---------- Feed ---------- */

export function useFeed() {
  return useQuery({
    queryKey: keys.feed,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_posts")
        .select("*, author:profiles(full_name, avatar_url), institution:institutions(name, slug)")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(40);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateFeedPost() {
  const qc = useQueryClient();
  const uid = useStore((s) => s.session?.id);
  return useMutation({
    mutationFn: async (body: string) => {
      if (!uid) throw new Error("Sign in to post.");
      const { error } = await supabase.from("feed_posts").insert({ author_id: uid, body });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.feed }),
  });
}

/* ---------- Roles / admin ---------- */

export function useMyRoles() {
  const uid = useStore((s) => s.session?.id);
  return useQuery({
    queryKey: keys.roles(uid ?? "anon"),
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", uid!);
      if (error) throw error;
      return (data ?? []).map((r) => r.role);
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: keys.adminUsers,
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const rolesByUser = new Map<string, string[]>();
      (roles ?? []).forEach((r) => {
        const arr = rolesByUser.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesByUser.set(r.user_id, arr);
      });
      return (profiles ?? []).map((p) => ({ ...p, roles: rolesByUser.get(p.id) ?? ["donor"] }));
    },
  });
}

/* ---------- Impact reports ---------- */

export function useImpactReports(institutionId?: string) {
  return useQuery({
    queryKey: [...keys.reports, institutionId ?? null],
    queryFn: async () => {
      let q = supabase
        .from("impact_reports")
        .select("*, institution:institutions(name, slug)")
        .order("created_at", { ascending: false });
      if (institutionId) q = q.eq("institution_id", institutionId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useImpactReport(id: string) {
  return useQuery({
    queryKey: keys.report(id),
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_reports")
        .select("*, institution:institutions(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/* ---------- Volunteer opportunities & applications ---------- */

export function useOpportunities(opts?: { institutionId?: string }) {
  return useQuery({
    queryKey: ["opportunities", opts ?? null],
    queryFn: async () => {
      let q = supabase
        .from("volunteer_opportunities")
        .select("*, institution:institutions(name, slug, city, state)")
        .eq("is_open", true)
        .order("created_at", { ascending: false });
      if (opts?.institutionId) q = q.eq("institution_id", opts.institutionId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMyApplications() {
  const uid = useStore((s) => s.session?.id);
  return useQuery({
    queryKey: ["my-applications", uid ?? "anon"],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select("*, opportunity:volunteer_opportunities(title, institution_id, institution:institutions(name, slug))")
        .eq("user_id", uid!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useApply() {
  const qc = useQueryClient();
  const uid = useStore((s) => s.session?.id);
  return useMutation({
    mutationFn: async ({ opportunityId, message }: { opportunityId: string; message?: string }) => {
      if (!uid) throw new Error("Sign in to apply.");
      const { error } = await supabase
        .from("volunteer_applications")
        .insert({ opportunity_id: opportunityId, user_id: uid, message: message ?? null });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-applications"] }),
  });
}

/* ---------- Global search ---------- */

export type SearchHit =
  | { kind: "need"; id: string; title: string; subtitle: string; href: string }
  | { kind: "institution"; id: string; title: string; subtitle: string; href: string }
  | { kind: "event"; id: string; title: string; subtitle: string; href: string };

export async function globalSearch(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const like = `%${q}%`;
  const [needs, insts, events] = await Promise.all([
    supabase.from("needs").select("id, title, category").ilike("title", like).limit(5),
    supabase.from("institutions").select("id, slug, name, city").or(`name.ilike.${like},city.ilike.${like}`).limit(5),
    supabase.from("events").select("id, title, location").ilike("title", like).limit(5),
  ]);
  const hits: SearchHit[] = [];
  (needs.data ?? []).forEach((n) =>
    hits.push({ kind: "need", id: n.id, title: n.title, subtitle: `Need · ${n.category}`, href: `/needs/${n.id}` }),
  );
  (insts.data ?? []).forEach((i) =>
    hits.push({ kind: "institution", id: i.id, title: i.name, subtitle: `Institution · ${i.city ?? ""}`, href: `/institutions/${i.slug}` }),
  );
  (events.data ?? []).forEach((e) =>
    hits.push({ kind: "event", id: e.id, title: e.title, subtitle: `Event · ${e.location ?? ""}`, href: `/events/${e.id}` }),
  );
  return hits;
}
