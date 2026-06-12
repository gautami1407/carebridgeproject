import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HeartHandshake, Users, GraduationCap, Building2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useStore, type Role } from "@/lib/store";

export const Route = createFileRoute("/onboarding/role")({ component: RolePicker });

const roles: { id: Role; icon: typeof HeartHandshake; title: string; body: string }[] = [
  { id: "donor", icon: HeartHandshake, title: "Donor", body: "Fund specific needs and track impact." },
  { id: "volunteer", icon: Users, title: "Volunteer", body: "Give time at events and programs." },
  { id: "mentor", icon: GraduationCap, title: "Mentor", body: "Guide a child or young adult 1:1." },
  { id: "institution", icon: Building2, title: "Institution", body: "Register your home or orphanage." },
  { id: "admin", icon: ShieldCheck, title: "Admin", body: "Platform oversight & verification." },
];

function RolePicker() {
  const navigate = useNavigate();
  const setRole = useStore((s) => s.setRole);
  const [pick, setPick] = useState<Role>("donor");
  return (
    <div className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight">How do you want to help?</h1>
        <p className="mt-2 text-muted-foreground">You can switch later from your profile.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {roles.map((r) => {
            const active = pick === r.id;
            return (
              <button key={r.id} onClick={() => setPick(r.id)} className={`flex items-start gap-3 rounded-2xl border p-5 text-left ${active ? "border-primary bg-primary/5 shadow-lift" : "border-border bg-card hover:border-primary/50"}`}>
                <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}><r.icon className="size-5" /></span>
                <div><p className="font-bold">{r.title}</p><p className="mt-1 text-sm text-muted-foreground">{r.body}</p></div>
              </button>
            );
          })}
        </div>
        <button onClick={() => { setRole(pick); navigate({ to: "/onboarding/profile" }); }} className="mt-8 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground sm:w-auto sm:px-12">Continue</button>
      </div>
    </div>
  );
}
