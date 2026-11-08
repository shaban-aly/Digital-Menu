"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Calculator, TrendingUp, MessageSquare } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateSavings, buildWhatsAppInquiryUrl } from "../services/landing-data";

export const RoiCalculator: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const [orders, setOrders] = useState(400);
  const [basket, setBasket] = useState(220);
  const [rate, setRate] = useState(18);

  const { monthlyTurnover, monthlySavings, annualSavings } = useMemo(() => {
    return calculateSavings({
      monthlyOrders: orders,
      averageBasket: basket,
      aggregatorRate: rate,
    });
  }, [orders, basket, rate]);

  const whatsappUrl = buildWhatsAppInquiryUrl(
    isAr ? "منصة المنيو الرقمي" : "Digital Menu Platform",
    isAr
      ? `حسبت توفير العمولات لنشاطي بمعدل ${orders} طلب شهرياً (${formatCurrency(monthlySavings, "ar")} شهرياً)، وأود البدء فوراً.`
      : `I calculated my savings at ${orders} orders/month saving ${formatCurrency(monthlySavings, "en")}/month, and want to start.`
  );

  return (
    <section id="calculator" className="py-16 px-4 sm:px-6 bg-gradient-to-b from-brand-50/50 via-white to-white dark:from-brand-950/20 dark:via-neutral-950 dark:to-neutral-950 border-t border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-950/80 dark:text-brand-300 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>{isAr ? "حاسبة التوفير الذكية" : "Commission Savings Calculator"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
            {isAr ? "كم توفر شهرياً بالتخلص من عمولات التطبيقات؟" : "How Much Do You Save Without App Commissions?"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            {isAr
              ? "تستقطع تطبيقات التوصيل الخارجية من 15% إلى 25% من كل طلب. احسب ما يمكنك توفيره واحتفظ به في جيبك:"
              : "Third-party delivery apps cut 15% to 25% from every single order. See how much stays in your pocket with Digital Menu:"}
          </p>
        </div>

        {/* Calculator Body */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
          {/* Controls */}
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-neutral-700 dark:text-neutral-300">{isAr ? "عدد الطلبات الشهرية:" : "Monthly Orders:"}</span>
                <span className="text-brand-600 text-sm font-black">{orders} {isAr ? "طلب" : "orders"}</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={25}
                value={orders}
                onChange={(e) => setOrders(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg accent-brand-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-neutral-700 dark:text-neutral-300">{isAr ? "متوسط قيمة الطلب:" : "Average Order Value:"}</span>
                <span className="text-brand-600 text-sm font-black">{formatCurrency(basket, locale)}</span>
              </div>
              <input
                type="range"
                min={50}
                max={800}
                step={10}
                value={basket}
                onChange={(e) => setBasket(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg accent-brand-600 cursor-pointer"
              />
            </div>

            <div>
              <span className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                {isAr ? "نسبة عمولة التطبيقات المعتادة:" : "Typical App Commission Cut:"}
              </span>
              <div className="flex gap-2">
                {[15, 18, 22].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRate(r)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all min-h-[44px] cursor-pointer ${
                      rate === r
                        ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 pt-1">
              {isAr ? `إجمالي مبيعاتك الشهرية المتوقعة: ${formatCurrency(monthlyTurnover, locale)}` : `Estimated Monthly Turnover: ${formatCurrency(monthlyTurnover, locale)}`}
            </div>
          </div>

          {/* Results Card */}
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700 flex flex-col justify-between text-center">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider block">
                {isAr ? "أرباح مستردة في جيبك" : "Money Kept in Your Pocket"}
              </span>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 block">
                  {formatCurrency(monthlySavings, locale)}
                </span>
                <span className="text-xs text-neutral-500 font-bold block mt-1">
                  {isAr ? "توفير شهري مباشر" : "Direct Monthly Savings"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? "توفير سنوي يصل إلى:" : "Annual savings up to:"}</span>
                </div>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 block mt-0.5">
                  {formatCurrency(annualSavings, locale)}
                </span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isAr ? "احجز اشتراكك ووفر أرباحك الآن" : "Claim Savings via WhatsApp"}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
