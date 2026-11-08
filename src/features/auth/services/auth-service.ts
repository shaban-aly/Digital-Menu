import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  UserProfile,
  IAuthService,
  AUTH_STORAGE_KEY,
  UserRegistrationInputSchema,
  UserLoginInputSchema,
} from "../types";
import {
  safeLocalStorage,
  notifyAuthChange,
  fallbackGetUser,
  fallbackRegister,
  fallbackLogin,
  fallbackUpdateStoreSlug,
} from "./auth-storage";
import {
  toUserProfile,
  persistSession,
  parseAuthError,
} from "./auth-helpers";

export const AuthService: IAuthService = {
  async getCurrentUser(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return fallbackGetUser();
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return fallbackGetUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const userProfile = toUserProfile(user, profile);
      const storage = safeLocalStorage();
      if (storage) storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
      return userProfile;
    } catch {
      return fallbackGetUser();
    }
  },

  async register(email: string, fullName: string, password = ""): Promise<UserProfile> {
    const validated = UserRegistrationInputSchema.parse({
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      password: password || "temp123",
    });

    if (!isSupabaseConfigured()) {
      return fallbackRegister(validated.email, validated.fullName, validated.password);
    }

    const { data, error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: { data: { full_name: validated.fullName, role: "merchant" } },
    });

    if (error) throw parseAuthError(error);
    if (data.user && !data.session && data.user.identities?.length === 0) {
      throw new Error("البريد الإلكتروني مسجل بالفعل / Email already registered");
    }
    if (!data.user) throw new Error("فشل إنشاء الحساب / Registration failed");

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    const userProfile = toUserProfile(data.user, profile, validated.fullName);
    persistSession(userProfile);
    return userProfile;
  },

  async login(email: string, password = ""): Promise<UserProfile> {
    const validated = UserLoginInputSchema.parse({
      email: email.trim().toLowerCase(),
      password: password || "default",
    });

    if (!isSupabaseConfigured()) {
      return fallbackLogin(validated.email, validated.password);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) throw parseAuthError(error);
    if (!data.user) {
      throw new Error("الحساب غير موجود، يرجى التسجيل أولاً / Account not found, please register");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    const userProfile = toUserProfile(data.user, profile);
    persistSession(userProfile);
    return userProfile;
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      try { await supabase.auth.signOut(); } catch {}
    }
    const storage = safeLocalStorage();
    if (storage) storage.removeItem(AUTH_STORAGE_KEY);
    notifyAuthChange(null);
  },

  async updateUserStoreSlug(userId: string, storeSlug: string): Promise<UserProfile> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("profiles")
        .update({ store_slug: storeSlug })
        .eq("id", userId);
      if (error) {
        console.error("Failed to update store_slug in profiles table:", error);
      }
    }

    let currentUser = await this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser = { ...currentUser, storeSlug };
      persistSession(currentUser);
      return currentUser;
    }

    return fallbackUpdateStoreSlug(userId, storeSlug);
  },
};
