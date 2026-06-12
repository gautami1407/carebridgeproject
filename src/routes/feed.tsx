import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { Heart, Share2, Bookmark } from "lucide-react";

export const Route = createFileRoute("/feed")({
  head: () => ({ meta: [{ title: "Community Feed — CareBridge" }] }),
  component: FeedPage,
});

function FeedPage() {
  const feed = useStore((s) => s.feed);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Community feed</h1>
        <p className="mt-1 text-muted-foreground">Stories of impact, in real time.</p>
        <div className="mt-8 space-y-4">
          {feed.map((p) => (
            <article key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <header className="flex items-center justify-between">
                <div><p className="font-bold">{p.author}</p><p className="text-xs text-muted-foreground">{p.authorRole} • {p.date}</p></div>
              </header>
              <p className="mt-3 leading-relaxed">{p.body}</p>
              <footer className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <button className="inline-flex items-center gap-1 hover:text-foreground"><Heart className="size-4" />{p.likes}</button>
                <button className="inline-flex items-center gap-1 hover:text-foreground"><Share2 className="size-4" />Share</button>
                <button className="inline-flex items-center gap-1 hover:text-foreground"><Bookmark className="size-4" />Save</button>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
