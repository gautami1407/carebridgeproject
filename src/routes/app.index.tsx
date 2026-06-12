import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  beforeLoad: () => {
    let role = "donor";
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("carebridge-store");
        role = raw ? JSON.parse(raw)?.state?.session?.role ?? "donor" : "donor";
      } catch {}
    }
    throw redirect({ to: `/app/${role}` });
  },
});
