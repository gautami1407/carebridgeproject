import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/csr")({
  component: () => <ComingSoon title="Corporate CSR Portal" tagline="Run your company's CSR programmes through one verified dashboard." bullets={["Bulk donations & employee giving", "Impact reports for compliance (Sec 135)", "Verified institution partners", "Employee volunteering at scale"]} />,
});
