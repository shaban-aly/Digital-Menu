import QRCode from "qrcode";
import { QRGeneratorConfig, TableQRCard } from "../types";
import { Store } from "@/features/menu/types";

export interface QRDataUrlOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

/**
 * Generates a high-contrast PNG data URL for a given text or URL
 */
export async function generateQRDataUrl(
  text: string,
  options?: QRDataUrlOptions
): Promise<string> {
  const opts: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: options?.errorCorrectionLevel || "M",
    margin: options?.margin ?? 2,
    width: options?.width ?? 500,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  };
  return QRCode.toDataURL(text, opts);
}

/**
 * Builds table target URL based on origin, store slug, and optional table identifier
 */
export function buildQRTargetUrl(
  origin: string,
  storeSlug: string,
  tableNumber?: string | number
): string {
  const cleanOrigin = origin.replace(/\/+$/, "");
  if (tableNumber !== undefined && tableNumber !== null && String(tableNumber).trim() !== "") {
    return `${cleanOrigin}/menu/${storeSlug}?table=${encodeURIComponent(String(tableNumber))}`;
  }
  return `${cleanOrigin}/menu/${storeSlug}`;
}

/**
 * Generates an array of TableQRCards matching current config
 */
export async function generateQRCards(
  store: Store,
  config: QRGeneratorConfig,
  origin: string
): Promise<TableQRCard[]> {
  const isSupermarket = store.business_type === "supermarket";
  const effectiveMode = isSupermarket ? "storefront" : config.mode;

  if (effectiveMode === "storefront") {
    const targetUrl = buildQRTargetUrl(origin, store.slug);
    const qrDataUrl = await generateQRDataUrl(targetUrl, { width: 600 });
    return [
      {
        id: `storefront-${store.slug}`,
        targetUrl,
        qrDataUrl,
        title: store.name_ar,
        subtitle: "امسح الكود لتصفح المنتجات والطلب للتوصيل مباشرة",
      },
    ];
  }

  const cards: TableQRCard[] = [];
  const count = Math.max(1, Math.min(config.tableCount, 100));
  const start = Math.max(1, config.startNumber);

  for (let i = 0; i < count; i++) {
    const num = start + i;
    const tableId = config.tablePrefix ? `${config.tablePrefix}${num}` : num;
    const targetUrl = buildQRTargetUrl(origin, store.slug, tableId);
    const qrDataUrl = await generateQRDataUrl(targetUrl, { width: 500 });

    cards.push({
      id: `table-${tableId}`,
      tableNumber: tableId,
      targetUrl,
      qrDataUrl,
      title: `طاولة رقم ${tableId}`,
      subtitle: "امسح الكود لتصفح المنيو والطلب من طاولتك",
    });
  }

  return cards;
}

/**
 * Initiates client-side PNG download
 */
export function downloadQRImage(dataUrl: string, filename: string): void {
  if (typeof window === "undefined") return;
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
