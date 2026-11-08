import { Locale } from "@/types";
import { MenuData, Restaurant } from "@/features/menu/types";
import { SubscriptionPlanKey, QuotaUsage } from "@/features/subscription/types";

export type DashboardTab = "items" | "categories" | "settings" | "qr";

export interface StoreOption {
  slug: string;
  name_ar: string;
  name_en: string;
}

export interface DashboardHeaderProps {
  currentSlug: string;
  storeName: string;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  locale: Locale;
  onToggleLanguage: () => void;
  planKey?: SubscriptionPlanKey;
}

export interface DashboardQuotaCardsProps {
  quotaUsage: QuotaUsage;
  store: MenuData;
  locale: Locale;
  onUpgradeClick: () => void;
}

export interface DashboardViewProps {
  slug: string;
}
