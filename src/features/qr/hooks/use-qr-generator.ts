"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { Store } from "@/features/menu/types";
import { DEFAULT_QR_CONFIG, QRGeneratorConfig, TableQRCard } from "../types";
import { downloadQRImage, generateQRCards } from "../services/qr-service";

export interface UseQRGeneratorReturn {
  config: QRGeneratorConfig;
  cards: TableQRCard[];
  isLoading: boolean;
  updateConfig: (patch: Partial<QRGeneratorConfig>) => void;
  downloadCard: (card: TableQRCard) => void;
  printCards: () => void;
}

export function useQRGenerator(store: Store): UseQRGeneratorReturn {
  const isSupermarket = store.business_type === "supermarket";

  const [config, setConfig] = useState<QRGeneratorConfig>(() => ({
    ...DEFAULT_QR_CONFIG,
    mode: isSupermarket ? "storefront" : "tables",
  }));

  const [cards, setCards] = useState<TableQRCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  const refreshCards = useCallback(async () => {
    setIsLoading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    try {
      const generated = await generateQRCards(store, config, origin);
      startTransition(() => {
        setCards(generated);
        setIsLoading(false);
      });
    } catch {
      setIsLoading(false);
    }
  }, [store, config]);

  useEffect(() => {
    refreshCards();
  }, [refreshCards]);

  const updateConfig = useCallback((patch: Partial<QRGeneratorConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const downloadCard = useCallback(
    (card: TableQRCard) => {
      const filename = card.tableNumber
        ? `${store.slug}-table-${card.tableNumber}.png`
        : `${store.slug}-storefront.png`;
      downloadQRImage(card.qrDataUrl, filename);
    },
    [store.slug]
  );

  const printCards = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  return {
    config,
    cards,
    isLoading,
    updateConfig,
    downloadCard,
    printCards,
  };
}
