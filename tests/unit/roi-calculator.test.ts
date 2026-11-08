import { describe, it, expect } from "vitest";
import {
  calculateSavings,
  getPricingPlans,
  getFaqItems,
  getBusinessSolutions,
  buildWhatsAppInquiryUrl,
} from "@/features/landing/services/landing-data";

describe("Landing Data Service & ROI Calculator", () => {
  it("should calculate monthly and annual commission savings accurately", () => {
    // 400 orders * 200 EGP = 80,000 turnover
    // 80,000 * 20% = 16,000 monthly savings -> 192,000 annual savings
    const result = calculateSavings({
      monthlyOrders: 400,
      averageBasket: 200,
      aggregatorRate: 20,
    });

    expect(result.monthlyTurnover).toBe(80000);
    expect(result.monthlySavings).toBe(16000);
    expect(result.annualSavings).toBe(192000);
  });

  it("should handle default fallback values when inputs are zero or invalid", () => {
    const result = calculateSavings({
      monthlyOrders: 0,
      averageBasket: 0,
      aggregatorRate: 0,
    });

    expect(result.monthlyTurnover).toBeGreaterThan(0);
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  it("should return valid pricing plans, FAQs, and business solutions", () => {
    const plans = getPricingPlans();
    expect(plans).toHaveLength(3);
    expect(plans[1].isPopular).toBe(true);

    const faqs = getFaqItems();
    expect(faqs.length).toBeGreaterThanOrEqual(4);

    const solutions = getBusinessSolutions();
    expect(solutions).toHaveLength(3);
    expect(solutions.map((s) => s.id)).toEqual(["restaurant", "cafe", "supermarket"]);
  });

  it("should format valid wa.me URL with phone and message", () => {
    const url = buildWhatsAppInquiryUrl("باقة النمو");
    expect(url.startsWith("https://wa.me/201012345678?text=")).toBe(true);
    expect(url).toContain(encodeURIComponent("باقة النمو"));
  });
});
