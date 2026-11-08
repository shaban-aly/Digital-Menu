import { SubscriptionPlanKey, BillingCycle } from "../types";

export interface UpgradeWhatsAppParams {
  platformPhone?: string;
  storeName: string;
  storeSlug: string;
  ownerName?: string;
  ownerEmail?: string;
  targetPlan: SubscriptionPlanKey;
  billingCycle?: BillingCycle;
}

export class SubscriptionService {
  static DEFAULT_PLATFORM_PHONE = "201012345678";

  static buildUpgradeWhatsAppUrl(params: UpgradeWhatsAppParams): string {
    const rawPhone = params.platformPhone || this.DEFAULT_PLATFORM_PHONE;
    const cleanPhone = rawPhone.replace(/[^\d]/g, "");

    const cycleLabel =
      params.billingCycle === "yearly" ? "سنوي (خصم شهرين)" : "شهري";

    const planLabel =
      params.targetPlan === "pro"
        ? `باقة النمو Pro (${cycleLabel})`
        : params.targetPlan === "enterprise"
        ? "باقة الشركات Enterprise"
        : "باقة البداية Free";

    const lines = [
      "مرحباً إدارة منصة المنيو الرقمي،",
      "أرغب في ترقية اشتراك متجري:",
      `• اسم المتجر: ${params.storeName}`,
      `• رابط المتجر: ${params.storeSlug}`,
      params.ownerName ? `• اسم المالك: ${params.ownerName}` : null,
      params.ownerEmail ? `• البريد الإلكتروني: ${params.ownerEmail}` : null,
      `• الخطة المطلوبة: ${planLabel}`,
      "يرجى تزويدي بطرق الدفع وتفعيل الباقة.",
    ].filter(Boolean);

    const message = lines.join("\n");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
}
