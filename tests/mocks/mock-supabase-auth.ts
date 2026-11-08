import { vi } from "vitest";
import type * as SupabaseClientModule from "@/lib/supabase/client";

export interface MockStore {
  id: string; owner_id: string; slug: string; name_ar: string; name_en: string;
  business_type: string; phone_number: string; delivery_fee: number; plan: string; is_active: boolean;
  schedule?: unknown; supported_order_types?: string[]; currency?: string; default_language?: string;
}

const mockUsers = new Map<string, { id: string; email: string; password?: string }>();
const mockProfiles = new Map<string, { id: string; email: string; full_name: string; role: string; store_slug: string | null }>();
const mockStores = new Map<string, MockStore>();
let currentSessionUser: { id: string; email: string } | null = null;

function makeQuery<T>(data: T, extras: Record<string, unknown> = {}) {
  const p = Promise.resolve({ data, error: null, count: Array.isArray(data) ? data.length : 10 }) as unknown as Record<string, unknown>;
  Object.assign(p, extras);
  return p;
}

export function resetMockSupabase() {
  mockUsers.clear(); mockProfiles.clear(); mockStores.clear(); currentSessionUser = null;
  const s1: MockStore = {
    id: "11111111-0000-0000-0000-000000000001", owner_id: "11111111-1111-1111-1111-111111111111",
    slug: "oriental-grill", name_ar: "مطعم مشويات البركة", name_en: "Al-Baraka Oriental Grill",
    business_type: "restaurant", phone_number: "201012345678", delivery_fee: 25, plan: "pro_monthly", is_active: true,
    currency: "EGP", default_language: "ar", supported_order_types: ["dine_in", "takeaway", "delivery"],
  };
  const s2: MockStore = {
    id: "22222222-0000-0000-0000-000000000002", owner_id: "22222222-2222-2222-2222-222222222222",
    slug: "specialty-cafe", name_ar: "كافيه ومخبوزات أروما", name_en: "Aroma Cafe",
    business_type: "cafe", phone_number: "201012345679", delivery_fee: 15, plan: "free", is_active: true,
    currency: "EGP", default_language: "ar", supported_order_types: ["takeaway"],
  };
  const s3: MockStore = {
    id: "33333333-0000-0000-0000-000000000003", owner_id: "33333333-3333-3333-3333-333333333333",
    slug: "fresh-market", name_ar: "سوبر ماركت فريش ماركت", name_en: "Fresh Market",
    business_type: "supermarket", phone_number: "201012345680", delivery_fee: 30, plan: "enterprise", is_active: true,
    currency: "EGP", default_language: "ar", supported_order_types: ["delivery"],
  };
  mockStores.set(s1.id, s1); mockStores.set(s2.id, s2); mockStores.set(s3.id, s3);
}

export function setupMockSupabase(clientMod: typeof SupabaseClientModule) {
  vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

  vi.spyOn(clientMod.supabase.auth, "signUp").mockImplementation(async (credentials) => {
    const email = ("email" in credentials ? credentials.email : "").toLowerCase();
    if (mockUsers.has(email)) {
      return { data: { user: null, session: null }, error: { message: "User already registered", name: "AuthApiError", status: 400 } } as unknown as ReturnType<typeof clientMod.supabase.auth.signUp>;
    }
    const id = `usr-uuid-${Math.random().toString(36).slice(2, 8)}`;
    const meta = (credentials.options?.data || {}) as Record<string, unknown>;
    const user = { id, email, password: credentials.password };
    mockUsers.set(email, user);
    mockProfiles.set(id, { id, email, full_name: (meta.full_name as string) || "", role: (meta.role as string) || "merchant", store_slug: null });
    currentSessionUser = user;
    return { data: { user, session: { access_token: "fake-jwt", user } }, error: null } as unknown as ReturnType<typeof clientMod.supabase.auth.signUp>;
  });

  vi.spyOn(clientMod.supabase.auth, "signInWithPassword").mockImplementation(async (credentials) => {
    const email = ("email" in credentials ? credentials.email : "").toLowerCase();
    const stored = mockUsers.get(email);
    if (!stored || (stored.password && stored.password !== credentials.password)) {
      return { data: { user: null, session: null }, error: { message: "Invalid login credentials", name: "AuthApiError", status: 400 } } as unknown as ReturnType<typeof clientMod.supabase.auth.signInWithPassword>;
    }
    currentSessionUser = stored;
    return { data: { user: stored, session: { access_token: "fake-jwt", user: stored } }, error: null } as unknown as ReturnType<typeof clientMod.supabase.auth.signInWithPassword>;
  });

  vi.spyOn(clientMod.supabase.auth, "getUser").mockImplementation(async () => ({
    data: { user: currentSessionUser }, error: null,
  } as unknown as ReturnType<typeof clientMod.supabase.auth.getUser>));

  vi.spyOn(clientMod.supabase.auth, "signOut").mockImplementation(async () => { currentSessionUser = null; return { error: null }; });
  vi.spyOn(clientMod.supabase.auth, "onAuthStateChange").mockImplementation(() => ({
    data: { subscription: { unsubscribe: vi.fn(), id: "sub-1", callback: vi.fn() } },
  } as unknown as ReturnType<typeof clientMod.supabase.auth.onAuthStateChange>));

  vi.spyOn(clientMod.supabase, "from").mockImplementation((table: string) => {
    if (table === "profiles") {
      return {
        select: () => makeQuery(Array.from(mockProfiles.values()), {
          eq: (_col: string, val: string) => ({ maybeSingle: async () => ({ data: mockProfiles.get(val) || null, error: null }) }),
        }),
        update: (updates: { store_slug?: string }) => ({
          eq: (_col: string, val: string) => {
            const p = mockProfiles.get(val);
            if (p && updates.store_slug !== undefined) p.store_slug = updates.store_slug;
            return Promise.resolve({ data: p, error: null });
          },
        }),
      } as unknown as ReturnType<typeof clientMod.supabase.from>;
    }

    if (table === "stores") {
      const allStores = () => Array.from(mockStores.values());
      return {
        select: () => makeQuery(allStores(), {
          order: () => Promise.resolve({ data: allStores(), error: null }),
          eq: (col: string, val: unknown) => {
            if (col === "is_active") {
              const active = allStores().filter((s) => s.is_active === Boolean(val));
              return Promise.resolve({ data: active, error: null });
            }
            return {
              maybeSingle: async () => {
                const found = allStores().find((s) => (col === "slug" ? s.slug === val : s.owner_id === val));
                return { data: found || null, error: null };
              },
            };
          },
        }),
        insert: (record: Record<string, unknown>) => ({
          select: () => ({
            single: async () => {
              const id = `store-uuid-${Math.random().toString(36).slice(2, 8)}`;
              const created = { ...record, id } as MockStore;
              mockStores.set(id, created);
              return { data: created, error: null };
            },
          }),
        }),
        update: (updates: Record<string, unknown>) => ({
          eq: (_col: string, slug: string) => {
            const found = allStores().find((s) => s.slug === slug);
            if (found) Object.assign(found, updates);
            return Promise.resolve({ data: found || null, error: null });
          },
        }),
      } as unknown as ReturnType<typeof clientMod.supabase.from>;
    }

    if (table === "categories") {
      const mockCats = [
        { id: "cat-1", store_id: "11111111-0000-0000-0000-000000000001", name_ar: "مشويات", name_en: "Grills", display_order: 1, is_active: true },
        { id: "cat-2", store_id: "11111111-0000-0000-0000-000000000001", name_ar: "مقبلات", name_en: "Appetizers", display_order: 2, is_active: true },
      ];
      return {
        select: () => makeQuery(mockCats, {
          eq: () => ({ order: () => Promise.resolve({ data: mockCats, error: null }) }),
        }),
        upsert: () => Promise.resolve({ data: null, error: null }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      } as unknown as ReturnType<typeof clientMod.supabase.from>;
    }

    if (table === "products") {
      const mockProds = [
        { id: "prod-1", store_id: "11111111-0000-0000-0000-000000000001", category_id: "cat-1", name_ar: "كباب", name_en: "Kebab", price: 150, is_available: true, display_order: 1 },
        { id: "prod-2", store_id: "11111111-0000-0000-0000-000000000001", category_id: "cat-2", name_ar: "حمص", name_en: "Hummus", price: 40, is_available: true, display_order: 2 },
      ];
      return {
        select: (_cols?: string, opts?: { count?: string; head?: boolean }) => {
          if (opts?.count === "exact") return Promise.resolve({ count: 10, error: null });
          return makeQuery(mockProds, {
            eq: () => ({ order: () => Promise.resolve({ data: mockProds, error: null }) }),
          });
        },
        upsert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      } as unknown as ReturnType<typeof clientMod.supabase.from>;
    }

    if (table === "subscriptions") {
      const subs = [{ store_id: "11111111-0000-0000-0000-000000000001", price_egp: 250, plan: "pro" }];
      return {
        select: () => makeQuery(subs),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      } as unknown as ReturnType<typeof clientMod.supabase.from>;
    }

    return {} as unknown as ReturnType<typeof clientMod.supabase.from>;
  });
}
