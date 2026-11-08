"use client";

import { useState, useEffect } from "react";
import { generateQRCodeDataUrl } from "../services/qr-generator-service";

export function useStoreQR(slug: string) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [wifiSsid, setWifiSsid] = useState<string>("");
  const [wifiPassword, setWifiPassword] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const url = `${origin}/menu/${slug}`;
      setTargetUrl(url);

      setIsGenerating(true);
      generateQRCodeDataUrl(url)
        .then((dataUrl) => setQrDataUrl(dataUrl))
        .catch((e) => console.error("QR Error", e))
        .finally(() => setIsGenerating(false));
    }
  }, [slug]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qr-${slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    qrDataUrl,
    targetUrl,
    wifiSsid,
    setWifiSsid,
    wifiPassword,
    setWifiPassword,
    isGenerating,
    downloadQR,
  };
}

