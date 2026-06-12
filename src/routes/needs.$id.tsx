import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, MapPin, Share2, Bookmark, Heart, Users, Clock } from "lucide-react";
import { StatusBadge } from "@/components/app/AppShell";

export const Route = createFileRoute("/needs/$id")({
  component: NeedPublic,
  notFoundComponent: () => (
    <SiteLayout><div className="p-12 text-center"><p>Need not found.</p><Link to="/explore" className="mt-4 inline-block text-primary">Browse all needs</Link></div></SiteLayout>
  ),
});

function NeedPublic() {
  const { id } = Route.useParams();
  const need = useStore((s) => s.needs.find((n) => n.id === id));
  const inst = useStore((s) => s.institutions.find((i) => i.id === need?.institutionId));
  const donate = useStore((s) => s.donate);
  const toggleSave = useStore((s) => s.toggleSaveNeed);
  const saved = useStore((s) => s.savedNeeds.includes(id));
  const [amount, setAmount] = useState(1000);
  const [done, setDone] = useState(false);
  if (!need || !inst) throw notFound();
  const pct = Math.round((need.fulfilled / need.goal) * 100);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link to="/explore" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All needs</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2"><StatusBadge status={need.priority} /><StatusBadge status={need.category} /></div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{need.title}</h1>
            <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{inst.name} • {inst.city}, {inst.state}</p>
            <img src={inst.image} alt={inst.name} className="mt-6 aspect-video w-full rounded-2xl object-cover" />

            <h2 className="mt-8 text-lg font-bold">Why this need matters</h2>
            <p className="mt-2 leading-relaxed text-foreground/80">{need.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4">
              <Stat icon={Users} label="Beneficiaries" value={need.beneficiaries} />
              <Stat icon={Clock} label="Deadline" value={need.deadline} />
              <Stat icon={Heart} label="Estimated" value={`₹${need.estimatedCost.toLocaleString()}`} />
              <Stat icon={Bookmark} label="Category" value={need.category} />
            </div>

            <h2 className="mt-8 text-lg font-bold">Updates</h2>
            <ol className="mt-4 space-y-4 border-l-2 border-primary/20 pl-5">
              {need.updates.map((u, i) => (
                <li key={i} className="relative"><span className="absolute -left-[26px] mt-1 grid size-3 place-items-center rounded-full bg-primary" /><p className="text-xs text-muted-foreground">{u.date}</p><p>{u.note}</p></li>
              ))}
            </ol>
          </div>

          <aside className="sticky top-20 h-fit space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-baseline justify-between"><span className="text-3xl font-bold">{pct}%</span><span className="text-sm text-muted-foreground">{need.fulfilled}/{need.goal} {need.unit}</span></div>
            <div className="h-3 rounded-full bg-surface-strong"><div className="h-full rounded-full bg-support" style={{ width: `${pct}%` }} /></div>
            {done ? (
              <p className="rounded-md bg-support/10 px-3 py-2 text-sm font-semibold text-support">Thank you! Your donation is being processed.</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">{[500, 1000, 5000].map((v) => (<button key={v} onClick={() => setAmount(v)} className={`rounded-md border px-3 py-2 text-sm font-semibold ${amount === v ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>₹{v}</button>))}</div>
                <input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <button onClick={() => { donate(need.id, amount); setDone(true); }} className="w-full rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:brightness-110">Donate ₹{amount.toLocaleString()}</button>
              </>
            )}
            <Link to="/volunteer" className="block w-full rounded-md border border-border px-4 py-2.5 text-center text-sm font-semibold hover:bg-muted">Volunteer instead</Link>
            <div className="flex gap-2">
              <button onClick={() => toggleSave(need.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"><Bookmark className={`size-3.5 ${saved ? "fill-primary text-primary" : ""}`} />{saved ? "Saved" : "Save"}</button>
              <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"><Share2 className="size-3.5" />Share</button>
            </div>
            <Link to="/institutions/$slug" params={{ slug: inst.slug }} className="block rounded-xl border border-border p-3 text-xs hover:bg-muted">
              <p className="font-semibold">{inst.name}</p>
              <p className="text-muted-foreground">View institution profile →</p>
            </Link>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return (
    <div>
      <Icon className="size-4 text-muted-foreground" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
