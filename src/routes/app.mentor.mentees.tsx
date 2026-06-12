import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";

const mentees = [
  { name: "Arjun K.", age: 16, goal: "Engineering entrance", progress: 65 },
  { name: "Sneha M.", age: 17, goal: "College admissions", progress: 80 },
  { name: "Ravi P.", age: 19, goal: "First job", progress: 45 },
  { name: "Diya S.", age: 15, goal: "Math fundamentals", progress: 30 },
];

export const Route = createFileRoute("/app/mentor/mentees")({
  component: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="My mentees" />
      <div className="grid gap-4 sm:grid-cols-2">
        {mentees.map((m) => (
          <div key={m.name} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{m.name}</p>
                <p className="text-xs text-muted-foreground">Age {m.age}</p>
              </div>
              <span className="text-sm font-bold text-support">{m.progress}%</span>
            </div>
            <p className="mt-3 text-sm">{m.goal}</p>
            <div className="mt-3 h-2 rounded-full bg-surface-strong">
              <div className="h-full rounded-full bg-support" style={{ width: `${m.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});
