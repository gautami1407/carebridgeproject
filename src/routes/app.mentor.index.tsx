import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Calendar, Users, Activity } from "lucide-react";
import { MetricCard, PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/mentor")({
  component: () => (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Mentor dashboard" subtitle="Guide a child or young adult through their journey." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active mentees" value="4" icon={GraduationCap} />
        <MetricCard label="Sessions this month" value="12" icon={Calendar} accent="support" />
        <MetricCard label="Total hours" value="32" icon={Activity} />
        <MetricCard label="Institutions" value="2" icon={Users} />
      </div>
    </div>
  ),
});
