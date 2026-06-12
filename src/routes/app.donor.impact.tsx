import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/donor/impact")({
  component: Impact,
});

function Impact() {
  const donations = useStore((s) => s.donations);
  const needs = useStore((s) => s.needs);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Your impact timeline" subtitle="Every milestone your support unlocked." />
      <ol className="relative ml-3 border-l-2 border-primary/20">
        {donations.map((d) => {
          const need = needs.find((n) => n.id === d.needId);
          return (
            <li key={d.id} className="ml-6 pb-8">
              <span className="absolute -left-2 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d.date}</p>
              <p className="mt-1 font-bold">₹{d.amount.toLocaleString()} → {need?.title ?? "—"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{need?.description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
