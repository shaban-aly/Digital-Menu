import React from "react";
import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/lib/i18n/language-context";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

