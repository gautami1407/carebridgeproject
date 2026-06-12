import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, HeartHandshake, Users, Building2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useStore, type Role } from "@/lib/store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Join CareBridge" },
      { name: "description", content: "Create an account as a donor, volunteer, or institution." },
    ],
  }),
  component: RegisterPage,
});

const roles = [
  { id: "donor", icon: HeartHandshake, title: "Donor", body: "Support specific needs with funds or items." },
  { id: "volunteer", icon: Users, title: "Volunteer", body: "Give your time, skills, and mentorship." },
  { id: "institution", icon: Building2, title: "Institution", body: "Register your home or orphanage." },
  { id: "admin", icon: ShieldCheck, title: "Admin", body: "Platform-wide verification and oversight." },
] as const;

function RegisterPage() {
  const [role, setRole] = useState<(typeof roles)[number]["id"]>("donor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const signIn = useStore((s) => s.signIn);

  return (
    <div className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="size-5" strokeWidth={2.5} />
          </span>
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
                onClick={() => setRole(r.id)}
                className={`group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/5 shadow-lift"
                    : "border-border bg-card hover:border-primary/50"
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

        <form
          onSubmit={(e) => { e.preventDefault(); signIn({ id: "u-1", name: name || "Friend", email, role: role as Role, institutionId: role === "institution" ? "inst-1" : undefined }); navigate({ to: "/verify-email" }); }}
          className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">{role === "institution" ? "Institution name" : "Full name"}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Phone</span>
              <input className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input type="password" required className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
          </div>
          <button className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110">
            Create account
          </button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
