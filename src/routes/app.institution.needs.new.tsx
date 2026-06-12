import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppShell";
import { useStore, type NeedCategory, type Priority } from "@/lib/store";

export const Route = createFileRoute("/app/institution/needs/new")({
  component: NewNeed,
});

const categories: NeedCategory[] = ["Food", "Education", "Medical", "Clothing", "Infrastructure", "Technology", "Emergency"];
const priorities: Priority[] = ["Critical", "High", "Medium", "Low"];

function NewNeed() {
  const navigate = useNavigate();
  const createNeed = useStore((s) => s.createNeed);
  const instId = useStore((s) => s.session?.institutionId ?? "inst-1");
  const [form, setForm] = useState({
    title: "", category: "Education" as NeedCategory, description: "",
    unit: "items", goal: 10, estimatedCost: 10000, priority: "Medium" as Priority,
    deadline: "14 days left", beneficiaries: 10,
  });
  const set = (k: keyof typeof form, v: string | number) => setForm({ ...form, [k]: v });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create a new need" subtitle="Be specific. Donors give more when impact is clear." />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const id = createNeed({ ...form, institutionId: instId });
          navigate({ to: "/app/institution/needs/$id", params: { id } });
        }}
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <Field label="Title"><input required value={form.title} onChange={(e) => set("title", e.target.value)} className="input" /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className="input">
              {priorities.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Description"><textarea rows={4} required value={form.description} onChange={(e) => set("description", e.target.value)} className="input" /></Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Quantity"><input type="number" min={1} value={form.goal} onChange={(e) => set("goal", +e.target.value)} className="input" /></Field>
          <Field label="Unit"><input value={form.unit} onChange={(e) => set("unit", e.target.value)} className="input" /></Field>
          <Field label="Beneficiaries"><input type="number" min={1} value={form.beneficiaries} onChange={(e) => set("beneficiaries", +e.target.value)} className="input" /></Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Estimated cost (₹)"><input type="number" min={0} value={form.estimatedCost} onChange={(e) => set("estimatedCost", +e.target.value)} className="input" /></Field>
          <Field label="Deadline"><input value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className="input" placeholder="e.g. 14 days left" /></Field>
        </div>
        <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110">Publish need</button>
      </form>
      <style>{`.input{margin-top:.375rem;width:100%;border-radius:.375rem;border:1px solid var(--border);background:var(--background);padding:.625rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-semibold">{label}</span>{children}</label>;
}
