export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type BusinessType = "restaurant" | "cafe" | "supermarket" | "store";
export type PlanTier = "free" | "pro" | "enterprise" | "pro_monthly" | "pro_yearly";
export type BillingCycle = "monthly" | "yearly";
export type UserRole = "merchant" | "superadmin";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; email: string; full_name: string; phone: string | null;
          role: UserRole; store_slug: string | null; created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; email: string; full_name?: string; phone?: string | null;
          role?: UserRole; store_slug?: string | null; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      stores: {
        Row: {
          id: string; owner_id: string | null; slug: string; name_ar: string; name_en: string;
          business_type: BusinessType; description_ar: string | null; description_en: string | null;
          logo_url: string | null; cover_url: string | null; phone_number: string;
          delivery_fee: number; currency: string; default_language: "ar" | "en";
          supported_order_types: string[]; plan: PlanTier; is_active: boolean;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; owner_id?: string | null; slug: string; name_ar: string; name_en: string;
          business_type?: BusinessType; description_ar?: string | null; description_en?: string | null;
          logo_url?: string | null; cover_url?: string | null; phone_number?: string;
          delivery_fee?: number; currency?: string; default_language?: "ar" | "en";
          supported_order_types?: string[]; plan?: PlanTier; is_active?: boolean;
          created_at?: string; updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stores"]["Insert"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string; store_id: string; plan: PlanTier; billing_cycle: BillingCycle;
          max_categories: number; max_products: number; price_egp: number; is_active: boolean;
          status: "active" | "past_due" | "canceled" | "trialing";
          current_period_start: string; current_period_end: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; store_id: string; plan?: PlanTier; billing_cycle?: BillingCycle;
          max_categories?: number; max_products?: number; price_egp?: number; is_active?: boolean;
          status?: "active" | "past_due" | "canceled" | "trialing";
          current_period_start?: string; current_period_end?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string; store_id: string; name_ar: string; name_en: string;
          display_order: number; is_active: boolean; created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; store_id: string; name_ar: string; name_en: string;
          display_order?: number; is_active?: boolean; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string; store_id: string; category_id: string; name_ar: string; name_en: string;
          short_desc_ar: string | null; short_desc_en: string | null;
          full_desc_ar: string | null; full_desc_en: string | null; price: number;
          unit_ar: string | null; unit_en: string | null; image_url: string | null;
          display_order: number; is_available: boolean; badges: string[]; allergens: string[];
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; store_id: string; category_id: string; name_ar: string; name_en: string;
          short_desc_ar?: string | null; short_desc_en?: string | null;
          full_desc_ar?: string | null; full_desc_en?: string | null; price: number;
          unit_ar?: string | null; unit_en?: string | null; image_url?: string | null;
          display_order?: number; is_available?: boolean; badges?: string[]; allergens?: string[];
          created_at?: string; updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_superadmin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}
