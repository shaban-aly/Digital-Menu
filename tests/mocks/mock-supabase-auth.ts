import { vi } from "vitest";
import type * as SupabaseClientModule from "@/lib/supabase/client";

export interface MockUser {
  id: string;
  email: string;
  password?: string;
  user_metadata?: Record<string, unknown>;
  created_at: string;
}

export interface MockProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  store_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockStore {
  id: string;
  owner_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  business_type: string;
  phone_number: string;
  delivery_fee: number;
  plan: string;
  is_active: boolean;
}

const mockUsers = new Map<string, MockUser>();
const mockProfiles = new Map<string, MockProfile>();
const mockStores = new Map<string, MockStore>();
let currentSessionUser: MockUser | null = null;

export function resetMockSupabase() {
  mockUsers.clear();
  mockProfiles.clear();
  mockStores.clear();
  currentSessionUser = null;
}

export function setupMockSupabase(clientMod: typeof SupabaseClientModule) {
  vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

  vi.spyOn(clientMod.supabase.auth, "signUp").mockImplementation(
    async (credentials) => {
      const email = "email" in credentials ? credentials.email : "";
      const password = credentials.password;
      const lower = (email || "").toLowerCase();
      if (mockUsers.has(lower)) {
        return {
          data: { user: null, session: null },
          error: { message: "User already registered", name: "AuthApiError", status: 400 },
        } as unknown as ReturnType<typeof clientMod.supabase.auth.signUp>;
      }
      const id = `usr-uuid-${Math.random().toString(36).slice(2, 8)}`;
      const meta = (credentials.options?.data || {}) as Record<string, unknown>;
      const user: MockUser = {
        id, email: lower, password,
        user_metadata: meta,
        created_at: new Date().toISOString(),
      };
      mockUsers.set(lower, user);
      mockProfiles.set(id, {
        id, email: lower,
        full_name: (meta.full_name as string) || "",
        role: (meta.role as string) || "merchant",
        store_slug: null,
        created_at: user.created_at,
        updated_at: user.created_at,
      });
      currentSessionUser = user;
      return {
        data: { user, session: { access_token: "fake-jwt", user } },
        error: null,
      } as unknown as ReturnType<typeof clientMod.supabase.auth.signUp>;
    }
  );

  vi.spyOn(clientMod.supabase.auth, "signInWithPassword").mockImplementation(
    async (credentials) => {
      const email = "email" in credentials ? credentials.email : "";
      const password = credentials.password;
      const lower = (email || "").toLowerCase();
      const stored = mockUsers.get(lower);
      if (!stored || (stored.password && stored.password !== password)) {
        return {
          data: { user: null, session: null },
          error: { message: "Invalid login credentials", name: "AuthApiError", status: 400 },
        } as unknown as ReturnType<typeof clientMod.supabase.auth.signInWithPassword>;
      }
      currentSessionUser = stored;
      return {
        data: { user: stored, session: { access_token: "fake-jwt", user: stored } },
        error: null,
      } as unknown as ReturnType<typeof clientMod.supabase.auth.signInWithPassword>;
    }
  );

  vi.spyOn(clientMod.supabase.auth, "getUser").mockImplementation(async () => ({
    data: { user: currentSessionUser },
    error: null,
  } as unknown as ReturnType<typeof clientMod.supabase.auth.getUser>));

  vi.spyOn(clientMod.supabase.auth, "signOut").mockImplementation(async () => {
    currentSessionUser = null;
    return { error: null };
  });

  vi.spyOn(clientMod.supabase.auth, "onAuthStateChange").mockImplementation(() => ({
    data: { subscription: { unsubscribe: vi.fn(), id: "sub-1", callback: vi.fn() } },
  } as unknown as ReturnType<typeof clientMod.supabase.auth.onAuthStateChange>));

  vi.spyOn(clientMod.supabase, "from").mockImplementation((table: string) => {
    if (table === "profiles") {
      return {
        select: () => ({
          eq: (_col: string, val: string) => ({
            maybeSingle: async () => ({ data: mockProfiles.get(val) || null, error: null }),
          }),
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
      return {
        select: () => ({
          eq: (_col: string, val: string) => ({
            maybeSingle: async () => {
              const found = Array.from(mockStores.values()).find((s) => s.slug === val);
              return { data: found ? { id: found.id } : null, error: null };
            },
          }),
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
      } as unknown as ReturnType<typeof clientMod.supabase.from>;
    }

    return {} as unknown as ReturnType<typeof clientMod.supabase.from>;
  });
}
