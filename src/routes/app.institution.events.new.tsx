import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppShell";
import { useStore, type EventType } from "@/lib/store";

const types: EventType[] = ["Health Camp", "Education", "Birthday", "Festival", "Volunteer Drive", "Fundraiser"];

export const Route = createFileRoute("/app/institution/events/new")({
  component: NewEvent,
});

function NewEvent() {
  const navigate = useNavigate();
  const createEvent = useStore((s) => s.createEvent);
  const instId = useStore((s) => s.session?.institutionId ?? "inst-1");
  const [form, setForm] = useState({ title: "", type: "Education" as EventType, description: "", date: "", time: "", capacity: 20, location: "" });
  const set = (k: keyof typeof form, v: string | number) => setForm({ ...form, [k]: v });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create event" />
      <form onSubmit={(e) => { e.preventDefault(); createEvent({ ...form, institutionId: instId }); navigate({ to: "/app/institution/events" }); }} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <L label="Title"><input required value={form.title} onChange={(e) => set("title", e.target.value)} className="inp" /></L>
        <div className="grid gap-5 sm:grid-cols-2">
          <L label="Type"><select value={form.type} onChange={(e) => set("type", e.target.value)} className="inp">{types.map((t) => <option key={t}>{t}</option>)}</select></L>
          <L label="Capacity"><input type="number" min={1} value={form.capacity} onChange={(e) => set("capacity", +e.target.value)} className="inp" /></L>
        </div>
        <L label="Description"><textarea rows={3} required value={form.description} onChange={(e) => set("description", e.target.value)} className="inp" /></L>
        <div className="grid gap-5 sm:grid-cols-2">
          <L label="Date"><input type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} className="inp" /></L>
          <L label="Time"><input value={form.time} onChange={(e) => set("time", e.target.value)} className="inp" placeholder="10:00 AM" /></L>
        </div>
        <L label="Location"><input required value={form.location} onChange={(e) => set("location", e.target.value)} className="inp" /></L>
        <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Publish event</button>
      </form>
      <style>{`.inp{margin-top:.375rem;width:100%;border-radius:.375rem;border:1px solid var(--border);background:var(--background);padding:.625rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:var(--primary)}`}</style>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-semibold">{label}</span>{children}</label>;
}
