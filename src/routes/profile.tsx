import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/app/AppShell";
import { BadgeCard, type BadgeCatalogItem } from "@/components/app/BadgeCard";
import { LoadingState } from "@/components/app/states";
import { useBadgeCatalog, useUserBadges, useMyDonations, useMyApplications } from "@/lib/queries";
import { useStore } from "@/lib/store";
import { Award, HeartHandshake, HandHeart, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/profile")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const session = useStore.getState().session;
    if (!session) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "My profile — CareBridge" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const session = useStore((s) => s.session);
  const { data: catalog = [], isLoading: catLoading } = useBadgeCatalog();
  const { data: mine = [], isLoading: mineLoading } = useUserBadges();
  const { data: donations = [] } = useMyDonations();
  const { data: applications = [] } = useMyApplications();

  const earnedIds = new Set(mine.map((m) => m.badge_id));
  const earnedById = new Map(mine.map((m) => [m.badge_id, m.earned_at]));

  const totalDonated = donations.reduce((s, d) => s + Number(d.amount), 0);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
            {session?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <PageHeader title={session?.name ?? "Your profile"} subtitle={session?.email} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatBox icon={Award} label="Badges earned" value={mine.length} />
          <StatBox icon={HeartHandshake} label="Total donated" value={`₹${totalDonated.toLocaleString()}`} />
          <StatBox icon={HandHeart} label="Applications" value={applications.length} />
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Achievements</h2>
            <Link to="/app" className="text-sm font-semibold text-primary hover:underline">Back to dashboard <ArrowRight className="ml-0.5 inline size-3.5" /></Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Earn badges by donating, volunteering, and creating impact on CareBridge.</p>

          {(catLoading || mineLoading) ? <div className="mt-8"><LoadingState /></div> : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(catalog as BadgeCatalogItem[]).map((b) => (
                <BadgeCard
                  key={b.id}
                  badge={b}
                  earned={earnedIds.has(b.id)}
                  earnedAt={earnedById.get(b.id) ?? null}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function StatBox({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" aria-hidden /></span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
