import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { FileUpload } from "@/components/app/FileUpload";
import { useMyInstitution, useUpdateInstitution } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type Itype = Database["public"]["Enums"]["institution_type"];
const types: Itype[] = ["orphanage", "old_age_home", "shelter", "other"];

export const Route = createFileRoute("/app/institution/profile")({
  component: () => {
    const { data: inst, isLoading } = useMyInstitution();
    const update = useUpdateInstitution();
    const [form, setForm] = useState({
      name: "", description: "", mission: "", type: "orphanage" as Itype,
      city: "", state: "", country: "", residents_count: 0, cover_image: "",
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
      if (!inst) return;
      setForm({
        name: inst.name ?? "",
        description: inst.description ?? "",
        mission: inst.mission ?? "",
        type: inst.type,
        city: inst.city ?? "",
        state: inst.state ?? "",
        country: inst.country ?? "",
        residents_count: inst.residents_count ?? 0,
        cover_image: inst.cover_image ?? "",
      });
    }, [inst]);

    if (isLoading) return <LoadingState />;
    if (!inst) return <EmptyState title="No institution linked" body="Contact a platform admin to link your institution." />;

    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Institution profile" subtitle="Keep your public profile accurate and inspiring." />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSaved(false);
            await update.mutateAsync({ id: inst.id, patch: form });
            setSaved(true);
          }}
          className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          {(["name", "city", "state", "country"] as const).map((k) => (
            <label key={k} className="block">
              <span className="text-sm font-semibold capitalize">{k}</span>
              <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
            </label>
          ))}
          <label className="block">
            <span className="text-sm font-semibold">Type</span>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Itype })} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm capitalize">
              {types.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Residents count</span>
            <input type="number" min={0} value={form.residents_count} onChange={(e) => setForm({ ...form, residents_count: +e.target.value })} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Description</span>
            <textarea value={form.description} rows={4} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Mission</span>
            <textarea value={form.mission} rows={3} onChange={(e) => setForm({ ...form, mission: e.target.value })} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
          </label>
          <div>
            <span className="text-sm font-semibold">Cover image</span>
            {form.cover_image && <img src={form.cover_image} alt="Cover" className="mt-2 h-32 w-full rounded-md object-cover" />}
            <div className="mt-2"><FileUpload bucket="public-media" prefix="institutions" onUploaded={(out) => setForm({ ...form, cover_image: out.url })} /></div>
          </div>
          <button disabled={update.isPending} className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {update.isPending ? "Saving…" : "Save changes"}
          </button>
          {saved && <p className="text-center text-sm font-semibold text-support">Saved.</p>}
        </form>
      </div>
    );
  },
});
