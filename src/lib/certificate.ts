// Donation certificate PDF generator — pure client, no server needed.
import jsPDF from "jspdf";

export type CertificateInput = {
  certificateNo: string;
  donorName: string;
  institutionName: string;
  needTitle: string;
  amount: number;
  issuedAt: string; // ISO
};

export function downloadCertificate(c: CertificateInput) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Deep navy border
  doc.setDrawColor(11, 31, 58);
  doc.setLineWidth(6);
  doc.rect(24, 24, w - 48, h - 48);
  doc.setLineWidth(1);
  doc.rect(36, 36, w - 72, h - 72);

  // Brand bar
  doc.setFillColor(11, 31, 58);
  doc.rect(36, 36, w - 72, 56, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CareBridge", 60, 72);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Care. Community. Compassion.", w - 60, 72, { align: "right" });

  // Title
  doc.setTextColor(11, 31, 58);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text("Certificate of Appreciation", w / 2, 160, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("This certificate is proudly presented to", w / 2, 200, { align: "center" });

  // Donor name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(0, 168, 107); // growth green
  doc.text(c.donorName || "A Generous Donor", w / 2, 250, { align: "center" });

  // Body
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  const amountFmt = `Rs. ${c.amount.toLocaleString("en-IN")}`;
  const body =
    `For a generous contribution of ${amountFmt} towards "${c.needTitle}"\n` +
    `supporting ${c.institutionName}. Your kindness has created real, measurable impact.`;
  doc.text(body, w / 2, 300, { align: "center", maxWidth: w - 200 });

  // Footer line
  doc.setDrawColor(11, 31, 58);
  doc.setLineWidth(0.5);
  doc.line(80, h - 110, 280, h - 110);
  doc.line(w - 280, h - 110, w - 80, h - 110);

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text("Issued on", 180, h - 95, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text(new Date(c.issuedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }), 180, h - 78, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.text("Certificate No.", w - 180, h - 95, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text(c.certificateNo, w - 180, h - 78, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.setFont("helvetica", "normal");
  doc.text("Verify this certificate at carebridge.lovable.app", w / 2, h - 50, { align: "center" });

  doc.save(`CareBridge-Certificate-${c.certificateNo}.pdf`);
}
