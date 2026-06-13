import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, HeartHandshake, Users, Building2, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Join CareBridge" },
      { name: "description", content: "Create an account as a donor, volunteer, or institution." },
    ],
  }),
  component: RegisterPage,
});

// Roles selectable at signup. Admin is created server-side only.
const roles = [
  { id: "donor", dbRole: "donor", icon: HeartHandshake, title: "Donor", body: "Support specific needs with funds." },
  { id: "volunteer", dbRole: "volunteer", icon: Users, title: "Volunteer", body: "Give your time and skills." },
  { id: "mentor", dbRole: "mentor", icon: ShieldCheck, title: "Mentor", body: "Guide a child or young adult." },
  { id: "institution", dbRole: "institution_admin", icon: Building2, title: "Institution", body: "Register your home or orphanage." },
] as const;

function RegisterPage() {
  const [role, setRole] = useState<(typeof roles)[number]["id"]>("donor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const dbRole = roles.find((r) => r.id === role)!.dbRole;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/app",
        data: { full_name: name, requested_role: dbRole },
      },
    });
    if (error) { setLoading(false); toast.error(error.message); return; }

    // If signed in immediately (auto-confirm), upsert the requested role.
    if (data.user && data.session && dbRole !== "donor") {
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: dbRole as any }).then(() => {});
    }
    setLoading(false);
    toast.success("Account created");
    navigate({ to: data.session ? "/app" : "/verify-email" });
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Heart className="size-5" strokeWidth={2.5} /></span>
          <span className="text-base font-bold tracking-tight">CareBridge</span>
        </Link>

        <h1 className="mt-8 text-3xl font-bold tracking-tight">Join CareBridge</h1>
        <p className="mt-1 text-muted-foreground">Pick the role that fits how you want to help.</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {roles.map((r) => {
            const active = r.id === role;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                  active ? "border-primary bg-primary/5 shadow-lift" : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                  <r.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold">{r.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <button type="button" onClick={onGoogle} className="mb-5 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
            <svg viewBox="0 0 24 24" className="size-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.99 10.99 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </button>
          <div className="mb-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">{role === "institution" ? "Institution name" : "Full name"}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
          </div>
          <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
            {loading && <Loader2 className="size-4 animate-spin" />} Create account
          </button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
