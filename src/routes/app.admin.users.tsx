import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";

const users = [
  { name: "Anita R.", email: "anita@example.com", role: "Donor", status: "Active" },
  { name: "Priya N.", email: "priya@example.com", role: "Volunteer", status: "Active" },
  { name: "Dr. Patel", email: "patel@example.com", role: "Mentor", status: "Active" },
  { name: "Anand Bal Sadan", email: "ravi@anandbal.org", role: "Institution", status: "Pending" },
];

export const Route = createFileRoute("/app/admin/users")({
  component: () => (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Users" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.email}><td className="px-4 py-3 font-semibold">{u.name}</td><td className="px-4 py-3 text-muted-foreground">{u.email}</td><td className="px-4 py-3">{u.role}</td><td className="px-4 py-3"><StatusBadge status={u.status} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
});
