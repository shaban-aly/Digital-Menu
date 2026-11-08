import { Restaurant } from "@/features/menu/types";
import { STORES_MAP } from "@/features/menu/services/mock-menu-data";
import { AuthService } from "@/features/auth/services/auth-service";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  IOnboardingService,
  StoreOnboardingInput,
  StoreOnboardingInputSchema,
  RESERVED_SLUGS,
} from "../types";
import {
  safeLocalStorage,
  getCustomStores,
  saveCustomStores,
  buildDefaultSchedule,
} from "./onboarding-storage";

export const OnboardingService: IOnboardingService = {
  async checkSlugAvailability(slug: string): Promise<boolean> {
    const cleanSlug = slug.toLowerCase().trim();
    if (!cleanSlug || cleanSlug.length < 3 || cleanSlug.length > 50) return false;
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) return false;
    if (RESERVED_SLUGS.includes(cleanSlug as (typeof RESERVED_SLUGS)[number])) return false;
    if (STORES_MAP[cleanSlug]) return false;

    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from("stores")
          .select("id")
          .eq("slug", cleanSlug)
          .maybeSingle();
        if (data) return false;
      } catch {
        // Fallback to local check if query fails
      }
    }

    const customStores = getCustomStores();
    if (customStores.some((s) => s.slug === cleanSlug)) return false;

    const storage = safeLocalStorage();
    if (storage && storage.getItem(`store_override_${cleanSlug}`)) return false;

    return true;
  },

  async createStore(
    input: StoreOnboardingInput,
    ownerId: string
  ): Promise<Restaurant> {
    const validated = StoreOnboardingInputSchema.parse(input);
    const available = await this.checkSlugAvailability(validated.slug);
    if (!available) {
      throw new Error("رابط المتجر مستخدم بالفعل / Store slug is already taken");
    }

    let storeId = `store_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("stores")
        .insert({
          owner_id: ownerId,
          slug: validated.slug,
          name_ar: validated.nameAr.trim(),
          name_en: validated.nameEn.trim(),
          business_type: validated.businessType,
          phone_number: validated.phoneNumber.trim(),
          delivery_fee: validated.deliveryFee,
          plan: validated.selectedPlan,
          default_language: "ar",
          currency: "EGP",
          supported_order_types: ["dine_in", "takeaway", "delivery"],
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`فشل إنشاء المتجر / Failed to create store: ${error.message}`);
      }
      if (data?.id) storeId = data.id;
    }

    const newStore: Restaurant = {
      id: storeId,
      slug: validated.slug,
      name_ar: validated.nameAr.trim(),
      name_en: validated.nameEn.trim(),
      business_type: validated.businessType,
      description_ar: "",
      description_en: "",
      logo_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
      cover_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
      phone_number: validated.phoneNumber.trim(),
      default_language: "ar",
      currency: "EGP",
      supported_order_types: ["dine_in", "takeaway", "delivery"],
      delivery_fee: validated.deliveryFee,
      schedule: buildDefaultSchedule(),
    };

    STORES_MAP[validated.slug] = {
      restaurant: newStore,
      categories: [],
    };

    const customStores = getCustomStores();
    customStores.push(newStore);
    saveCustomStores(customStores);

    const storage = safeLocalStorage();
    if (storage) {
      storage.setItem(
        `store_subscription_${validated.slug}`,
        JSON.stringify({
          planKey: validated.selectedPlan,
          billingCycle: validated.billingCycle,
          createdAt: new Date().toISOString(),
        })
      );
    }

    await AuthService.updateUserStoreSlug(ownerId, validated.slug);
    return newStore;
  },
};
