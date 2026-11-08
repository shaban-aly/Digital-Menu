import { Restaurant } from "@/features/menu/types";
import { AuthService } from "@/features/auth/services/auth-service";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Json } from "@/lib/supabase/types";
import {
  IOnboardingService,
  StoreOnboardingInput,
  StoreOnboardingInputSchema,
  RESERVED_SLUGS,
} from "../types";
import { buildDefaultSchedule } from "./onboarding-storage";

export const OnboardingService: IOnboardingService = {
  async getUserStore(ownerId: string): Promise<string | null> {
    if (!ownerId) return null;
    if (isSupabaseConfigured()) {
      try {
        const { data: store } = await supabase
          .from("stores")
          .select("slug")
          .eq("owner_id", ownerId)
          .maybeSingle();

        if (store?.slug) return store.slug;

        const { data: profile } = await supabase
          .from("profiles")
          .select("store_slug")
          .eq("id", ownerId)
          .maybeSingle();

        return profile?.store_slug || null;
      } catch {
        return null;
      }
    }

    try {
      const user = await AuthService.getCurrentUser();
      if (user?.id === ownerId && user.storeSlug) return user.storeSlug;
    } catch {}
    return null;
  },

  async checkSlugAvailability(slug: string): Promise<boolean> {
    const cleanSlug = slug.toLowerCase().trim();
    if (!cleanSlug || cleanSlug.length < 3 || cleanSlug.length > 50) return false;
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) return false;
    if ((RESERVED_SLUGS as readonly string[]).includes(cleanSlug)) return false;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("id")
          .eq("slug", cleanSlug)
          .maybeSingle();

        if (error) {
          console.warn("Slug check query error:", error.message);
          return false;
        }
        if (data) return false;
      } catch {
        return false;
      }
    } else {
      if (cleanSlug === "oriental-grill") return false;
    }

    return true;
  },

  async createStore(
    input: StoreOnboardingInput,
    ownerId: string
  ): Promise<Restaurant> {
    if (!ownerId) {
      throw new Error("معرف المالك مطلوب / Owner ID is required");
    }

    // 1. Strict Ownership Enforcement: 1 Account = 1 Store
    const existingSlug = await this.getUserStore(ownerId);
    if (existingSlug) {
      throw new Error(
        "حسابك مرتبط بمتجر بالفعل، لا يمكن إنشاء أكثر من متجر لكل حساب / You already have a store linked to this account"
      );
    }

    const validated = StoreOnboardingInputSchema.parse(input);
    const available = await this.checkSlugAvailability(validated.slug);
    if (!available) {
      throw new Error("رابط المتجر مستخدم بالفعل / Store slug is already taken");
    }

    const defaultSchedule = buildDefaultSchedule();
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
          currency: "EGP",
          default_language: "ar",
          schedule: defaultSchedule as unknown as Json,
          plan: validated.selectedPlan,
          supported_order_types:
            validated.businessType === "supermarket"
              ? ["delivery", "takeaway"]
              : ["dine_in", "takeaway", "delivery"],
          is_active: true,
        })
        .select()
        .single();

      if (error) throw new Error(`فشل إنشاء المتجر / Failed to create store: ${error.message}`);
      if (data?.id) storeId = data.id;

      try {
        await supabase
          .from("subscriptions")
          .update({ billing_cycle: validated.billingCycle, plan: validated.selectedPlan })
          .eq("store_id", storeId);
      } catch (subErr) {
        console.warn("Failed updating subscription billing cycle:", subErr);
      }

      try {
        await supabase.from("profiles").update({ store_slug: validated.slug }).eq("id", ownerId);
      } catch (profErr) {
        console.warn("Failed updating profile store_slug:", profErr);
      }
    }

    await AuthService.updateUserStoreSlug(ownerId, validated.slug);

    return {
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
      supported_order_types:
        validated.businessType === "supermarket"
          ? ["delivery", "takeaway"]
          : ["dine_in", "takeaway", "delivery"],
      delivery_fee: validated.deliveryFee,
      schedule: defaultSchedule,
      plan: validated.selectedPlan,
      is_active: true,
    };
  },
};
