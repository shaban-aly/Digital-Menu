import React from "react";
import { Utensils, Coffee, ShoppingBasket } from "lucide-react";

export interface PilotStore {
  slug: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  tag: string;
  desc: string;
}

export function getPilotStores(isAr: boolean): PilotStore[] {
  return [
    {
      slug: "oriental-grill",
      name: isAr ? "مطعم مشويات البركة" : "Al-Baraka Oriental Grill",
      type: isAr ? "مطعم مشويات ومأكولات" : "Grill Restaurant",
      icon: <Utensils className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
      tag: isAr ? "نموذج 1: مطعم" : "Model 1: Restaurant",
      desc: isAr
        ? "أطباق مشويات، مقبلات، مسببات حساسية، وطلبات صالة وسفري ودليفري."
        : "Grill platters, appetizers, allergen badges, dine-in & delivery.",
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
    },
  ];
}
