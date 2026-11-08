"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { buildUpgradeWhatsAppUrl } from "../services/subscription-service";
import { SubscriptionPlanKey } from "../types";
import { AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";

export interface QuotaUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotaType?: "categories" | "products";
  type?: "category" | "product" | "categories" | "products";
  currentCount?: number;
  maxLimit?: number;
  maxCount?: number;
  planKey?: SubscriptionPlanKey;
  storeName?: string;
  storeSlug?: string;
  ownerName?: string;
  ownerEmail?: string;
  platformPhone?: string;
  locale?: "ar" | "en";
}

export const QuotaUpgradeModal: React.FC<QuotaUpgradeModalProps> = ({
  isOpen,
  onClose,
  quotaType,
  type,
  currentCount,
  maxLimit,
  maxCount,
  storeName = "",
  storeSlug = "",
  ownerName,
  ownerEmail,
  platformPhone,
  locale = "ar",
}) => {
  const isAr = locale === "ar";
  const resolvedType =
    quotaType || (type === "product" ? "products" : "categories");
  const resolvedMax = maxLimit ?? maxCount;

  const typeLabel =
    resolvedType === "categories"
      ? isAr
        ? "الأقسام"
        : "categories"
      : isAr
        ? "المنتجات"
        : "products";

  const countDisplay =
    currentCount !== undefined && resolvedMax !== undefined
      ? ` (${currentCount} ${isAr ? "من" : "of"} ${resolvedMax})`
      : "";

  const handleWhatsAppUpgrade = () => {
    if (typeof window === "undefined") return;
    const url = buildUpgradeWhatsAppUrl({
      platformPhone,
      storeName: storeName || (isAr ? "متجري" : "My Store"),
      storeSlug: storeSlug || "store",
      ownerName,
      ownerEmail,
      targetPlan: "pro",
      billingCycle: "yearly",
      locale,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAr ? "تم بلوغ الحد الأقصى للباقة" : "Plan Capacity Limit Reached"}
    >
      <div className="space-y-6 pt-2">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-start">
          {isAr
            ? `لقد وصلت إلى الحد المسموح به لعدد ${typeLabel}${countDisplay}.`
            : `You have reached the maximum allowed limit for ${typeLabel}${countDisplay}.`}
        </p>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="text-xs leading-relaxed text-start">
            <p className="font-bold mb-1">
              {isAr ? "لماذا لا يمكنك الإضافة؟" : "Why is addition blocked?"}
            </p>
            <p>
              {isAr
                ? "للحفاظ على كفاءة الخطة الحالية، لا يمكن إضافة المزيد من العناصر دون ترقية الباقة إلى Pro أو Enterprise."
                : "To maintain plan limits, adding more items is restricted until upgrading to Pro or Enterprise."}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3 bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-brand-600">
              {isAr ? "مميزات باقة النمو Pro" : "Pro Plan Highlights"}
            </span>
            <span className="text-[10px] bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300 font-bold px-2 py-0.5 rounded-full">
              {isAr ? "250 ج.م / شهر" : "250 EGP / mo"}
            </span>
          </div>
          <ul className="text-xs text-neutral-600 dark:text-neutral-300 space-y-2 text-start">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? "حتى 50 قسماً (بدلاً من 7)" : "Up to 50 categories"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? "حتى 500 منتج (بدلاً من 50)" : "Up to 500 products"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? "وفر شهرين عند الاشتراك السنوي" : "Save 2 months on annual plan"}</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto min-h-[44px]">
            {isAr ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            onClick={handleWhatsAppUpgrade}
            className="w-full sm:w-auto min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isAr ? "ترقية عبر واتساب الآن" : "Upgrade via WhatsApp"}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
