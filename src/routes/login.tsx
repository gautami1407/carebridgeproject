import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — CareBridge" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    navigate({ to: "/app" });
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Heart className="size-5" strokeWidth={2.5} /></span>
          <span className="text-base font-bold">CareBridge</span>
        </Link>
        <h1 className="mt-8 text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue making impact.</p>

        <button onClick={onGoogle} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
          <svg viewBox="0 0 24 24" className="size-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.99 10.99 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Password</span>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot?</Link>
            </div>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
            {loading && <Loader2 className="size-4 animate-spin" />} Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">New to CareBridge? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p>
      </div>
    </div>
  );
}
