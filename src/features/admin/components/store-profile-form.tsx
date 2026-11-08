import React, { useState, useEffect } from "react";
import { Restaurant, StoreOrderType } from "@/features/menu/types";
import { Locale } from "@/types";
import { StoreSettings } from "../types";
import { Save, RotateCcw } from "lucide-react";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface StoreProfileFormProps {
  restaurant: Restaurant;
  locale: Locale;
  onSave: (settings: Partial<StoreSettings>) => Promise<boolean>;
  onOpenResetConfirm: () => void;
}

export const StoreProfileForm: React.FC<StoreProfileFormProps> = ({
  restaurant,
  locale,
  onSave,
  onOpenResetConfirm,
}) => {
  const t = locale === "ar" ? arTranslations.admin : enTranslations.admin;
  const tCart = locale === "ar" ? arTranslations.cart : enTranslations.cart;

  const [phone, setPhone] = useState(restaurant.phone_number);
  const [deliveryFee, setDeliveryFee] = useState(String(restaurant.delivery_fee));
  const [orderTypes, setOrderTypes] = useState<StoreOrderType[]>(restaurant.supported_order_types);
  const [logoUrl, setLogoUrl] = useState(restaurant.logo_url || "");
  const [coverUrl, setCoverUrl] = useState(restaurant.cover_url || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPhone(restaurant.phone_number);
    setDeliveryFee(String(restaurant.delivery_fee));
    setOrderTypes(restaurant.supported_order_types);
    setLogoUrl(restaurant.logo_url || "");
    setCoverUrl(restaurant.cover_url || "");
  }, [restaurant]);

  const toggleOrderType = (type: StoreOrderType) => {
    if (orderTypes.includes(type)) {
      if (orderTypes.length === 1) return;
      setOrderTypes(orderTypes.filter((t) => t !== type));
    } else {
      setOrderTypes([...orderTypes, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({
      phone_number: phone.trim(),
      delivery_fee: Math.max(0, parseFloat(deliveryFee) || 0),
      supported_order_types: orderTypes,
      logo_url: logoUrl,
      cover_url: coverUrl,
    });
    setIsSaving(false);
  };

  const inputCls =
    "w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium";

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
      <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{t.settings.title}</h3>

      <div className="space-y-3 pt-1 border-t border-neutral-100 dark:border-neutral-800">
        <div className="text-start">
          <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-200">{t.settings.branding}</h4>
          <p className="text-[11px] text-neutral-400 mt-0.5">{t.settings.brandingDesc}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUploadField
            value={logoUrl}
            onChange={setLogoUrl}
            folder="logos"
            storeSlug={restaurant.slug}
            label={t.settings.logoLabel}
            helperText={t.settings.logoHelper}
            aspectRatio="square"
          />
          <ImageUploadField
            value={coverUrl}
            onChange={setCoverUrl}
            folder="covers"
            storeSlug={restaurant.slug}
            label={t.settings.coverLabel}
            helperText={t.settings.coverHelper}
            aspectRatio="cover"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.settings.phone} *</label>
        <input data-testid="settings-phone-input" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
        <p className="text-[11px] text-neutral-400">{t.settings.phoneHint}</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.settings.deliveryFee} *</label>
        <input data-testid="settings-delivery-fee-input" type="number" step="any" min="0" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className={inputCls} />
      </div>

      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.settings.supportedOrders}</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(["dine_in", "takeaway", "delivery"] as StoreOrderType[]).map((type) => (
            <label
              key={type}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none",
                orderTypes.includes(type)
                  ? "bg-brand-50/70 border-brand-300 text-brand-700 dark:bg-brand-950/40 dark:border-brand-800 dark:text-brand-300"
                  : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-neutral-500"
              )}
            >
              <input
                type="checkbox"
                data-testid={`order-type-checkbox-${type}`}
                checked={orderTypes.includes(type)}
                onChange={() => toggleOrderType(type)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>
                {type === "dine_in" && tCart.dineIn}
                {type === "takeaway" && tCart.takeaway}
                {type === "delivery" && tCart.delivery}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <button
          type="button"
          data-testid="reset-defaults-btn"
          onClick={onOpenResetConfirm}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.settings.resetDefaults}</span>
        </button>

        <button
          type="submit"
          data-testid="save-settings-btn"
          disabled={isSaving}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{t.settings.save}</span>
        </button>
      </div>
    </form>
  );
};
