import React from "react";
import type { Metadata, Viewport } from "next";
import { Locale } from "@/types";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Digital Menu | قائمة الطعام الرقمية",
  description:
    "Browse restaurant menu seamlessly with instant search and allergen details.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "ar";
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body className="antialiased min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {children}
      </body>
    </html>
  );
}
