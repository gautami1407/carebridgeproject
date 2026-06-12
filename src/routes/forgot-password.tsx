import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [sent, setSent] = useState(false);
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
        <Link to="/" className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Heart className="size-5" strokeWidth={2.5} /></span><span className="text-base font-bold">CareBridge</span></Link>
        <h1 className="mt-8 text-2xl font-bold tracking-tight">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">We'll email you a secure link.</p>
        {sent ? (
          <p className="mt-6 rounded-md bg-support/10 px-4 py-3 text-sm font-semibold text-support">Check your inbox — link sent.</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-8 space-y-4">
            <label className="block"><span className="text-sm font-semibold">Email</span><input type="email" required className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm" /></label>
            <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Send reset link</button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground"><Link to="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link></p>
      </div>
    </div>
  );
}
