import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { LoadingState, EmptyState, ErrorState } from "@/components/app/states";
import { useModerationQueue } from "@/lib/queries";

export const Route = createFileRoute("/app/admin/reports")({ component: ReportsPage });

type Tab = "posts" | "reports" | "needs";

function ReportsPage() {
  const [tab, setTab] = useState<Tab>("posts");
  const { data, isLoading, isError, error, refetch } = useModerationQueue();

  if (isLoading) return <LoadingState label="Loading moderation queue…" />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

  const posts = data?.posts ?? [];
  const reports = data?.reports ?? [];
  const needs = data?.needs ?? [];

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "posts", label: "Community posts", count: posts.length },
    { id: "reports", label: "Impact reports", count: reports.length },
    { id: "needs", label: "Needs", count: needs.length },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Content review" subtitle="Latest user-generated content across the platform, newest first." />

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
              tab === t.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {tab === "posts" &&
          (posts.length === 0 ? (
            <div className="p-6"><EmptyState title="No community posts" body="Stories shared by donors and institutions will appear here." /></div>
          ) : (
            <ul className="divide-y divide-border">
              {posts.map((p) => (
                <li key={p.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{p.institution?.name ?? "Community member"}</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.is_public ? "Public" : "Hidden"} />
                      <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-3 text-sm text-foreground/80">{p.body}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{p.kind}</p>
                </li>
              ))}
            </ul>
          ))}

        {tab === "reports" &&
          (reports.length === 0 ? (
            <div className="p-6"><EmptyState title="No impact reports" body="Published outcome reports from institutions will appear here." /></div>
          ) : (
            <ul className="divide-y divide-border">
              {reports.map((r) => (
                <li key={r.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link to="/impact-reports/$id" params={{ id: r.id }} className="text-sm font-semibold hover:text-primary">
                      {r.title}
                    </Link>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.is_published ? "Published" : "Draft"} />
                      <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.institution?.name ?? "Institution"}</p>
                  {r.summary && <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{r.summary}</p>}
                </li>
              ))}
            </ul>
          ))}

        {tab === "needs" &&
          (needs.length === 0 ? (
            <div className="p-6"><EmptyState title="No needs posted" body="Needs created by institutions will appear here for review." /></div>
          ) : (
            <ul className="divide-y divide-border">
              {needs.map((n) => (
                <li key={n.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link to="/needs/$id" params={{ id: n.id }} className="text-sm font-semibold hover:text-primary">
                      {n.title}
                    </Link>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={n.status} />
                      <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {n.institution?.name ?? "Institution"} · {n.urgency} urgency
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{n.description}</p>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
}
