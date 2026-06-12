import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/volunteer/completed")({
  component: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Completed activities" />
      <div className="space-y-3">
        {[
          { t: "Reading session — Sunshine", d: "May 24, 2026", h: "3 hrs" },
          { t: "Health camp support — Silver Oaks", d: "May 11, 2026", h: "5 hrs" },
          { t: "Coding workshop — Hope Foundation", d: "Apr 28, 2026", h: "4 hrs" },
        ].map((a) => (
          <div key={a.t} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-soft">
            <div>
              <p className="font-semibold">{a.t}</p>
              <p className="text-xs text-muted-foreground">{a.d}</p>
            </div>
            <span className="text-sm font-bold text-support">{a.h}</span>
          </div>
        ))}
      </div>
    </div>
  ),
});
