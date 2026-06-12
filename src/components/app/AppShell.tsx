import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Heart, LayoutDashboard, HeartHandshake, Bookmark, Users, Calendar,
  Building2, ListChecks, BarChart3, Bell, ShieldCheck, GraduationCap,
  Newspaper, FileCheck2, Activity, Award, MessagesSquare, Settings, LogOut, ChevronDown,
} from "lucide-react";
import { useStore, type Role } from "@/lib/store";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

const navByRole: Record<Role, { group: string; items: NavItem[] }[]> = {
  donor: [
    { group: "Donor", items: [
      { to: "/app/donor", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/donor/donations", label: "Donations", icon: HeartHandshake },
      { to: "/app/donor/saved", label: "Saved Needs", icon: Bookmark },
      { to: "/app/donor/following", label: "Following", icon: Users },
      { to: "/app/donor/impact", label: "Impact", icon: Activity },
    ]},
  ],
  volunteer: [
    { group: "Volunteer", items: [
      { to: "/app/volunteer", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/volunteer/applications", label: "Applications", icon: FileCheck2 },
      { to: "/app/volunteer/upcoming", label: "Upcoming", icon: Calendar },
      { to: "/app/volunteer/completed", label: "Completed", icon: ListChecks },
      { to: "/app/volunteer/certificates", label: "Certificates", icon: Award },
    ]},
  ],
  mentor: [
    { group: "Mentor", items: [
      { to: "/app/mentor", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/mentor/sessions", label: "Sessions", icon: Calendar },
      { to: "/app/mentor/mentees", label: "Mentees", icon: GraduationCap },
    ]},
  ],
  institution: [
    { group: "Institution", items: [
      { to: "/app/institution", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/institution/needs", label: "Needs", icon: ListChecks },
      { to: "/app/institution/events", label: "Events", icon: Calendar },
      { to: "/app/institution/donations", label: "Donations", icon: HeartHandshake },
      { to: "/app/institution/volunteers", label: "Volunteers", icon: Users },
      { to: "/app/institution/impact-reports", label: "Impact Reports", icon: Activity },
      { to: "/app/institution/profile", label: "Profile", icon: Building2 },
    ]},
  ],
  admin: [
    { group: "Admin", items: [
      { to: "/app/admin", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/admin/institutions", label: "Institution Verification", icon: ShieldCheck },
      { to: "/app/admin/users", label: "Users", icon: Users },
      { to: "/app/admin/needs", label: "Need Moderation", icon: ListChecks },
      { to: "/app/admin/reports", label: "Reports", icon: Newspaper },
      { to: "/app/admin/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/app/admin/audit", label: "Audit Logs", icon: MessagesSquare },
    ]},
  ],
};

const roleLabels: Record<Role, string> = {
  donor: "Donor", volunteer: "Volunteer", mentor: "Mentor",
  institution: "Institution Admin", admin: "Platform Admin",
};

export function AppShell({ children }: { children: ReactNode }) {
  const session = useStore((s) => s.session);
  const setRole = useStore((s) => s.setRole);
  const signOut = useStore((s) => s.signOut);
  const notifications = useStore((s) => s.notifications);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  // Auto-create demo session if none
  useEffect(() => {
    if (!session) setRole("donor");
  }, [session, setRole]);

  const role = session?.role ?? "donor";
  const groups = navByRole[role];
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : ""}`}>
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="size-4" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-bold tracking-tight">CareBridge</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {groups.map((g) => (
            <div key={g.group}>
              <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{g.group}</p>
              {g.items.map((it) => {
                const active = pathname === it.to;
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    <it.icon className="size-4" />
                    {it.label}
                  </Link>
                );
              })}
            </div>
          ))}
          <div className="mt-4 border-t border-border pt-3">
            <Link to="/feed" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted">
              <Newspaper className="size-4" /> Community Feed
            </Link>
            <Link to="/notifications" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted">
              <Bell className="size-4" /> Notifications
            </Link>
            <button onClick={() => { signOut(); navigate({ to: "/" }); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setMobileOpen((v) => !v)} className="grid size-9 place-items-center rounded-md border border-border lg:hidden">
            <Settings className="size-4" />
          </button>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Welcome back, <span className="font-semibold text-foreground">{session?.name ?? "Friend"}</span>
          </p>

          <div className="flex items-center gap-2">
            {/* Bell */}
            <div className="relative">
              <button onClick={() => setBellOpen((v) => !v)} className="relative grid size-9 place-items-center rounded-md border border-border hover:bg-muted">
                <Bell className="size-4" />
                {unread > 0 && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-urgent text-[10px] font-bold text-urgent-foreground">{unread}</span>}
              </button>
              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lift">
                  <div className="border-b border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Notifications</div>
                  <ul className="max-h-80 overflow-auto">
                    {notifications.slice(0, 5).map((n) => (
                      <li key={n.id} className="border-b border-border px-4 py-3 text-sm last:border-0">
                        <p className="font-semibold">{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                      </li>
                    ))}
                  </ul>
                  <Link to="/notifications" onClick={() => setBellOpen(false)} className="block border-t border-border px-4 py-2 text-center text-xs font-semibold text-primary hover:bg-muted">View all</Link>
                </div>
              )}
            </div>

            {/* Role switcher */}
            <div className="relative">
              <button onClick={() => setRoleOpen((v) => !v)} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
                {roleLabels[role]} <ChevronDown className="size-3.5" />
              </button>
              {roleOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lift">
                  <div className="border-b border-border px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Preview as</div>
                  {(Object.keys(roleLabels) as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => { setRole(r); setRoleOpen(false); navigate({ to: `/app/${r === "admin" ? "admin" : r}` }); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted ${r === role ? "font-bold text-primary" : ""}`}
                    >
                      {roleLabels[r]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function MetricCard({ label, value, delta, icon: Icon, accent }: { label: string; value: string | number; delta?: string; icon: typeof LayoutDashboard; accent?: "primary" | "support" | "urgent" }) {
  const ac = accent ?? "primary";
  const acClass = ac === "support" ? "bg-support/10 text-support" : ac === "urgent" ? "bg-urgent/10 text-urgent" : "bg-primary/10 text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={`grid size-9 place-items-center rounded-lg ${acClass}`}><Icon className="size-4" /></span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {delta && <p className="mt-1 text-xs text-support">{delta}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    /critical|urgent|rejected|emergency/i.test(status) ? "bg-urgent/10 text-urgent"
    : /verified|active|fulfilled|accepted|received|utilized|completed|confirmed/i.test(status) ? "bg-support/10 text-support"
    : /pending|draft|initiated/i.test(status) ? "bg-amber-100 text-amber-700"
    : "bg-muted text-muted-foreground";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tone}`}>{status}</span>;
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <p className="text-base font-semibold">{title}</p>
      {body && <p className="mt-1 text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
