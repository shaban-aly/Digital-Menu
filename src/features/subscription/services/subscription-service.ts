import { SubscriptionPlanKey, BillingCycle } from "../types";

export const DEFAULT_PLATFORM_PHONE = "201012345678";

export interface UpgradeWhatsAppParams {
  platformPhone?: string;
  storeName: string;
  storeSlug: string;
  ownerName?: string;
  ownerEmail?: string;
  targetPlan: SubscriptionPlanKey;
  billingCycle?: BillingCycle;
  locale?: "ar" | "en";
}

function resolvePlanDescription(
  plan: SubscriptionPlanKey,
  cycle: BillingCycle = "monthly",
  locale: "ar" | "en" = "ar"
): string {
  const isAr = locale === "ar";

  if (plan === "pro") {
    if (cycle === "yearly") {
      return isAr
        ? "باقة النمو الاحترافية (Pro السنوية) - 2,500 ج.م / سنة (تشمل توفير شهرين مجاناً)"
        : "Pro Annual Plan - 2,500 EGP / yr (includes 2 months free)";
    }
    return isAr
      ? "باقة النمو الاحترافية (Pro الشهرية) - 250 ج.م / شهر"
      : "Pro Monthly Plan - 250 EGP / mo";
  }

  if (plan === "enterprise") {
    return isAr
      ? "باقة الشركات (Enterprise) - سعة وفروع غير محدودة (تسعير مخصص)"
      : "Enterprise Plan - Unlimited capacity & branches (custom pricing)";
  }

  return isAr
    ? "باقة البداية (Free) - مجانية (7 أقسام / 50 منتجاً)"
    : "Starter Plan (Free) - 0 EGP (7 categories / 50 products)";
}

/**
 * Builds pre-filled WhatsApp deep link URL to platform admin for subscription upgrades.
 */
export function buildUpgradeWhatsAppUrl(params: UpgradeWhatsAppParams): string {
  const phone = (params.platformPhone || DEFAULT_PLATFORM_PHONE).replace(
    /\D/g,
    ""
  );
  const locale = params.locale || "ar";
  const isAr = locale === "ar";
  const cycle = params.billingCycle || "monthly";
  const planDesc = resolvePlanDescription(params.targetPlan, cycle, locale);

  const lines: string[] = [
    isAr
      ? "🚀 *طلب ترقية اشتراك - منصة المنيو الرقمي*"
      : "🚀 *Subscription Upgrade Request - Digital Menu*",
    "------------------------------",
    isAr ? `🏪 *اسم المتجر:* ${params.storeName}` : `🏪 *Store Name:* ${params.storeName}`,
    isAr ? `🔗 *رابط المتجر:* /menu/${params.storeSlug}` : `🔗 *Store Slug:* /menu/${params.storeSlug}`,
    isAr ? `📦 *الباقة المطلوبة:* ${planDesc}` : `📦 *Target Plan:* ${planDesc}`,
  ];

  if (params.ownerName && params.ownerName.trim()) {
    lines.push(
      isAr
        ? `👤 *صاحب الحساب:* ${params.ownerName.trim()}`
        : `👤 *Account Owner:* ${params.ownerName.trim()}`
    );
  }

  if (params.ownerEmail && params.ownerEmail.trim()) {
    lines.push(
      isAr
        ? `📧 *البريد الإلكتروني:* ${params.ownerEmail.trim()}`
        : `📧 *Email:* ${params.ownerEmail.trim()}`
    );
  }

  lines.push("------------------------------");
  lines.push(
    isAr
      ? "أرغب في ترقية وتفعيل الباقة، يرجى تزويدي بتفاصيل الدفع وتأكيد الحساب. شكراً لكم!"
      : "I would like to upgrade and activate this plan. Please provide payment and confirmation details. Thank you!"
  );

  const message = lines.join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const SubscriptionService = {
  buildUpgradeWhatsAppUrl,
};
