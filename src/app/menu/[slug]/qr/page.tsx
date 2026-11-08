import React from "react";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/features/menu/services/menu-service";
import { QRGeneratorScreen } from "@/features/qr/components/qr-generator-screen";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStoreBySlug(slug);
  if (!data) return { title: "Store Not Found" };

  return {
    title: `QR Generator | ${data.restaurant.name_ar} | ${data.restaurant.name_en}`,
    description: `Generate printable table QR codes for ${data.restaurant.name_en}`,
  };
}

export default async function StoreQRPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getStoreBySlug(slug);

  if (!data) {
    notFound();
  }

  return <QRGeneratorScreen store={data.restaurant} />;
}
