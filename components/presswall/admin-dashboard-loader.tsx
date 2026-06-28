"use client";

import nextDynamic from "next/dynamic";
import { EditorShellSkeleton } from "@/components/presswall/editor-shell-skeleton";

const AdminDashboard = nextDynamic(
  () =>
    import("@/components/presswall/admin-dashboard").then(
      (module) => module.AdminDashboard
    ),
  {
    loading: () => <EditorShellSkeleton />,
    ssr: false,
  }
);

export function AdminDashboardLoader() {
  return <AdminDashboard />;
}
