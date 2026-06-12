import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/qr-tracking")({
  component: () => <ComingSoon title="QR Donation Tracking" tagline="Scan a QR code on any donated item to see its journey end-to-end." bullets={["Tamper-evident chain of custody", "Photo proof at every step", "Donor sees real beneficiary use", "Open audit log"]} />,
});
