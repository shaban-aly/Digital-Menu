"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { Locale } from "@/types";
import { SubscriptionService } from "../services/subscription-service";
import { Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface QuotaUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "category" | "product";
  currentCount: number;
  maxCount: number;
  storeName: string;
  storeSlug: string;
  locale: Locale;
}

export const QuotaUpgradeModal: React.FC<QuotaUpgradeModalProps> = ({
  isOpen,
  onClose,
  type,
  currentCount,
  maxCount,
  storeName,
  storeSlug,
  locale,
}) => {
  const tSub =
    locale === "ar" ? arTranslations.subscription : enTranslations.subscription;

  const isArabic = locale === "ar";
  const typeLabel =
    type === "category" ? tSub.categories : tSub.products;

  const upgradeUrl = SubscriptionService.buildUpgradeWhatsAppUrl({
    storeName,
    storeSlug,
    targetPlan: "pro",
    billingCycle: "monthly",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tSub.quotaExceededTitle}
    >
      <div className="p-5 space-y-4 text-start">
        {/* Banner with icon */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-amber-900 dark:text-amber-200">
              {isArabic
                ? `وصلت للحد الأقصى لـ ${typeLabel} (${currentCount} من ${maxCount})`
                : `You reached the limit for ${typeLabel} (${currentCount} of ${maxCount})`}
            </p>
            <p className="text-amber-700 dark:text-amber-300 mt-0.5">
              {isArabic
                ? "قم بالترقية إلى باقة Pro لزيادة سعة متجرك 10 أضعاف فوراً."
                : "Upgrade to Pro to instantly get 10x capacity for your store."}
            </p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs">
          <p className="font-bold text-neutral-900 dark:text-neutral-100">
            {isArabic ? "مميزات باقة النمو Pro:" : "Pro Growth Plan Benefits:"}
          </p>
          <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isArabic ? "حتى 50 قسماً في المنيو (بدلاً من 7)" : "Up to 50 categories (vs 7)"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isArabic ? "حتى 500 منتج وصنف (بدلاً من 50)" : "Up to 500 menu products (vs 50)"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isArabic ? "دعم فني مخصص وأولوية في التحديثات" : "Priority customer support"}</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <a
            href={upgradeUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="quota-upgrade-whatsapp-btn"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{tSub.upgradeWhatsApp}</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isArabic ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
