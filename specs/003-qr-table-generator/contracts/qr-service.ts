/**
 * Contract: QR Generation Service
 * Path: src/features/qr/services/qr-service.ts
 */

import { QRGeneratorConfig, TableQRCard } from "@/features/qr/types";
import { Store } from "@/features/menu/types";

export interface IQRService {
  /**
   * Generates batch of QR cards based on configuration and store data
   * @param store The target store
   * @param config The generator configuration
   * @param origin Current application origin (e.g. http://localhost:3000)
   * @returns Promise resolving to an array of ready-to-render TableQRCards
   */
  generateQRCards(
    store: Store,
    config: QRGeneratorConfig,
    origin: string
  ): Promise<TableQRCard[]>;

  /**
   * Generates a single QR Code as a PNG Data URL
   * @param text The exact text or URL to encode
   * @param options Optional overrides for width and margin
   * @returns Promise resolving to base64 data URL
   */
  generateQRDataUrl(
    text: string,
    options?: { width?: number; margin?: number }
  ): Promise<string>;

  /**
   * Triggers download of a QR card as a PNG file
   * @param dataUrl The base64 PNG data URL
   * @param filename Desired filename (e.g. "table-5.png")
   */
  downloadQRImage(dataUrl: string, filename: string): void;
}
