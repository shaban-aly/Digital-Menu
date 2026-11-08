/**
 * Contracts & Interfaces for Marketing Landing Page
 * Feature: 004-marketing-landing-page
 */

export interface PricingPlanContract {
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

export interface FaqItemContract {
  id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
}

export interface BusinessSolutionContract {
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

export interface CalculatorStateContract {
  monthlyOrders: number;
  averageBasket: number;
  aggregatorRate: number;
}
