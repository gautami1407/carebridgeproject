import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppShell";
import { useCreateEvent, useMyInstitution } from "@/lib/queries";
import { FileUpload } from "@/components/app/FileUpload";
import type { Database } from "@/integrations/supabase/types";
import { LoadingState, EmptyState } from "@/components/app/states";

type EventKind = Database["public"]["Enums"]["event_kind"];
const kinds: EventKind[] = ["health_camp", "education", "birthday", "festival", "volunteer_drive", "fundraiser", "other"];

export const Route = createFileRoute("/app/institution/events/new")({ component: NewEvent });

function NewEvent() {
  const navigate = useNavigate();
  const { data: inst, isLoading } = useMyInstitution();
  const create = useCreateEvent();
  const [banner, setBanner] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", kind: "education" as EventKind, description: "", starts_at: "", capacity: 20, location: "" });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });

  if (isLoading) return <LoadingState />;
  if (!inst) return <EmptyState title="No institution linked" />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create event" />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          try {
            await create.mutateAsync({
              institution_id: inst.id,
              title: form.title,
              kind: form.kind,
              description: form.description,
              starts_at: new Date(form.starts_at).toISOString(),
              capacity: form.capacity,
              location: form.location,
              banner_url: banner,
              is_published: true,
            });
            navigate({ to: "/app/institution/events" });
          } catch (ex) {
            setErr(ex instanceof Error ? ex.message : "Failed to create event");
          }
        }}
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <L label="Title"><input required value={form.title} onChange={(e) => set("title", e.target.value)} className="inp" /></L>
        <div className="grid gap-5 sm:grid-cols-2">
          <L label="Type"><select value={form.kind} onChange={(e) => set("kind", e.target.value as EventKind)} className="inp capitalize">{kinds.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}</select></L>
          <L label="Capacity"><input type="number" min={1} value={form.capacity} onChange={(e) => set("capacity", +e.target.value)} className="inp" /></L>
        </div>
        <L label="Description"><textarea rows={3} required value={form.description} onChange={(e) => set("description", e.target.value)} className="inp" /></L>
        <L label="Starts at"><input type="datetime-local" required value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)} className="inp" /></L>
        <L label="Location"><input required value={form.location} onChange={(e) => set("location", e.target.value)} className="inp" /></L>
        <L label="Banner image (optional)"><FileUpload bucket="public-media" prefix="events" onUploaded={(out) => setBanner(out.url)} /></L>
        {err && <p className="text-sm text-urgent">{err}</p>}
        <button disabled={create.isPending} className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{create.isPending ? "Publishing…" : "Publish event"}</button>
      </form>
      <style>{`.inp{margin-top:.375rem;width:100%;border-radius:.375rem;border:1px solid var(--border);background:var(--background);padding:.625rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:var(--primary)}`}</style>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-semibold">{label}</span>{children}</label>;
}
