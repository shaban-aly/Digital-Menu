import React from "react";
import { AdminDashboardPage } from "@/features/admin/components/admin-dashboard-page";

interface AdminStorePageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminStorePage({ params }: AdminStorePageProps) {
  const { slug } = await params;
  return <AdminDashboardPage slug={slug} />;
}

