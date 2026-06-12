import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/verify-email")({
  component: () => (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lift">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary"><MailCheck className="size-7" /></span>
        <h1 className="mt-4 text-2xl font-bold">Verify your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">We sent a link to your inbox. Click it to verify your address.</p>
        <Link to="/onboarding/role" className="mt-6 inline-block w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">I've verified — continue</Link>
        <button className="mt-3 w-full text-xs font-semibold text-muted-foreground hover:underline">Resend email</button>
      </div>
    </div>
  ),
});
