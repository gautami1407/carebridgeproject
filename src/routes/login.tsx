import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — CareBridge" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const signIn = useStore((s) => s.signIn);
  const [email, setEmail] = useState("");

  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
        <Link to="/" className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Heart className="size-5" strokeWidth={2.5} /></span><span className="text-base font-bold">CareBridge</span></Link>
        <h1 className="mt-8 text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue making impact.</p>
        <form onSubmit={(e) => { e.preventDefault(); signIn({ id: "u-1", name: email.split("@")[0] || "Friend", email, role: "donor" }); navigate({ to: "/app" }); }} className="mt-8 space-y-4">
          <label className="block"><span className="text-sm font-semibold">Email</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" /></label>
          <label className="block">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold">Password</span><Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot?</Link></div>
            <input type="password" required className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110">Sign in</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">New to CareBridge? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p>
      </div>
    </div>
  );
}
