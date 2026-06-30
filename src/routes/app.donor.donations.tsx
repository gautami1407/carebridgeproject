import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/app/AppShell";
import { useMyCertificates } from "@/lib/queries";
import { LoadingState, ErrorState, EmptyState } from "@/components/app/states";
import { Download, Award } from "lucide-react";
import { downloadCertificate } from "@/lib/certificate";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/donor/donations")({ component: DonationsHistory });

function DonationsHistory() {
  const { data: rows = [], isLoading, isError, error, refetch } = useMyCertificates();
  const donorName = useStore((s) => s.session?.name) ?? "Generous Donor";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Donation history" subtitle="Full audit trail of every contribution — each comes with a downloadable appreciation certificate." />
      {isLoading ? <LoadingState /> :
        isError ? <ErrorState error={error} onRetry={() => refetch()} /> :
        rows.length === 0 ? <EmptyState title="No donations yet" body="When you donate, your contributions and certificates will show up here." /> : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Need</th>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Certificate</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((d) => (
                  <tr key={d.donationId} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-semibold">{d.needTitle}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.institutionName}</td>
                    <td className="px-4 py-3 font-bold">₹{d.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {d.certificateNo ? (
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground"><Award className="size-3.5 text-support" />{d.certificateNo}</span>
                      ) : (
                        <StatusBadge status="Pending" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {d.certificateNo && (
                        <button
                          onClick={() =>
                            downloadCertificate({
                              certificateNo: d.certificateNo!,
                              donorName,
                              institutionName: d.institutionName,
                              needTitle: d.needTitle,
                              amount: d.amount,
                              issuedAt: d.issuedAt,
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                        >
                          <Download className="size-3.5" /> PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
