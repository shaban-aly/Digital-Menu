"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { ShoppingBag, Plus, Minus, Smartphone } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SimItem {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  unit_ar?: string;
  unit_en?: string;
  desc_ar: string;
  desc_en: string;
}

export const PhoneSimulator: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState<"restaurant" | "cafe" | "supermarket">("restaurant");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const sampleCatalog: Record<string, { store_ar: string; store_en: string; items: SimItem[] }> = {
    restaurant: {
      store_ar: "مطعم مشويات البركة",
      store_en: "Al-Baraka Oriental Grill",
      items: [
        { id: "r1", name_ar: "كباب وكفتة مشوي", name_en: "Mixed Kebab & Kofta", price: 180, desc_ar: "لحم بلدي متبل على الفحم", desc_en: "Charcoal grilled prime meat" },
        { id: "r2", name_ar: "شيش طاووق متبل", name_en: "Shish Tawook", price: 130, desc_ar: "صدور دجاج متبلة بالأعشاب", desc_en: "Herb marinated chicken breast" },
        { id: "r3", name_ar: "طاجن بامية باللحم", name_en: "Okra Tagine with Meat", price: 160, desc_ar: "مطبوخ في الفرن الفخاري", desc_en: "Oven baked clay pot tagine" },
      ],
    },
    cafe: {
      store_ar: "كافيه ومخبوزات أروما",
      store_en: "Aroma Specialty Café",
      items: [
        { id: "c1", name_ar: "سبانش لاتيه مثلج", name_en: "Iced Spanish Latte", price: 65, unit_ar: "350 مل", unit_en: "350 ml", desc_ar: "إسبريسو مع حليب مكثف", desc_en: "Espresso with condensed milk" },
        { id: "c2", name_ar: "كرواسون زبدة فرنسي", name_en: "French Butter Croissant", price: 45, unit_ar: "قطعة", unit_en: "piece", desc_ar: "مخبوز طازج يومياً", desc_en: "Freshly baked daily" },
        { id: "c3", name_ar: "كيك شوكولاتة فادج", name_en: "Fudge Chocolate Cake", price: 55, unit_ar: "شريحة", unit_en: "slice", desc_ar: "شوكولاتة بلجيكية غنية", desc_en: "Rich Belgian chocolate" },
      ],
    },
    supermarket: {
      store_ar: "سوبر ماركت فريش ماركت",
      store_en: "Fresh Market Supermarket",
      items: [
        { id: "s1", name_ar: "أرز مصري ممتاز", name_en: "Premium Egyptian Rice", price: 34, unit_ar: "1 كجم", unit_en: "1 kg", desc_ar: "حبة عريضة منقى ومعبأ", desc_en: "High grade cleaned grains" },
        { id: "s2", name_ar: "حليب طازج كامل الدسم", name_en: "Full Cream Fresh Milk", price: 42, unit_ar: "1 لتر", unit_en: "1 Liter", desc_ar: "طبيعي 100% مبستر", desc_en: "100% natural pasteurized" },
        { id: "s3", name_ar: "جبنة فيتا طبيعية", name_en: "Natural Feta Cheese", price: 85, unit_ar: "500 جم", unit_en: "500g", desc_ar: "قليلة الملح طازجة", desc_en: "Low salt fresh cheese" },
      ],
    },
  };

  const currentStore = sampleCatalog[activeTab];
  const items = currentStore.items;

  const handleUpdate = (id: string, delta: number) => {
    setQuantities((prev) => {
      const cur = prev[id] || 0;
      const next = Math.max(0, Math.min(20, cur + delta));
      return { ...prev, [id]: next };
    });
  };

  const totalCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = items.reduce((sum, it) => sum + (quantities[it.id] || 0) * it.price, 0);

  return (
    <section className="py-12 px-4 sm:px-6 bg-neutral-100/60 dark:bg-neutral-900/40 border-y border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Descriptive Text Left / Start */}
        <div className="lg:w-1/2 space-y-4 text-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isAr ? "محاكي الموبايل التفاعلي" : "Interactive Live Phone Simulator"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
            {isAr ? "جرب بنفسك كيف يطلب زبائنك في ثوانٍ" : "Test How Your Customers Order in Seconds"}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {isAr
              ? "اختر نشاطك التجاري واضغط على (+) لإضافة الأصناف ومراقبة تفاعل السلة الفوري داخل شاشة الموبايل الحية دون تحميل أي تطبيقات."
              : "Select a business model, tap (+) to add items, and watch the responsive bottom cart calculate totals inside this live interactive phone frame."}
          </p>

          <div className="flex gap-2 p-1.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 w-full max-w-md">
            {[
              { id: "restaurant", label: isAr ? "مطعم" : "Restaurant" },
              { id: "cafe", label: isAr ? "كافيه" : "Café" },
              { id: "supermarket", label: isAr ? "سوبر ماركت" : "Market" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id as typeof activeTab); setQuantities({}); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Smartphone Mockup */}
        <div className="lg:w-1/2 flex justify-center w-full">
          <div className="w-full max-w-[310px] sm:max-w-[330px] rounded-[40px] sm:rounded-[44px] bg-neutral-900 p-2.5 sm:p-3 shadow-2xl border-4 border-neutral-800 mx-auto">
            {/* Phone Screen */}
            <div className="relative rounded-[32px] sm:rounded-[36px] bg-white dark:bg-neutral-950 overflow-hidden flex flex-col h-[500px] sm:h-[520px] text-start border border-neutral-200 dark:border-neutral-800">
              {/* Notch */}
              <div className="w-28 h-4 bg-neutral-900 rounded-b-xl mx-auto mb-2 shrink-0" />

              {/* Header */}
              <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
                <span className="text-[10px] font-bold text-brand-600 block">● {isAr ? "مفتوح الآن" : "Open Now"}</span>
                <h4 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100 truncate">
                  {isAr ? currentStore.store_ar : currentStore.store_en}
                </h4>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-20">
                {items.map((it) => {
                  const qty = quantities[it.id] || 0;
                  const unit = isAr ? it.unit_ar : it.unit_en;
                  return (
                    <div key={it.id} className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">{isAr ? it.name_ar : it.name_en}</h5>
                          {unit && <span className="text-[10px] text-neutral-500">({unit})</span>}
                        </div>
                        <p className="text-[10px] text-neutral-500 truncate mt-0.5">{isAr ? it.desc_ar : it.desc_en}</p>
                        <span className="text-xs font-black text-brand-700 dark:text-brand-400 mt-1 block">{formatCurrency(it.price, locale)}</span>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-white dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        {qty > 0 && (
                          <>
                            <button type="button" onClick={() => handleUpdate(it.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{qty}</span>
                          </>
                        )}
                        <button type="button" onClick={() => handleUpdate(it.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-brand-600 text-white text-xs font-bold">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Bottom Cart Bar inside Simulator */}
              {totalCount > 0 && (
                <div className="absolute bottom-3 inset-x-3 bg-brand-600 text-white p-2.5 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-bottom duration-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/20 text-xs font-bold flex items-center justify-center">{totalCount}</span>
                    <span className="text-xs font-bold">{isAr ? "عرض السلة" : "View Cart"}</span>
                  </div>
                  <span className="text-xs font-black">{formatCurrency(totalPrice, locale)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
