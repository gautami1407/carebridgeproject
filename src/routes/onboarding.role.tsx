import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HeartHandshake, Users, GraduationCap, Building2, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export const Route = createFileRoute("/onboarding/role")({ component: RolePicker });

const roles: { id: AppRole; icon: typeof HeartHandshake; title: string; body: string }[] = [
  { id: "donor", icon: HeartHandshake, title: "Donor", body: "Fund specific needs and track impact." },
  { id: "volunteer", icon: Users, title: "Volunteer", body: "Give time at events and programs." },
  { id: "mentor", icon: GraduationCap, title: "Mentor", body: "Guide a child or young adult 1:1." },
  { id: "institution_admin", icon: Building2, title: "Institution", body: "Register your home or orphanage." },
];

function RolePicker() {
  const navigate = useNavigate();
  const [pick, setPick] = useState<AppRole>("donor");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/login" });
        return;
      }
      // Add (idempotent) the chosen role
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: user.id, role: pick }, { onConflict: "user_id,role" });
      if (error) throw error;
      navigate({ to: "/onboarding/profile" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save role.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight">How do you want to help?</h1>
        <p className="mt-2 text-muted-foreground">You can request additional roles later.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {roles.map((r) => {
            const active = pick === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setPick(r.id)}
                className={`flex items-start gap-3 rounded-2xl border p-5 text-left ${active ? "border-primary bg-primary/5 shadow-lift" : "border-border bg-card hover:border-primary/50"}`}
                aria-pressed={active}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}><r.icon className="size-5" /></span>
                <div><p className="font-bold">{r.title}</p><p className="mt-1 text-sm text-muted-foreground">{r.body}</p></div>
              </button>
            );
          })}
        </div>
        {err && <p className="mt-4 text-sm text-urgent">{err}</p>}
        <button
          onClick={submit}
          disabled={busy}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-12 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Continue
        </button>
      </div>
    </div>
  );
}
