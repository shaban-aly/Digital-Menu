"use client";

import React, { use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStoreAdmin } from "@/features/admin/hooks/use-store-admin";
import { useStoreQR } from "@/features/admin/hooks/use-store-qr";
import { PrintableTentCard } from "@/features/admin/components/printable-tent-card";
import { Printer } from "lucide-react";

interface PrintQRPageProps {
  params: Promise<{ slug: string }>;
}

export default function PrintQRPage({ params }: PrintQRPageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const ssid = searchParams.get("ssid") || "";
  const pass = searchParams.get("pass") || "";

  const { store, isLoading } = useStoreAdmin(slug);
  const { qrDataUrl } = useStoreQR(slug);

  useEffect(() => {
    if (!isLoading && qrDataUrl) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, qrDataUrl]);

  if (isLoading || !store) {
    return <div className="p-8 text-center text-xs text-neutral-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-100 print:bg-white flex flex-col items-center justify-center p-6">
      <div className="print:hidden mb-6 flex items-center gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 shadow-md transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة الستاند</span>
        </button>
      </div>

      <PrintableTentCard
        restaurant={store.restaurant}
        qrDataUrl={qrDataUrl}
        wifiSsid={ssid}
        wifiPassword={pass}
        locale="ar"
      />
    </div>
  );
}

