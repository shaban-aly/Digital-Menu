"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { SubscriptionPlanKey, BillingCycle } from "@/features/subscription/types";
import { Restaurant } from "@/features/menu/types";
import { Button } from "@/components/ui/button";
import { OnboardingService } from "../services/onboarding-service";
import { BusinessTypeSelector, OnboardingBusinessType } from "./business-type-selector";
import { StoreIdentityFields } from "./store-identity-fields";
import { PlanSelectorCards } from "./plan-selector-cards";
import { WhatsAppPromptModal } from "./whatsapp-prompt-modal";

export const OnboardingWizard: React.FC = () => {
  const { locale } = useLanguage();
  const t = locale === "ar" ? arTranslations : enTranslations;
  const router = useRouter();
  const { user } = useAuth();

  const [businessType, setBusinessType] = useState<OnboardingBusinessType>("restaurant");
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("201012345678");
  const [deliveryFee, setDeliveryFee] = useState<number>(20);
  const [plan, setPlan] = useState<SubscriptionPlanKey>("free");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdStore, setCreatedStore] = useState<Restaurant | null>(null);

  const checkSlug = useCallback(async (candidate: string) => {
    if (!candidate || candidate.length < 3) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const isAvail = await OnboardingService.checkSlugAvailability(candidate);
    setSlugStatus(isAvail ? "available" : "taken");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (slug) checkSlug(slug);
    }, 300);
    return () => clearTimeout(timer);
  }, [slug, checkSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError(locale === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please sign in first");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const store = await OnboardingService.createStore(
        { businessType, nameAr, nameEn, slug, phoneNumber: phone, deliveryFee, selectedPlan: plan, billingCycle: cycle },
        user.id
      );
      if (plan === "free") {
        router.push(`/dashboard/${store.slug}`);
      } else {
        setCreatedStore(store);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء المتجر");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-10 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-8">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.onboarding.title}</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100">
          {t.onboarding.subtitle}
        </h1>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="flex-1 text-start leading-relaxed">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <BusinessTypeSelector value={businessType} onChange={setBusinessType} />

        <StoreIdentityFields
          nameAr={nameAr}
          setNameAr={setNameAr}
          nameEn={nameEn}
          setNameEn={setNameEn}
          slug={slug}
          setSlug={setSlug}
          slugStatus={slugStatus}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="store-phone" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 text-start">
              {t.onboarding.phone}
            </label>
            <input
              id="store-phone"
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 text-start text-sm"
            />
          </div>
          <div>
            <label htmlFor="delivery-fee" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 text-start">
              {t.onboarding.deliveryFee}
            </label>
            <input
              id="delivery-fee"
              type="number"
              min="0"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(Number(e.target.value) || 0)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 text-start text-sm"
            />
          </div>
        </div>

        <PlanSelectorCards selectedPlan={plan} billingCycle={cycle} onSelectPlan={setPlan} onToggleCycle={setCycle} />

        <Button type="submit" disabled={isSubmitting || slugStatus === "taken" || !slug} className="w-full min-h-[48px] text-sm font-bold flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{locale === "ar" ? "جارٍ إطلاق المنيو..." : "Launching..."}</span>
            </>
          ) : (
            <span>{t.onboarding.launch}</span>
          )}
        </Button>
      </form>

      {createdStore && (
        <WhatsAppPromptModal
          isOpen={!!createdStore}
          onClose={() => setCreatedStore(null)}
          storeName={locale === "ar" ? createdStore.name_ar : createdStore.name_en}
          storeSlug={createdStore.slug}
          plan={plan}
          billingCycle={cycle}
          ownerName={user?.fullName || ""}
          onContinueToDashboard={() => router.push(`/dashboard/${createdStore.slug}`)}
        />
      )}
    </div>
  );
};
