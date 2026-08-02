import { Link } from "@tanstack/react-router";
import { Activity, HeartHandshake, CalendarCheck, Sparkles, FileText, Users, Radio } from "lucide-react";
import { useLiveActivity, type LiveActivityItem } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";

function iconFor(kind: LiveActivityItem["kind"]) {
  switch (kind) {
    case "donation": return HeartHandshake;
    case "registration": return CalendarCheck;
    case "need_posted": return Sparkles;
    case "need_funded": return Activity;
    case "application": return Users;
    case "report": return FileText;
  }
}

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function LiveActivityFeed({ limit = 12, compact = false }: { limit?: number; compact?: boolean }) {
  const { data: items = [], isLoading } = useLiveActivity(limit);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="relative flex size-2.5" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-support opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-support" />
          </span>
          Live activity
        </h2>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <Radio className="size-3" aria-hidden /> Realtime
        </span>
      </div>

      {isLoading ? (
        <div className="mt-4"><LoadingState label="Listening for activity…" /></div>
      ) : items.length === 0 ? (
        <div className="mt-4"><EmptyState title="Nothing yet" body="Donations, registrations and need updates will stream here as they happen." /></div>
      ) : (
        <ol className="relative mt-4 ml-2 border-l-2 border-primary/15">
          {items.map((i) => {
            const Icon = iconFor(i.kind);
            const body = (
              <>
                <p className="text-sm font-semibold leading-tight">{i.title}</p>
                {i.subtitle && !compact && <p className="mt-0.5 text-xs text-muted-foreground">{i.subtitle}</p>}
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{timeAgo(i.at)}</p>
              </>
            );
            return (
              <li key={i.id} className="ml-5 pb-4 last:pb-0">
                <span className="absolute -left-[11px] grid size-5 place-items-center rounded-full border border-border bg-card text-primary" aria-hidden>
                  <Icon className="size-3" />
                </span>
                {i.href ? (
                  <Link to={i.href} className="block rounded-lg px-2 py-1 -mx-2 hover:bg-muted">{body}</Link>
                ) : (
                  <div className="px-2 py-1 -mx-2">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
