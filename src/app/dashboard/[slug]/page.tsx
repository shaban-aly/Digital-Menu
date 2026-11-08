import React from "react";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

interface DashboardStorePageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardStorePage({ params }: DashboardStorePageProps) {
  const { slug } = await params;
  return <DashboardView slug={slug} />;
}
