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
      const { data, error } = await supabase
        .from("donations")
        .select("*, need:needs!inner(title, institution_id)")
        .eq("need.institution_id", institutionId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data ?? [];
      const donorIds = Array.from(new Set(rows.filter((r) => !r.is_anonymous).map((r) => r.donor_id)));
      const byId = new Map<string, string | null>();
      if (donorIds.length) {
        const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", donorIds);
        (profiles ?? []).forEach((p) => byId.set(p.id, p.full_name));
      }
      return rows.map((r) => ({ ...r, donor: r.is_anonymous ? null : { full_name: byId.get(r.donor_id) ?? null } }));
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
        .select("*, institution:institutions(name, slug)")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(40);
      if (error) throw error;
      const rows = data ?? [];
      // Hydrate author names in a separate query (no FK to profiles)
      const authorIds = Array.from(new Set(rows.map((r) => r.author_id)));
      if (authorIds.length === 0) return rows.map((r) => ({ ...r, author: null as { full_name: string | null } | null }));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", authorIds);
      const byId = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
      return rows.map((r) => ({ ...r, author: { full_name: byId.get(r.author_id) ?? null } }));
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

/* ---------- Donation certificates (Phase 4) ---------- */

export function useMyCertificates() {
  const uid = useStore((s) => s.session?.id);
  return useQuery({
    queryKey: ["my-certificates", uid ?? "anon"],
    enabled: !!uid,
    queryFn: async () => {
      // Get my donations + joined need/institution, then certificates by donation_id
      const { data: donations, error } = await supabase
        .from("donations")
        .select("id, amount, created_at, need:needs(title, institution:institutions(name))")
        .eq("donor_id", uid!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const ids = (donations ?? []).map((d) => d.id);
      if (ids.length === 0) return [];
      const { data: certs } = await supabase
        .from("donation_certificates")
        .select("donation_id, certificate_no, issued_at")
        .in("donation_id", ids);
      const byId = new Map((certs ?? []).map((c) => [c.donation_id, c]));
      return (donations ?? []).map((d) => {
        const c = byId.get(d.id);
        const need = d.need as { title?: string; institution?: { name?: string } | null } | null;
        return {
          donationId: d.id,
          amount: Number(d.amount),
          createdAt: d.created_at,
          needTitle: need?.title ?? "Donation",
          institutionName: need?.institution?.name ?? "CareBridge Institution",
          certificateNo: c?.certificate_no ?? null,
          issuedAt: c?.issued_at ?? d.created_at,
        };
      });
    },
  });
}

/* ---------- Institution public timeline ---------- */

export type TimelineEvent = {
  id: string;
  at: string;
  kind: "need_created" | "donation_received" | "event_conducted" | "need_completed" | "report_published" | "volunteer_joined";
  title: string;
  subtitle?: string;
};

export function useInstitutionTimeline(institutionId?: string) {
  return useQuery({
    queryKey: ["institution-timeline", institutionId ?? "none"],
    enabled: !!institutionId,
    queryFn: async (): Promise<TimelineEvent[]> => {
      const [needs, donations, events, reports] = await Promise.all([
        supabase.from("needs").select("id, title, created_at, status, updated_at").eq("institution_id", institutionId!).order("created_at", { ascending: false }).limit(40),
        supabase.from("donations").select("id, amount, created_at, need:needs!inner(title, institution_id)").eq("need.institution_id", institutionId!).order("created_at", { ascending: false }).limit(40),
        supabase.from("events").select("id, title, starts_at").eq("institution_id", institutionId!).order("starts_at", { ascending: false }).limit(20),
        supabase.from("impact_reports").select("id, title, published_at, created_at").eq("institution_id", institutionId!).order("created_at", { ascending: false }).limit(20),
      ]);
      const out: TimelineEvent[] = [];
      (needs.data ?? []).forEach((n) => {
        out.push({ id: `need-${n.id}`, at: n.created_at, kind: "need_created", title: `New need posted`, subtitle: n.title });
        if (n.status === "fulfilled") out.push({ id: `done-${n.id}`, at: n.updated_at ?? n.created_at, kind: "need_completed", title: `Need completed`, subtitle: n.title });
      });
      (donations.data ?? []).forEach((d) => {
        const need = d.need as { title?: string } | null;
        out.push({ id: `don-${d.id}`, at: d.created_at, kind: "donation_received", title: `₹${Number(d.amount).toLocaleString()} received`, subtitle: need?.title });
      });
      (events.data ?? []).forEach((e) => {
        out.push({ id: `evt-${e.id}`, at: e.starts_at, kind: "event_conducted", title: `Event: ${e.title}` });
      });
      (reports.data ?? []).forEach((r) => {
        out.push({ id: `rep-${r.id}`, at: r.published_at ?? r.created_at, kind: "report_published", title: `Impact report: ${r.title}` });
      });
      return out.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 60);
    },
  });
}

/* ---------- Public platform stats ---------- */

export function usePlatformStats() {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const [donations, needs, insts, evts] = await Promise.all([
        supabase.from("donations").select("amount, created_at, need:needs(category, beneficiaries, beneficiaries_count)"),
        supabase.from("needs").select("id, status, category, beneficiaries, beneficiaries_count, institution:institutions(type)"),
        supabase.from("institutions").select("id, type, verification"),
        supabase.from("event_registrations").select("id"),
      ]);
      const dons = donations.data ?? [];
      const nds = needs.data ?? [];
      const ins = insts.data ?? [];

      const totalAmount = dons.reduce((s, d) => s + Number(d.amount ?? 0), 0);
      const meals = Math.floor(
        dons.filter((d) => {
          const cat = (d.need as { category?: string } | null)?.category;
          return cat === "food";
        }).reduce((s, d) => s + Number(d.amount ?? 0), 0) / 60,
      );
      const completedNeeds = nds.filter((n) => n.status === "fulfilled").length;
      const childrenBenef = nds
        .filter((n) => (n.institution as { type?: string } | null)?.type === "orphanage")
        .reduce((s, n) => s + Number(n.beneficiaries_count ?? n.beneficiaries ?? 0), 0);
      const seniorsBenef = nds
        .filter((n) => (n.institution as { type?: string } | null)?.type === "old_age_home")
        .reduce((s, n) => s + Number(n.beneficiaries_count ?? n.beneficiaries ?? 0), 0);
      const verifiedInsts = ins.filter((i) => i.verification === "verified").length;
      const volunteersActive = (evts.data ?? []).length;

      // Donations by month (last 6 months)
      const byMonth = new Map<string, number>();
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        byMonth.set(d.toLocaleString("en-IN", { month: "short" }), 0);
      }
      dons.forEach((d) => {
        const dt = new Date(d.created_at);
        const key = dt.toLocaleString("en-IN", { month: "short" });
        if (byMonth.has(key)) byMonth.set(key, (byMonth.get(key) ?? 0) + Number(d.amount ?? 0));
      });
      const trend = Array.from(byMonth, ([month, amount]) => ({ month, amount }));

      // Donations by category
      const byCat = new Map<string, number>();
      dons.forEach((d) => {
        const cat = (d.need as { category?: string } | null)?.category ?? "other";
        byCat.set(cat, (byCat.get(cat) ?? 0) + Number(d.amount ?? 0));
      });
      const categories = Array.from(byCat, ([category, amount]) => ({ category, amount }));

      return {
        totalAmount,
        donationsCount: dons.length,
        meals,
        completedNeeds,
        childrenBenef,
        seniorsBenef,
        verifiedInsts,
        volunteersActive,
        trend,
        categories,
      };
    },
  });
}

/* ---------- Badges & achievements (Phase 4) ---------- */

export function useBadgeCatalog() {
  return useQuery({
    queryKey: ["badge-catalog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("badges").select("*").order("category").order("tier");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUserBadges(userId?: string) {
  const uid = useStore((s) => s.session?.id);
  const target = userId ?? uid;
  return useQuery({
    queryKey: ["user-badges", target ?? "anon"],
    enabled: !!target,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_badges")
        .select("badge_id, earned_at, badge:badges(*)")
        .eq("user_id", target!)
        .order("earned_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/* ---------- Public volunteer opportunities list (for recommendations) ---------- */

export function useAllOpportunities() {
  return useQuery({
    queryKey: ["all-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteer_opportunities")
        .select("*, institution:institutions(name, slug, city, state)")
        .eq("is_open", true)
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return data ?? [];
    },
  });
}


/* ---------- Live activity stream (Phase 5) ---------- */

export type LiveActivityItem = {
  id: string;
  at: string;
  kind: "donation" | "registration" | "need_posted" | "need_funded" | "application" | "report";
  title: string;
  subtitle?: string;
  href?: string;
};

export function useLiveActivity(limit = 25) {
  return useQuery({
    queryKey: ["live-activity", limit],
    queryFn: async (): Promise<LiveActivityItem[]> => {
      const [donations, needs, regs, apps, reports] = await Promise.all([
        supabase
          .from("donations")
          .select("id, amount, created_at, is_anonymous, need:needs(id, title, institution:institutions(name))")
          .order("created_at", { ascending: false })
          .limit(limit),
        supabase
          .from("needs")
          .select("id, title, status, created_at, updated_at, raised_amount, goal_amount, institution:institutions(name)")
          .order("created_at", { ascending: false })
          .limit(limit),
        supabase
          .from("event_registrations")
          .select("id, created_at, event:events(id, title, institution:institutions(name))")
          .order("created_at", { ascending: false })
          .limit(limit),
        supabase
          .from("volunteer_applications")
          .select("id, created_at, opportunity:volunteer_opportunities(title, institution:institutions(name))")
          .order("created_at", { ascending: false })
          .limit(limit),
        supabase
          .from("impact_reports")
          .select("id, title, created_at, published_at, is_published, institution:institutions(name)")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(limit),
      ]);

      const out: LiveActivityItem[] = [];
      (donations.data ?? []).forEach((d) => {
        const need = d.need as { id?: string; title?: string; institution?: { name?: string } | null } | null;
        out.push({
          id: `d-${d.id}`,
          at: d.created_at,
          kind: "donation",
          title: `₹${Number(d.amount).toLocaleString()} donated${d.is_anonymous ? " anonymously" : ""}`,
          subtitle: [need?.title, need?.institution?.name].filter(Boolean).join(" · "),
          href: need?.id ? `/needs/${need.id}` : undefined,
        });
      });
      (needs.data ?? []).forEach((n) => {
        const inst = n.institution as { name?: string } | null;
        out.push({
          id: `n-${n.id}`,
          at: n.created_at,
          kind: "need_posted",
          title: `New need posted`,
          subtitle: [n.title, inst?.name].filter(Boolean).join(" · "),
          href: `/needs/${n.id}`,
        });
        if (n.status === "fulfilled") {
          out.push({
            id: `nf-${n.id}`,
            at: n.updated_at ?? n.created_at,
            kind: "need_funded",
            title: `Need fully funded`,
            subtitle: [n.title, inst?.name].filter(Boolean).join(" · "),
            href: `/needs/${n.id}`,
          });
        }
      });
      (regs.data ?? []).forEach((r) => {
        const e = r.event as { id?: string; title?: string; institution?: { name?: string } | null } | null;
        out.push({
          id: `r-${r.id}`,
          at: r.created_at,
          kind: "registration",
          title: `Someone registered for an event`,
          subtitle: [e?.title, e?.institution?.name].filter(Boolean).join(" · "),
          href: e?.id ? `/events/${e.id}` : undefined,
        });
      });
      (apps.data ?? []).forEach((a) => {
        const o = a.opportunity as { title?: string; institution?: { name?: string } | null } | null;
        out.push({
          id: `a-${a.id}`,
          at: a.created_at,
          kind: "application",
          title: `New volunteer application`,
          subtitle: [o?.title, o?.institution?.name].filter(Boolean).join(" · "),
          href: "/volunteer",
        });
      });
      (reports.data ?? []).forEach((r) => {
        const inst = r.institution as { name?: string } | null;
        out.push({
          id: `ir-${r.id}`,
          at: r.published_at ?? r.created_at,
          kind: "report",
          title: `Impact report published`,
          subtitle: [r.title, inst?.name].filter(Boolean).join(" · "),
          href: `/impact-reports/${r.id}`,
        });
      });

      return out
        .filter((i) => !!i.at)
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
        .slice(0, limit);
    },
  });
}

/* ---------- Donation journey (need posted → thank-you) ---------- */

export type JourneyStage = {
  key: "need_posted" | "donation_made" | "funds_allocated" | "impact_delivered" | "impact_report" | "thank_you";
  label: string;
  detail: string;
  at?: string | null;
  state: "done" | "current" | "pending";
  href?: string;
};

export function useDonationJourney(donationId: string) {
  const uid = useStore((s) => s.session?.id);
  return useQuery({
    queryKey: ["donation-journey", donationId],
    enabled: !!donationId,
    queryFn: async () => {
      const { data: donation, error } = await supabase
        .from("donations")
        .select("id, amount, message, created_at, is_anonymous, need_id, donor_id, need:needs(*, institution:institutions(*))")
        .eq("id", donationId)
        .maybeSingle();
      if (error) throw error;
      if (!donation) return null;

      const need = donation.need as (NeedRow & { institution?: InstRow | null }) | null;

      const [{ data: cert }, { data: reports }] = await Promise.all([
        supabase.from("donation_certificates").select("certificate_no, issued_at").eq("donation_id", donationId).maybeSingle(),
        need
          ? supabase
              .from("impact_reports")
              .select("id, title, summary, outcomes, beneficiaries, photos, published_at, is_published")
              .eq("institution_id", need.institution_id)
              .order("created_at", { ascending: false })
              .limit(5)
          : Promise.resolve({ data: [] as never[] }),
      ]);

      const needReport = (reports ?? []).find((r) => r.is_published) ?? null;
      const raised = Number(need?.raised_amount ?? 0);
      const goal = Math.max(1, Number(need?.goal_amount ?? 1));
      const funded = raised >= goal;
      const fulfilled = need?.status === "fulfilled";

      const stages: JourneyStage[] = [
        {
          key: "need_posted",
          label: "Need posted",
          detail: need ? `${need.institution?.name ?? "The institution"} published “${need.title}”.` : "Need published.",
          at: need?.created_at,
          state: "done",
          href: need ? `/needs/${need.id}` : undefined,
        },
        {
          key: "donation_made",
          label: "Your donation received",
          detail: `₹${Number(donation.amount).toLocaleString()} contributed${donation.is_anonymous ? " anonymously" : ""}.`,
          at: donation.created_at,
          state: "done",
        },
        {
          key: "funds_allocated",
          label: "Funds allocated",
          detail: funded
            ? `Goal reached — ₹${raised.toLocaleString()} of ₹${goal.toLocaleString()} raised.`
            : `₹${raised.toLocaleString()} of ₹${goal.toLocaleString()} raised so far (${Math.round((raised / goal) * 100)}%).`,
          at: funded ? need?.updated_at : null,
          state: funded ? "done" : "current",
        },
        {
          key: "impact_delivered",
          label: "Impact delivered",
          detail: fulfilled
            ? `${need?.institution?.name ?? "The institution"} confirmed delivery to ${need?.beneficiaries_count ?? need?.beneficiaries ?? "the"} beneficiaries.`
            : "The institution will confirm delivery once the need is fulfilled.",
          at: fulfilled ? need?.updated_at : null,
          state: fulfilled ? "done" : funded ? "current" : "pending",
        },
        {
          key: "impact_report",
          label: "Impact report",
          detail: needReport
            ? needReport.summary ?? needReport.title
            : "An impact report with photos and outcomes will be published here.",
          at: needReport?.published_at ?? null,
          state: needReport ? "done" : fulfilled ? "current" : "pending",
          href: needReport ? `/impact-reports/${needReport.id}` : undefined,
        },
        {
          key: "thank_you",
          label: "Thank-you message",
          detail: needReport?.outcomes
            ? needReport.outcomes
            : fulfilled
              ? `Thank you for making this possible. Your gift reached ${need?.institution?.name ?? "the institution"}.`
              : "A personal thank-you from the institution arrives after delivery.",
          at: needReport?.published_at ?? null,
          state: fulfilled || needReport ? "done" : "pending",
        },
      ];

      return {
        donation: { id: donation.id, amount: Number(donation.amount), createdAt: donation.created_at, isMine: donation.donor_id === uid },
        need,
        institution: need?.institution ?? null,
        certificateNo: cert?.certificate_no ?? null,
        certificateIssuedAt: cert?.issued_at ?? null,
        donorMessage: (donation.message as string | null) ?? null,
        report: needReport,
        stages,
      };
    },
  });
}

/* ---------- Institution trust stats ---------- */

export function useInstitutionTrustStats(institutionId?: string) {
  return useQuery({
    queryKey: ["institution-trust", institutionId ?? "none"],
    enabled: !!institutionId,
    queryFn: async () => {
      const [needs, reports, evts, apps] = await Promise.all([
        supabase.from("needs").select("id, title, status, created_at, updated_at, raised_amount, goal_amount, cover_image").eq("institution_id", institutionId!),
        supabase.from("impact_reports").select("id, title, photos, published_at, is_published, beneficiaries").eq("institution_id", institutionId!),
        supabase.from("events").select("id, banner_url, starts_at").eq("institution_id", institutionId!),
        supabase.from("volunteer_applications").select("id, status, created_at, updated_at, opportunity:volunteer_opportunities!inner(institution_id)").eq("opportunity.institution_id", institutionId!),
      ]);

      const nds = needs.data ?? [];
      const reps = (reports.data ?? []).filter((r) => r.is_published);
      const applications = apps.data ?? [];

      // Response time = median days between application created and decided
      const decided = applications.filter((a) => a.status !== "pending" && a.updated_at);
      const deltas = decided
        .map((a) => (new Date(a.updated_at!).getTime() - new Date(a.created_at).getTime()) / 86400000)
        .filter((d) => d >= 0)
        .sort((a, b) => a - b);
      const responseDays = deltas.length ? deltas[Math.floor(deltas.length / 2)] : null;

      const fulfilled = nds.filter((n) => n.status === "fulfilled");
      const fulfilmentRate = nds.length ? Math.round((fulfilled.length / nds.length) * 100) : 0;

      const photos: { url: string; caption: string }[] = [];
      reps.forEach((r) => (r.photos ?? []).forEach((p: string) => photos.push({ url: p, caption: r.title })));
      nds.forEach((n) => n.cover_image && photos.push({ url: n.cover_image, caption: n.title }));
      (evts.data ?? []).forEach((e) => e.banner_url && photos.push({ url: e.banner_url, caption: "Event" }));

      return {
        needsCount: nds.length,
        completedNeedsCount: fulfilled.length,
        fulfilmentRate,
        reportsCount: reps.length,
        totalRaised: nds.reduce((s, n) => s + Number(n.raised_amount ?? 0), 0),
        totalGoal: nds.reduce((s, n) => s + Number(n.goal_amount ?? 0), 0),
        beneficiaries: reps.reduce((s, r) => s + Number(r.beneficiaries ?? 0), 0),
        responseDays,
        applicationsCount: applications.length,
        acceptedCount: applications.filter((a) => a.status === "accepted" || a.status === "completed").length,
        photos: photos.slice(0, 12),
      };
    },
  });
}
