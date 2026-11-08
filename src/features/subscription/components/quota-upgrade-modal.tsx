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
  currentCount?: number;
  maxLimit?: number;
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
  quotaType = "categories",
  currentCount,
  maxLimit,
  storeName = "",
  storeSlug = "",
  ownerName,
  ownerEmail,
  platformPhone,
  locale = "ar",
}) => {
  const isAr = locale === "ar";
  const typeLabel =
    quotaType === "categories"
      ? isAr
        ? "الأقسام"
        : "categories"
      : isAr
        ? "المنتجات"
        : "products";

  const countDisplay =
    currentCount !== undefined && maxLimit !== undefined
      ? ` (${currentCount} ${isAr ? "من" : "of"} ${maxLimit})`
      : "";

  const handleUpgradeClick = () => {
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

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const proPerks = isAr
    ? [
        "سعة حتى 50 قسماً و 500 منتج كامل",
        "توفير شهرين مجاناً عند اختيار الاشتراك السنوي",
        "دعم فني مخصص وأولوية تفعيل فوري",
      ]
    : [
        "Capacity for up to 50 categories and 500 products",
        "Save 2 months free with annual billing",
        "Priority technical support & instant activation",
      ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAr ? "تم بلوغ الحد الأقصى للباقة" : "Plan Quota Limit Reached"}
    >
      <div className="space-y-5 text-start">
        {/* Warning Badge & Message */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            {isAr
              ? `لقد وصلت للحد الأقصى لعدد ${typeLabel} في خطتك الحالية${countDisplay}. قم بالترقية لخطة Pro لإضافة حتى 50 قسماً و 500 منتج.`
              : `You have reached the limit for ${typeLabel} on your current plan${countDisplay}. Upgrade to Pro to add up to 50 categories and 500 products.`}
          </p>
        </div>

        {/* Pro Plan Highlights */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              {isAr ? "مميزات باقة النمو Pro" : "Pro Growth Plan Perks"}
            </h4>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full">
              {isAr ? "250 ج.م / شهر" : "250 EGP / mo"}
            </span>
          </div>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
            {proPerks.map((perk, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Button
            type="button"
            onClick={handleUpgradeClick}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold min-h-[44px]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{isAr ? "ترقية الباقة عبر واتساب" : "Upgrade via WhatsApp"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-h-[44px] px-5"
          >
            {isAr ? "إغلاق" : "Close"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
