import React, { Suspense } from "react";
import { getMenuData } from "@/features/menu/services/menu-service";
import { MenuPage } from "@/features/menu/components/menu-page";
import { MenuSkeleton } from "@/features/menu/components/menu-skeleton";
import { Locale } from "@/types";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "ar";
  const data = await getMenuData();

  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuPage initialData={data} initialLocale={locale} />
    </Suspense>
  );
}
