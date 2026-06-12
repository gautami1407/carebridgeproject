import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const notifications = useStore((s) => s.notifications);
  const mark = useStore((s) => s.markNotificationRead);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <ul className="mt-8 space-y-3">
          {notifications.map((n) => (
            <li key={n.id} className={`rounded-xl border border-border p-4 shadow-soft ${n.read ? "bg-card" : "bg-primary/5"}`}>
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Bell className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{n.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.date}</p>
                </div>
                {!n.read && <button onClick={() => mark(n.id)} className="text-xs font-semibold text-primary hover:underline">Mark read</button>}
              </div>
              {n.href && <Link to={n.href} className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">View →</Link>}
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
