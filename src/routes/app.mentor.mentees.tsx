import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, MapPin } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { LoadingState, EmptyState, ErrorState } from "@/components/app/states";
import { useMentorApplications } from "@/lib/queries";

export const Route = createFileRoute("/app/mentor/mentees")({ component: Mentees });

function Mentees() {
  const { data: apps = [], isLoading, isError, error, refetch } = useMentorApplications();
  if (isLoading) return <LoadingState label="Loading your mentees…" />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

  const accepted = apps.filter((a) => a.status === "accepted" || a.status === "completed");

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="My mentees" subtitle="Mentorship placements you have been accepted into." />
      {accepted.length === 0 ? (
        <EmptyState
          title="No mentees yet"
          body="Apply to a mentorship role and once an institution accepts you, your placement appears here."
          action={
            <Link to="/volunteer" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Browse mentorship roles
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {accepted.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{a.opportunity?.title ?? "Mentorship"}</p>
                  <p className="text-xs text-muted-foreground">{a.opportunity?.institution?.name ?? "Institution"}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              {a.opportunity?.description && (
                <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{a.opportunity.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="size-3" aria-hidden /> {Number(a.hours_logged ?? 0)} hours logged
                </span>
                {a.opportunity?.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden /> {a.opportunity.location}
                  </span>
                )}
              </div>
              {a.opportunity?.institution?.slug && (
                <Link
                  to="/institutions/$slug"
                  params={{ slug: a.opportunity.institution.slug }}
                  className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
                >
                  View institution →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
