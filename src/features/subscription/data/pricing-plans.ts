import { SubscriptionPlanKey, BillingCycle } from "../types";

export interface PricingPlanTier {
  key: SubscriptionPlanKey;
  nameAr: string;
  nameEn: string;
  badgeAr?: string;
  badgeEn?: string;
  descriptionAr: string;
  descriptionEn: string;
  quotaAr: string;
  quotaEn: string;
  featuresAr: string[];
  featuresEn: string[];
  isPopular?: boolean;
}

export const PRICING_TIERS: PricingPlanTier[] = [
  {
    key: "free",
    nameAr: "باقة البداية",
    nameEn: "Starter Plan",
    descriptionAr: "مثالية للمشاريع الناشئة وتجربة المنصة بدون أي تكلفة",
    descriptionEn: "Perfect for new food ventures & testing the platform",
    quotaAr: "حتى 7 أقسام و 50 منتجاً",
    quotaEn: "Up to 7 categories & 50 products",
    featuresAr: [
      "منيو إلكتروني سريع برمز QR وتصميم احترافي",
      "استلام الطلبات مباشرة على واتساب المتجر",
      "إدارة متكاملة للأقسام والمنتجات والأسعار",
      "دعم مواعيد العمل والطلبات المسبقة الذكية",
    ],
    featuresEn: [
      "Fast QR digital menu with sleek design",
      "Direct WhatsApp order dispatch",
      "Full categories, items & pricing manager",
      "Smart operating hours & scheduled pre-orders",
    ],
  },
  {
    key: "pro",
    nameAr: "باقة النمو الاحترافية",
    nameEn: "Pro Growth",
    badgeAr: "الأكثر اختياراً",
    badgeEn: "Most Popular",
    descriptionAr: "للمطاعم والمتاجر المتنامية ذات القوائم المتنوعة",
    descriptionEn: "For growing restaurants & multi-section food venues",
    quotaAr: "حتى 50 قسماً و 500 منتج",
    quotaEn: "Up to 50 categories & 500 products",
    featuresAr: [
      "كل مميزات باقة البداية المتاحة بالكامل",
      "سعة مضاعفة 10 أضعاف (50 قسماً و 500 منتج)",
      "توفير شهرين مجاناً عند الاشتراك السنوي",
      "أولوية في الدعم الفني والمساعدة في التفعيل",
    ],
    featuresEn: [
      "All Starter features fully unlocked",
      "10x catalog capacity (50 cat / 500 products)",
      "Save 2 months free with annual subscription",
      "Priority WhatsApp technical support",
    ],
    isPopular: true,
  },
  {
    key: "enterprise",
    nameAr: "باقة الشركات",
    nameEn: "Enterprise",
    descriptionAr: "لسلاسل المطاعم والشركات التي تتطلب سعة وفروعاً متعددة",
    descriptionEn: "For large restaurant chains & custom multi-branch setups",
    quotaAr: "أقسام ومنتجات وفروع غير محدودة",
    quotaEn: "Unlimited categories, products & branches",
    featuresAr: [
      "أقسام ومنتجات غير محدودة بدون أي قيود",
      "دعم فروع متعددة وهوية بصرية مخصصة",
      "تقارير متقدمة وربط مخصص للأنظمة",
      "مدير حساب مخصص ومساعدة كاملة في الإعداد",
    ],
    featuresEn: [
      "Unlimited items and categories with zero caps",
      "Multi-branch support & custom branding",
      "Advanced platform reports & custom integrations",
      "Dedicated account manager & guided onboarding",
    ],
  },
];

export function getTierPrice(
  planKey: SubscriptionPlanKey,
  cycle: BillingCycle,
  locale: "ar" | "en"
): { price: string; period: string } {
  const isAr = locale === "ar";
  if (planKey === "free") {
    return {
      price: isAr ? "0 ج.م" : "0 EGP",
      period: isAr ? "دائماً مجاناً" : "Free Forever",
    };
  }
  if (planKey === "pro") {
    if (cycle === "yearly") {
      return {
        price: isAr ? "2,500 ج.م" : "2,500 EGP",
        period: isAr ? "/ سنة (وفر شهرين)" : "/ year (2 mo free)",
      };
    }
    return {
      price: isAr ? "250 ج.م" : "250 EGP",
      period: isAr ? "/ شهر" : "/ month",
    };
  }
  return {
    price: isAr ? "مخصص" : "Custom",
    period: isAr ? "تواصل معنا" : "Contact Us",
  };
}
