import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/volunteer/certificates")({
  component: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Certificates & badges" subtitle="Recognition for your contributions." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { t: "Education Champion", b: "20+ hrs teaching" },
          { t: "Healthcare Helper", b: "3 health camps" },
          { t: "Consistent Mentor", b: "6 months active" },
          { t: "Community Builder", b: "Joined 4 events" },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-support/10 text-support"><Award className="size-7" /></span>
            <p className="mt-3 font-bold">{c.t}</p>
            <p className="text-xs text-muted-foreground">{c.b}</p>
            <button className="mt-4 w-full rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">Download PDF</button>
          </div>
        ))}
      </div>
    </div>
  ),
});
