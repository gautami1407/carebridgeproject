import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/institution/profile")({
  component: () => {
    const instId = useStore((s) => s.session?.institutionId ?? "inst-1");
    const i = useStore((s) => s.institutions.find((x) => x.id === instId))!;
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Institution profile" subtitle="Keep your public profile accurate and inspiring." />
        <form className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
          {[
            ["Institution name", i.name], ["Type", i.type], ["Registration #", i.regNumber],
            ["Contact person", i.contact], ["Email", i.email], ["Phone", i.phone],
            ["City", i.city], ["State", i.state], ["Address", i.address],
          ].map(([l, v]) => (
            <label key={l} className="block"><span className="text-sm font-semibold">{l}</span>
              <input defaultValue={v} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" /></label>
          ))}
          <label className="block"><span className="text-sm font-semibold">Description</span>
            <textarea defaultValue={i.description} rows={4} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" /></label>
          <button type="button" className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Save changes</button>
        </form>
      </div>
    );
  },
});
