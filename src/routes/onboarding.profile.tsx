import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/onboarding/profile")({ component: ProfilePage });

function ProfilePage() {
  const navigate = useNavigate();
  const session = useStore((s) => s.session);
  const role = session?.role ?? "donor";
  return (
    <div className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Complete your profile</h1>
        <p className="mt-2 text-muted-foreground">A few details so we can personalize your experience.</p>
        <form onSubmit={(e) => { e.preventDefault(); navigate({ to: `/app/${role}` }); }} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <L label="Full name"><input className="inp" required /></L>
          <L label="City"><input className="inp" /></L>
          {role === "volunteer" && <L label="Skills (comma-separated)"><input className="inp" placeholder="Teaching, Healthcare, Tech" /></L>}
          {role === "mentor" && <L label="Areas of expertise"><input className="inp" placeholder="STEM, Career, Languages" /></L>}
          <L label="A short bio"><textarea rows={3} className="inp" /></L>
          <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Finish — go to dashboard</button>
        </form>
        <style>{`.inp{margin-top:.375rem;width:100%;border-radius:.375rem;border:1px solid var(--border);background:var(--background);padding:.625rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:var(--primary)}`}</style>
      </div>
    </div>
  );
}
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-semibold">{label}</span>{children}</label>;
}
