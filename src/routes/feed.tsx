import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useFeed, useCreateFeedPost } from "@/lib/queries";
import { useStore } from "@/lib/store";
import { Heart, Share2, Bookmark, Loader2 } from "lucide-react";
import { LoadingState, ErrorState, EmptyState } from "@/components/app/states";
import { useState } from "react";

export const Route = createFileRoute("/feed")({
  head: () => ({ meta: [{ title: "Community Feed — CareBridge" }] }),
  component: FeedPage,
});

function FeedPage() {
  const { data: feed = [], isLoading, isError, error, refetch } = useFeed();
  const create = useCreateFeedPost();
  const session = useStore((s) => s.session);
  const [body, setBody] = useState("");

  async function post() {
    if (!body.trim()) return;
    await create.mutateAsync(body.trim());
    setBody("");
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Community feed</h1>
        <p className="mt-1 text-muted-foreground">Stories of impact, in real time.</p>

        {session ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <label className="sr-only" htmlFor="post-body">Write a post</label>
            <textarea id="post-body" rows={2} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share an update or thank-you…" className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm" />
            <div className="mt-2 flex justify-end">
              <button onClick={post} disabled={!body.trim() || create.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {create.isPending && <Loader2 className="size-3.5 animate-spin" />}
                Post
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="mt-6 block rounded-2xl border border-dashed border-border bg-card p-4 text-center text-sm font-semibold text-primary hover:bg-muted">Sign in to share your story →</Link>
        )}

        <div className="mt-8 space-y-4">
          {isLoading ? <LoadingState /> :
            isError ? <ErrorState error={error} onRetry={() => refetch()} /> :
            feed.length === 0 ? <EmptyState title="No posts yet" body="Be the first to share an update." /> :
            feed.map((p) => {
              const inst = p.institution as { name: string; slug: string } | null;
              const author = (p as unknown as { author?: { full_name?: string | null } | null }).author;
              return (
                <article key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <header className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{inst?.name ?? author?.full_name ?? "Member"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</p>
                    </div>
                  </header>
                  <p className="mt-3 whitespace-pre-line leading-relaxed">{p.body}</p>
                  <footer className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="inline-flex items-center gap-1 hover:text-foreground" aria-label="Like"><Heart className="size-4" /></button>
                    <button className="inline-flex items-center gap-1 hover:text-foreground" aria-label="Share"><Share2 className="size-4" />Share</button>
                    <button className="inline-flex items-center gap-1 hover:text-foreground" aria-label="Save"><Bookmark className="size-4" />Save</button>
                  </footer>
                </article>
              );
            })}
        </div>
      </section>
    </SiteLayout>
  );
}
