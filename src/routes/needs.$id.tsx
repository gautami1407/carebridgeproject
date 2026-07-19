import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useNeed, useDonate, useToggleSaved, useSavedItems } from "@/lib/queries";
import { ArrowLeft, MapPin, Share2, Bookmark, Heart, Users, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/app/AppShell";
import { LoadingState, ErrorState } from "@/components/app/states";
import { cap, deadlineLabel } from "@/lib/db-mappers";
import { useStore } from "@/lib/store";
import { priorityScore } from "@/lib/scoring";
import { PriorityBadge } from "@/components/app/PriorityBadge";
import { ImpactCalculator } from "@/components/app/ImpactCalculator";
import { impactStatement, suggestedAmounts } from "@/lib/impact";

export const Route = createFileRoute("/needs/$id")({
  component: NeedPublic,
  notFoundComponent: () => (
    <SiteLayout><div className="p-12 text-center"><p>Need not found.</p><Link to="/explore" className="mt-4 inline-block text-primary">Browse all needs</Link></div></SiteLayout>
  ),
});

function NeedPublic() {
  const { id } = Route.useParams();
  const { data: need, isLoading, isError, error, refetch } = useNeed(id);
  const session = useStore((s) => s.session);
  const donate = useDonate();
  const toggleSaved = useToggleSaved();
  const { data: saved = [] } = useSavedItems();
  const isSaved = saved.some((s) => s.entity_id === id && s.entity_type === "need");
  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [done, setDone] = useState(false);

  if (isLoading) return <SiteLayout><div className="p-12"><LoadingState /></div></SiteLayout>;
  if (isError) return <SiteLayout><div className="p-12"><ErrorState error={error} onRetry={() => refetch()} /></div></SiteLayout>;
  if (!need) throw notFound();
  const inst = need.institution;
  const raised = Number(need.raised_amount ?? 0);
  const goal = Math.max(1, Number(need.goal_amount ?? 1));
  const pct = Math.min(100, Math.round((raised / goal) * 100));

  async function handleDonate() {
    if (!session) { window.location.href = "/login?next=" + encodeURIComponent(`/needs/${id}`); return; }
    if (amount < 1) { toast.error("Enter an amount"); return; }
    try {
      await donate.mutateAsync({ needId: id, amount, message: message.trim() || undefined, anonymous });
      setDone(true);
      toast.success(`Thank you! ₹${amount.toLocaleString()} donated`, {
        description: impactStatement(amount, need!.category),
      });
    } catch (e) {
      toast.error("Donation failed", { description: e instanceof Error ? e.message : "Please try again." });
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link to="/explore" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All needs</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2"><PriorityBadge tier={priorityScore(need).tier} score={priorityScore(need).score} /><StatusBadge status={cap(need.urgency)} /><StatusBadge status={cap(need.category)} /></div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{need.title}</h1>
            {inst && (
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{inst.name} • {[inst.city, inst.state].filter(Boolean).join(", ")}</p>
            )}
            {(need.cover_image || inst?.cover_image) && (
              <img src={need.cover_image || inst?.cover_image || ""} alt={need.title} className="mt-6 aspect-video w-full rounded-2xl object-cover" />
            )}

            <h2 className="mt-8 text-lg font-bold">Why this need matters</h2>
            <p className="mt-2 leading-relaxed text-foreground/80">{need.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4">
              <Stat icon={Users} label="Beneficiaries" value={need.beneficiaries ?? "—"} />
              <Stat icon={Clock} label="Deadline" value={deadlineLabel(need.deadline, need.status)} />
              <Stat icon={Heart} label="Goal" value={`₹${goal.toLocaleString()}`} />
              <Stat icon={Bookmark} label="Category" value={cap(need.category)} />
            </div>
          </div>

          <aside className="sticky top-20 h-fit space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-baseline justify-between"><span className="text-3xl font-bold">{pct}%</span><span className="text-sm text-muted-foreground">₹{raised.toLocaleString()} / ₹{goal.toLocaleString()}</span></div>
            <div className="h-3 rounded-full bg-surface-strong"><div className="h-full rounded-full bg-support" style={{ width: `${pct}%` }} /></div>
            {done ? (
              <div className="space-y-2 rounded-md bg-support/10 p-4 text-sm text-support">
                <p className="flex items-center gap-1.5 font-bold"><CheckCircle2 className="size-4" /> Donation confirmed</p>
                <p className="text-xs opacity-90">{impactStatement(amount, need.category)}</p>
                <Link to="/app/donor/donations" className="mt-2 inline-block rounded-md bg-support px-3 py-1.5 text-xs font-bold text-white hover:brightness-110">
                  View certificate →
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2">{suggestedAmounts(need.category).map((v) => (<button key={v} onClick={() => setAmount(v)} className={`rounded-md border px-2 py-2 text-xs font-semibold ${amount === v ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>₹{v >= 1000 ? `${v / 1000}k` : v}</button>))}</div>
                <label className="sr-only" htmlFor="custom-amount">Custom amount</label>
                <input id="custom-amount" type="number" min={1} value={amount} onChange={(e) => setAmount(+e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 280))}
                  placeholder="Add a message of support (optional)"
                  rows={2}
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="size-3.5 rounded border-border" />
                  Donate anonymously
                </label>
                <ImpactCalculator amount={amount} category={need.category} />
                <button
                  onClick={handleDonate}
                  disabled={donate.isPending || amount < 1}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:brightness-110 disabled:opacity-60"
                >
                  {donate.isPending && <Loader2 className="size-4 animate-spin" />}
                  Donate ₹{amount.toLocaleString()}
                </button>
              </>
            )}
            <Link to="/volunteer" className="block w-full rounded-md border border-border px-4 py-2.5 text-center text-sm font-semibold hover:bg-muted">Volunteer instead</Link>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!session) { window.location.href = "/login"; return; }
                  toggleSaved.mutate(
                    { entityId: id, entityType: "need" },
                    { onSuccess: (r) => toast.success(r.saved ? "Saved to your list" : "Removed from saved") },
                  );
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                aria-pressed={isSaved}
              >
                <Bookmark className={`size-3.5 ${isSaved ? "fill-primary text-primary" : ""}`} />{isSaved ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
              ><Share2 className="size-3.5" />Share</button>
            </div>
            {inst && (
              <Link to="/institutions/$slug" params={{ slug: inst.slug }} className="block rounded-xl border border-border p-3 text-xs hover:bg-muted">
                <p className="font-semibold">{inst.name}</p>
                <p className="text-muted-foreground">View institution profile →</p>
              </Link>
            )}
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return (
    <div>
      <Icon className="size-4 text-muted-foreground" aria-hidden />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
