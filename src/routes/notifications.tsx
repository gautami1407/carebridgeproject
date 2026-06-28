import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/lib/queries";
import { Bell } from "lucide-react";
import { LoadingState, ErrorState, EmptyState } from "@/components/app/states";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data: notifications = [], isLoading, isError, error, refetch } = useNotifications();
  const mark = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const unread = notifications.filter((n) => !n.read_at).length;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          {unread > 0 && (
            <button onClick={() => markAll.mutate()} className="text-xs font-semibold text-primary hover:underline">Mark all read</button>
          )}
        </div>
        <div className="mt-8 space-y-3">
          {isLoading ? <LoadingState /> :
            isError ? <ErrorState error={error} onRetry={() => refetch()} /> :
            notifications.length === 0 ? <EmptyState title="You're all caught up" body="When something happens that needs your attention, it'll show up here." /> :
            notifications.map((n) => (
              <div key={n.id} className={`rounded-xl border border-border p-4 shadow-soft ${n.read_at ? "bg-card" : "bg-primary/5"}`}>
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary" aria-hidden><Bell className="size-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{n.title}</p>
                    {n.body && <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  {!n.read_at && <button onClick={() => mark.mutate(n.id)} className="text-xs font-semibold text-primary hover:underline">Mark read</button>}
                </div>
                {n.link && <Link to={n.link} className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">View →</Link>}
              </div>
            ))}
        </div>
      </section>
    </SiteLayout>
  );
}
