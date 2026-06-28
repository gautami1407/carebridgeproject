import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppShell";
import { FileUpload } from "@/components/app/FileUpload";
import { useCreateNeed, useMyInstitution } from "@/lib/queries";
import type { Database } from "@/integrations/supabase/types";
import { LoadingState, EmptyState } from "@/components/app/states";

type Category = Database["public"]["Enums"]["need_category"];
type Urgency = Database["public"]["Enums"]["need_urgency"];

const categories: Category[] = ["food", "education", "medical", "shelter", "clothing", "other"];
const urgencies: Urgency[] = ["critical", "high", "medium", "low"];

export const Route = createFileRoute("/app/institution/needs/new")({ component: NewNeed });

function NewNeed() {
  const navigate = useNavigate();
  const { data: inst, isLoading: instLoading } = useMyInstitution();
  const createNeed = useCreateNeed();
  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "education" as Category,
    description: "",
    goal_amount: 10000,
    beneficiaries: 10,
    urgency: "medium" as Urgency,
    deadline: "",
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });

  if (instLoading) return <LoadingState />;
  if (!inst) return <EmptyState title="No institution linked" body="You need to be linked to an institution to post needs. Contact a platform admin." />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create a new need" subtitle="Be specific. Donors give more when impact is clear." />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          try {
            const need = await createNeed.mutateAsync({
              title: form.title,
              category: form.category,
              description: form.description,
              goal_amount: form.goal_amount,
              urgency: form.urgency,
              beneficiaries: form.beneficiaries,
              deadline: form.deadline || null,
              institution_id: inst.id,
              cover_image: coverPath,
              status: "active",
            });
            navigate({ to: "/app/institution/needs/$id", params: { id: need.id } });
          } catch (ex) {
            setErr(ex instanceof Error ? ex.message : "Failed to create need");
          }
        }}
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <Field label="Title"><input required value={form.title} onChange={(e) => set("title", e.target.value)} className="input" /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value as Category)} className="input capitalize">
              {categories.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </Field>
          <Field label="Urgency">
            <select value={form.urgency} onChange={(e) => set("urgency", e.target.value as Urgency)} className="input capitalize">
              {urgencies.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Description"><textarea rows={4} required value={form.description} onChange={(e) => set("description", e.target.value)} className="input" /></Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Goal (₹)"><input type="number" min={1} required value={form.goal_amount} onChange={(e) => set("goal_amount", +e.target.value)} className="input" /></Field>
          <Field label="Beneficiaries"><input type="number" min={1} value={form.beneficiaries} onChange={(e) => set("beneficiaries", +e.target.value)} className="input" /></Field>
          <Field label="Deadline"><input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className="input" /></Field>
        </div>
        <Field label="Cover image (optional)">
          <FileUpload bucket="public-media" prefix="needs" accept="image/*" onUploaded={(out) => setCoverPath(out.url)} label="Upload cover image" />
        </Field>
        {err && <p className="text-sm text-urgent">{err}</p>}
        <button disabled={createNeed.isPending} className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
          {createNeed.isPending ? "Publishing…" : "Publish need"}
        </button>
      </form>
      <style>{`.input{margin-top:.375rem;width:100%;border-radius:.375rem;border:1px solid var(--border);background:var(--background);padding:.625rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-semibold">{label}</span>{children}</label>;
}
