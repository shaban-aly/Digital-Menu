export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: "merchant" | "superadmin";
          store_slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: "merchant" | "superadmin";
          store_slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      stores: {
        Row: {
          id: string;
          owner_id: string | null;
          slug: string;
          name_ar: string;
          name_en: string;
          business_type: "restaurant" | "cafe" | "supermarket" | "store";
          description_ar: string | null;
          description_en: string | null;
          logo_url: string | null;
          cover_url: string | null;
          phone_number: string;
          delivery_fee: number;
          currency: string;
          default_language: "ar" | "en";
          plan: "free" | "pro" | "enterprise" | "pro_monthly" | "pro_yearly";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          slug: string;
          name_ar: string;
          name_en: string;
          business_type?: "restaurant" | "cafe" | "supermarket" | "store";
          description_ar?: string | null;
          description_en?: string | null;
          logo_url?: string | null;
          cover_url?: string | null;
          phone_number?: string;
          delivery_fee?: number;
          currency?: string;
          default_language?: "ar" | "en";
          plan?: "free" | "pro" | "enterprise" | "pro_monthly" | "pro_yearly";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stores"]["Insert"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          store_id: string;
          plan: "free" | "pro" | "enterprise" | "pro_monthly" | "pro_yearly";
          billing_cycle: "monthly" | "yearly";
          status: "active" | "past_due" | "canceled" | "trialing";
          current_period_start: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          plan?: "free" | "pro" | "enterprise" | "pro_monthly" | "pro_yearly";
          billing_cycle?: "monthly" | "yearly";
          status?: "active" | "past_due" | "canceled" | "trialing";
          current_period_start?: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          store_id: string;
          name_ar: string;
          name_en: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name_ar: string;
          name_en: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          store_id: string;
          category_id: string;
          name_ar: string;
          name_en: string;
          short_desc_ar: string | null;
          short_desc_en: string | null;
          price: number;
          unit_ar: string | null;
          unit_en: string | null;
          image_url: string | null;
          display_order: number;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          category_id: string;
          name_ar: string;
          name_en: string;
          short_desc_ar?: string | null;
          short_desc_en?: string | null;
          price: number;
          unit_ar?: string | null;
          unit_en?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
