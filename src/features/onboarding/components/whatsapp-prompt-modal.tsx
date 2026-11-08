"use client";

import React from "react";
import { MessageSquare, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";
import { SubscriptionPlanKey, BillingCycle } from "@/features/subscription/types";

interface WhatsAppPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  storeSlug: string;
  plan: SubscriptionPlanKey;
  billingCycle: BillingCycle;
  ownerName: string;
  onContinueToDashboard: () => void;
}

export const WhatsAppPromptModal: React.FC<WhatsAppPromptModalProps> = ({
  isOpen,
  onClose,
  storeName,
  storeSlug,
  plan,
  billingCycle,
  ownerName,
  onContinueToDashboard,
}) => {
  const { locale } = useLanguage();
  const t = locale === "ar" ? arTranslations : enTranslations;
  const isAr = locale === "ar";

  const platformPhone = "201012345678";
  const cycleText = billingCycle === "yearly" ? "سنوي" : "شهري";
  const planLabel = plan.toUpperCase();

  const messageText = isAr
    ? `مرحباً، قمت بتسجيل متجر "${storeName}" برابط (${storeSlug}) بصاحب الحساب (${ownerName}). أود تفعيل باقة (${planLabel}) بنظام (${cycleText}).`
    : `Hello, I registered store "${storeName}" (slug: ${storeSlug}) under owner (${ownerName}). I'd like to activate the ${planLabel} plan (${billingCycle}).`;

  const whatsappUrl = `https://wa.me/${platformPhone}?text=${encodeURIComponent(
    messageText
  )}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.onboarding.proActivationTitle}
    >
      <div className="p-6 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-3xl bg-green-50 dark:bg-green-950/50 text-green-600 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
            {t.onboarding.proActivationTitle}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
            {t.onboarding.proActivationDesc.replace("{plan}", planLabel)}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-start text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-neutral-500">{isAr ? "المتجر:" : "Store:"}</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">{storeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">{isAr ? "الرابط:" : "Slug:"}</span>
            <span className="font-mono text-brand-600 dark:text-brand-400">{storeSlug}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">{isAr ? "الباقة المختارة:" : "Selected Plan:"}</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">
              {planLabel} ({billingCycle})
            </span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs bg-green-600 text-white hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.onboarding.openWhatsApp}</span>
          </a>

          <Button
            type="button"
            variant="outline"
            onClick={onContinueToDashboard}
            className="w-full min-h-[44px] text-xs font-bold flex items-center justify-center gap-2"
          >
            <span>{t.onboarding.continueToDashboard}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
