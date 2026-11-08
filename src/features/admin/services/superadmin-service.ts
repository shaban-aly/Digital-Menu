import { supabase } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";
import { SuperAdminStoreSummary, PlatformKPIs, SuperAdminPlanKey } from "../types";

export const STORE_UPDATED_EVENT = "digital_menu_store_updated";
const activeStatusMap = new Map<string, boolean>();

function getClient() {
  return supabase;
}

export const SuperAdminService = {
  isStoreActive: (slug: string): boolean => activeStatusMap.get(slug) ?? true,

  async isCurrentUserSuperAdmin(): Promise<boolean> {
    const { data: { user } } = await getClient().auth.getUser();
    if (!user) return false;
    const { data: profile } = await getClient().from("profiles").select("role").eq("id", user.id).maybeSingle();
    return profile?.role === "superadmin";
  },

  async listAllStores(): Promise<SuperAdminStoreSummary[]> {
    const client = getClient();
    const [{ data: stores }, { data: profiles }, { data: subscriptions }, { data: products }, { data: categories }] =
      await Promise.all([
        client.from("stores").select("*").order("created_at", { ascending: false }),
        client.from("profiles").select("id, full_name, email, phone"),
        client.from("subscriptions").select("*"),
        client.from("products").select("id, store_id"),
        client.from("categories").select("id, store_id"),
      ]);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
    const subMap = new Map((subscriptions || []).map((s) => [s.store_id, s]));
    const prodCountMap = new Map<string, number>();
    for (const p of products || []) prodCountMap.set(p.store_id, (prodCountMap.get(p.store_id) || 0) + 1);
    const catCountMap = new Map<string, number>();
    for (const c of categories || []) catCountMap.set(c.store_id, (catCountMap.get(c.store_id) || 0) + 1);

    return (stores || []).map((store) => {
      activeStatusMap.set(store.slug, store.is_active);
      const owner = store.owner_id ? profileMap.get(store.owner_id) : undefined;
      const sub = subMap.get(store.id);
      return {
        id: store.id,
        slug: store.slug,
        name_ar: store.name_ar,
        name_en: store.name_en,
        business_type: store.business_type,
        phone_number: store.phone_number,
        plan: (store.plan || "free") as SuperAdminPlanKey,
        is_active: store.is_active,
        productsCount: prodCountMap.get(store.id) || 0,
        categoriesCount: catCountMap.get(store.id) || 0,
        owner_name: owner?.full_name,
        owner_email: owner?.email,
        subscription_price: sub ? Number(sub.price_egp) : undefined,
      };
    });
  },

  async getPlatformStats(): Promise<PlatformKPIs> {
    const client = getClient();
    const [{ data: stores }, { count: totalProductsCount }, { data: subscriptions }] = await Promise.all([
      client.from("stores").select("plan, is_active"),
      client.from("products").select("id", { count: "exact", head: true }),
      client.from("subscriptions").select("price_egp"),
    ]);

    const storeList = stores || [];
    const planBreakdown = { free: 0, pro: 0, enterprise: 0 };
    for (const store of storeList) {
      if (store.plan === "free") planBreakdown.free += 1;
      else if (store.plan === "enterprise") planBreakdown.enterprise += 1;
      else planBreakdown.pro += 1;
    }

    return {
      totalStores: storeList.length,
      activeStores: storeList.filter((s) => s.is_active).length,
      monthlyRevenue: (subscriptions || []).reduce((sum, s) => sum + Number(s.price_egp || 0), 0),
      planBreakdown,
      totalProducts: totalProductsCount ?? 0,
    };
  },

  async updateStorePlan(slug: string, plan: SuperAdminPlanKey): Promise<void> {
    const client = getClient();
    const { data: store } = await client.from("stores").select("id").eq("slug", slug).maybeSingle();
    await client.from("stores").update({ plan: plan as Database["public"]["Tables"]["stores"]["Row"]["plan"] }).eq("slug", slug);

    if (store?.id) {
      const isYearly = plan === "pro_yearly";
      const isPro = plan === "pro" || plan === "pro_monthly" || isYearly;
      await client.from("subscriptions").update({
        plan: plan as Database["public"]["Tables"]["subscriptions"]["Row"]["plan"],
        billing_cycle: isYearly ? "yearly" : "monthly",
        price_egp: isYearly ? 2500 : isPro ? 250 : 0,
        max_categories: plan === "enterprise" ? -1 : isPro ? 50 : 7,
        max_products: plan === "enterprise" ? -1 : isPro ? 500 : 50,
      }).eq("store_id", store.id);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT, { detail: { slug } }));
    }
  },

  async toggleStoreStatus(slug: string, isActive: boolean): Promise<void> {
    activeStatusMap.set(slug, isActive);
    await getClient().from("stores").update({ is_active: isActive }).eq("slug", slug);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT, { detail: { slug } }));
    }
  },

  filterStores(stores: SuperAdminStoreSummary[], query: string): SuperAdminStoreSummary[] {
    const q = query.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter((s) => s.slug.toLowerCase().includes(q) || s.name_ar.toLowerCase().includes(q) || s.name_en.toLowerCase().includes(q));
  },
};
