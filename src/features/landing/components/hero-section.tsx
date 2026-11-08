"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Utensils,
  Coffee,
  ShoppingBasket,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { buildWhatsAppInquiryUrl } from "../services/landing-data";

export const HeroSection: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const valuePills = isAr
    ? ["0% عمولة على المبيعات", "طلبات واتساب مفصلة فورية", "جاهز للعمل دون تطبيقات"]
    : ["0% Commission on Sales", "Instant Structured WhatsApp Orders", "No App Download Required"];

  const pilotStores = [
    {
      slug: "oriental-grill",
      name: isAr ? "مطعم مشويات البركة" : "Al-Baraka Oriental Grill",
      type: isAr ? "مطعم مشويات ومأكولات" : "Grill Restaurant",
      icon: <Utensils className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
      tag: isAr ? "نموذج 1: مطعم" : "Model 1: Restaurant",
      desc: isAr
        ? "أطباق مشويات، مقبلات، مسببات حساسية، وطلبات صالة وسفري ودليفري."
        : "Grill platters, appetizers, allergen badges, dine-in & delivery.",
      gradient: "from-amber-500/10 via-brand-500/5 to-transparent",
    },
    {
      slug: "specialty-cafe",
      name: isAr ? "كافيه ومخبوزات أروما" : "Aroma Specialty Café",
      type: isAr ? "كافيه ومخبوزات" : "Café & Bakery",
      icon: <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      tag: isAr ? "نموذج 2: كافيه" : "Model 2: Café",
      desc: isAr
        ? "أحجام أكواب القهوة (350 مل)، حلويات بالقطعة، وسرعة استلام التيك أواي."
        : "Coffee cup sizes, pastries by piece, and rapid counter takeaway.",
      gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    },
    {
      slug: "fresh-market",
      name: isAr ? "سوبر ماركت فريش ماركت" : "Fresh Market Supermarket",
      type: isAr ? "سوبر ماركت وبقالة" : "Supermarket",
      icon: <ShoppingBasket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      tag: isAr ? "نموذج 3: سوبر ماركت" : "Model 3: Supermarket",
      desc: isAr
        ? "بيع بالكيلوجرام واللتر والعبوة، مع حصر الطلب في التوصيل والاستلام فقط."
        : "Sell by kg, liter, and pack with automated delivery & pickup.",
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    },
  ];

  const trialUrl = buildWhatsAppInquiryUrl(
    isAr ? "منصة المنيو الرقمي" : "Digital Menu Platform",
    isAr ? "أود تجربة المنصة مجاناً لمتجري" : "I would like to start a free trial"
  );

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden w-full max-w-full">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/60 text-xs font-bold text-brand-700 dark:text-brand-300 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? "منصة المنيو الرقمي والطلب المباشر" : "Next-Gen Direct Ordering Platform"}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight leading-tight max-w-3xl mx-auto break-words">
          {isAr ? (
            <>
              استقبل طلباتك مباشرة على واتساب{" "}
              <span className="text-brand-600 dark:text-brand-400">بدون عمولات</span>
            </>
          ) : (
            <>
              Receive Direct Orders on WhatsApp{" "}
              <span className="text-brand-600 dark:text-brand-400">With 0% Commission</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? "نظام رقمي موحد ومصمم خصيصاً للمطاعم والكافيهات ومحلات البقالة في العالم العربي. تخلص من استقطاعات التطبيقات الوسيطة وامتلك علاقة مباشرة مع زبائنك."
            : "A unified digital menu system tailored for restaurants, cafes, and supermarkets. Eliminate aggregator commissions and build direct relationships with your customers."}
        </p>

        {/* Value Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {valuePills.map((pill) => (
            <div
              key={pill}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{pill}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full max-w-md mx-auto sm:max-w-none">
          <a
            href={trialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all min-h-[48px]"
          >
            <span>{isAr ? "ابدأ تجربتك المجانية" : "Start Free Trial"}</span>
            <ArrowIcon className="w-4 h-4" />
          </a>
          <a
            href="#models"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-bold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all min-h-[48px]"
          >
            <span>{isAr ? "تصفح النماذج التجريبية الحية" : "Explore Live Pilot Demos"}</span>
          </a>
        </div>

        {/* Pilot Models Grid Header */}
        <div id="models" className="pt-14 pb-2 text-start">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {isAr ? "نماذج حية جاهزة للتجربة الفورية" : "Live Models Ready for Instant Testing"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? "اضغط على أي نشاط لتجربة منيو حقيقي وسلة طلبات متكاملة:"
              : "Click any model below to experience its live menu and interactive cart:"}
          </p>
        </div>

        {/* Pilot Models 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-start">
          {pilotStores.map((store) => (
            <Link
              key={store.slug}
              href={`/menu/${store.slug}`}
              className="group relative p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:scale-105 transition-transform">
                    {store.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                    {store.tag}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {store.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                  {store.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                <span>{isAr ? "فتح المنيو التجريبي" : "Open Live Menu"}</span>
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
