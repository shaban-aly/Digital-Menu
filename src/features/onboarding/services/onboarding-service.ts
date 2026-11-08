import { Restaurant } from "@/features/menu/types";
import { STORES_MAP } from "@/features/menu/services/mock-menu-data";
import { AuthService } from "@/features/auth/services/auth-service";
import {
  IOnboardingService,
  StoreOnboardingInput,
  StoreOnboardingInputSchema,
  CUSTOM_STORES_STORAGE_KEY,
  RESERVED_SLUGS,
} from "../types";

function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getCustomStores(): Restaurant[] {
  const storage = safeLocalStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(CUSTOM_STORES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomStores(stores: Restaurant[]) {
  const storage = safeLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(CUSTOM_STORES_STORAGE_KEY, JSON.stringify(stores));
  } catch (e) {
    console.error("Failed to save custom stores", e);
  }
}

function buildDefaultSchedule() {
  const times = [
    { day: 0, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 1, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 2, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 3, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 4, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 5, is_enabled: true, open_time: "13:00", close_time: "23:00" },
    { day: 6, is_enabled: true, open_time: "10:00", close_time: "23:00" },
  ];
  return {
    timezone: "Africa/Cairo",
    allow_preorders: true,
    is_manually_paused: false,
    pause_note_ar: "",
    pause_note_en: "",
    weekly_schedule: times,
  };
}

export const OnboardingService: IOnboardingService = {
  async checkSlugAvailability(slug: string): Promise<boolean> {
    const cleanSlug = slug.toLowerCase().trim();
    if (!cleanSlug || cleanSlug.length < 3 || cleanSlug.length > 50) {
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      return false;
    }
    if (RESERVED_SLUGS.includes(cleanSlug as (typeof RESERVED_SLUGS)[number])) {
      return false;
    }
    if (STORES_MAP[cleanSlug]) {
      return false;
    }

    const customStores = getCustomStores();
    if (customStores.some((s) => s.slug === cleanSlug)) {
      return false;
    }

    const storage = safeLocalStorage();
    if (storage && storage.getItem(`store_override_${cleanSlug}`)) {
      return false;
    }

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

    const newStore: Restaurant = {
      id: `store_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      slug: validated.slug,
      name_ar: validated.nameAr.trim(),
      name_en: validated.nameEn.trim(),
      business_type: validated.businessType,
      description_ar: "",
      description_en: "",
      logo_url:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
      cover_url:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
      phone_number: validated.phoneNumber.trim(),
      default_language: "ar",
      currency: "EGP",
      supported_order_types: ["dine_in", "takeaway", "delivery"],
      delivery_fee: validated.deliveryFee,
      schedule: buildDefaultSchedule(),
    };

    // Register into memory store map
    STORES_MAP[validated.slug] = {
      restaurant: newStore,
      categories: [],
    };

    // Persist to custom stores
    const customStores = getCustomStores();
    customStores.push(newStore);
    saveCustomStores(customStores);

    // Save subscription metadata
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

    // Link 1:1 store slug to user profile
    await AuthService.updateUserStoreSlug(ownerId, validated.slug);

    return newStore;
  },
};
