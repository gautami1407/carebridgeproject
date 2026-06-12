import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("carebridge-store");
      const role = raw ? JSON.parse(raw)?.state?.session?.role ?? "donor" : "donor";
      throw redirect({ to: `/app/${role}` });
    } catch (e) {
      if ((e as { isRedirect?: boolean })?.isRedirect) throw e;
      throw redirect({ to: "/app/donor" });
    }
  },
});
