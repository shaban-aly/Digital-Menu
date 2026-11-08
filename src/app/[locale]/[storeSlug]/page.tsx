import React, { Suspense } from "react";
import { getStoreBySlug } from "@/features/menu/services/menu-service";
import { MenuPage } from "@/features/menu/components/menu-page";
import { MenuSkeleton } from "@/features/menu/components/menu-skeleton";
import { Locale } from "@/types";

interface PageProps {
  params: Promise<{
    locale: string;
    storeSlug: string;
  }>;
}

export default async function StorePage({ params }: PageProps) {
  const { locale: rawLocale, storeSlug } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "ar";
  const data = await getStoreBySlug(storeSlug);

  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuPage initialData={data} initialLocale={locale} />
    </Suspense>
  );
}
