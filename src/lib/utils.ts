import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  locale: Locale,
  currency: string = "EGP"
): string {
  const formatted = amount.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (currency === "EGP") {
    return locale === "ar" ? `${formatted} ج.م` : `${formatted} EGP`;
  }
  return `${formatted} ${currency}`;
}
