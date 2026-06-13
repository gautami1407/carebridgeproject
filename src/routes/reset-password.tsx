import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — CareBridge" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/app" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Heart className="size-5" strokeWidth={2.5} /></span>
          <span className="text-base font-bold">CareBridge</span>
        </Link>
        <h1 className="mt-8 text-2xl font-bold tracking-tight">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick something memorable but strong.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">New password</span>
            <input type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Confirm password</span>
            <input type="password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
            {loading && <Loader2 className="size-4 animate-spin" />} Update password
          </button>
        </form>
      </div>
    </div>
  );
}
