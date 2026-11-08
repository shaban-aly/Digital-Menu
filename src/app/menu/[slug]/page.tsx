import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/features/menu/services/menu-service";
import { MenuPage } from "@/features/menu/components/menu-page";
import { MenuSkeleton } from "@/features/menu/components/menu-skeleton";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStoreBySlug(slug);
  if (!data) return { title: "Store Not Found | غير موجود" };

  return {
    title: `${data.restaurant.name_ar} | ${data.restaurant.name_en}`,
    description: data.restaurant.description_ar || data.restaurant.description_en,
  };
}

export default async function StoreMenuPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const tableParam = resolvedSearchParams?.table;
  const initialTable = typeof tableParam === "string" ? tableParam : undefined;

  const data = await getStoreBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuPage initialData={data} initialTableNumber={initialTable} />
    </Suspense>
  );
}
