import { z } from "zod";

export type QRMode = "tables" | "storefront";

export interface TableQRCard {
  id: string;
  tableNumber?: string | number;
  targetUrl: string;
  qrDataUrl: string;
  title: string;
  subtitle?: string;
}

export interface QRGeneratorConfig {
  mode: QRMode;
  tableCount: number;
  startNumber: number;
  tablePrefix: string;
  showLogo: boolean;
  showWifi: boolean;
  wifiSsid: string;
  wifiPassword: string;
  customInstructionAr: string;
  customInstructionEn: string;
}

export const QRGeneratorConfigSchema = z.object({
  mode: z.enum(["tables", "storefront"]),
  tableCount: z
    .number()
    .int()
    .min(1, "Table count must be at least 1")
    .max(100, "Table count cannot exceed 100")
    .default(10),
  startNumber: z.number().int().min(1, "Start number must be positive").default(1),
  tablePrefix: z.string().max(10).default(""),
  showLogo: z.boolean().default(true),
  showWifi: z.boolean().default(false),
  wifiSsid: z.string().max(50).default(""),
  wifiPassword: z.string().max(50).default(""),
  customInstructionAr: z.string().max(120).default(""),
  customInstructionEn: z.string().max(120).default(""),
});

export const DEFAULT_QR_CONFIG: QRGeneratorConfig = {
  mode: "tables",
  tableCount: 10,
  startNumber: 1,
  tablePrefix: "",
  showLogo: true,
  showWifi: false,
  wifiSsid: "",
  wifiPassword: "",
  customInstructionAr: "",
  customInstructionEn: "",
};
