import {
  PricingPlan,
  FaqItem,
  BusinessSolution,
  CalculatorState,
} from "../types";
import {
  PRICING_PLANS,
  FAQ_ITEMS,
  BUSINESS_SOLUTIONS,
} from "./landing-content";

export function getPricingPlans(): PricingPlan[] {
  return PRICING_PLANS;
}

export function getFaqItems(): FaqItem[] {
  return FAQ_ITEMS;
}

export function getBusinessSolutions(): BusinessSolution[] {
  return BUSINESS_SOLUTIONS;
}

export function calculateSavings(state: CalculatorState): {
  monthlyTurnover: number;
  monthlySavings: number;
  annualSavings: number;
} {
  const safeOrders = Math.max(10, Math.min(10000, state.monthlyOrders || 400));
  const safeBasket = Math.max(20, Math.min(5000, state.averageBasket || 220));
  const safeRate = Math.max(5, Math.min(35, state.aggregatorRate || 18));

  const monthlyTurnover = safeOrders * safeBasket;
  const monthlySavings = Math.round(monthlyTurnover * (safeRate / 100));
  const annualSavings = monthlySavings * 12;

  return { monthlyTurnover, monthlySavings, annualSavings };
}

export function buildWhatsAppInquiryUrl(
  planName = "منصة المنيو الرقمي",
  customNote = ""
): string {
  const phone = "201012345678";
  const text = customNote
    ? `مرحباً، أود الاستفسار بخصوص ${planName}: ${customNote}`
    : `مرحباً، أود الاشتراك وتجربة ${planName} لنشاطي التجاري.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
