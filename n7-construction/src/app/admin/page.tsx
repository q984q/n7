import React from "react";
import { isAdminAuthenticated } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Панель управления | N7 CONSTRUCTION",
  description: "Управление каталогом, ценами в тенге (₸), заявками КП и контактами N7 CONSTRUCTION.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  return <AdminDashboardClient initialAuth={authed} />;
}
