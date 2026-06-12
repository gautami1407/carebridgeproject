import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/app/mentor")({ component: () => <Outlet /> });
