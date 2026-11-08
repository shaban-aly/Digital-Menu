import { z } from "zod";

export interface PricingPlan {
  id: string;
  name_ar: string;
  name_en: string;
  badge_ar?: string;
  badge_en?: string;
  priceMonthly: number;
  description_ar: string;
  description_en: string;
  features_ar: string[];
  features_en: string[];
  isPopular?: boolean;
  ctaText_ar: string;
  ctaText_en: string;
  whatsappMessage: string;
}

export interface FaqItem {
  id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
}

export interface BusinessSolution {
  id: "restaurant" | "cafe" | "supermarket";
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  demoSlug: string;
  highlights_ar: string[];
  highlights_en: string[];
  badge_ar: string;
  badge_en: string;
}

export interface CalculatorState {
  monthlyOrders: number;
  averageBasket: number;
  aggregatorRate: number;
}

export const CalculatorStateSchema = z.object({
  monthlyOrders: z.number().int().min(10).max(10000).default(400),
  averageBasket: z.number().min(20).max(5000).default(220),
  aggregatorRate: z.number().min(5).max(35).default(18),
});
