import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — CareBridge" },
      { name: "description", content: "Sign in to your CareBridge account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="size-5" strokeWidth={2.5} />
          </span>
          <span className="text-base font-bold tracking-tight">CareBridge</span>
        </Link>
        <h1 className="mt-8 text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue making impact.</p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input type="email" className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input type="password" className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to CareBridge?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
