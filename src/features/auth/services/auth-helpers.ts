import { UserProfile, AUTH_STORAGE_KEY } from "../types";
import { safeLocalStorage, notifyAuthChange } from "./auth-storage";

export function toUserProfile(
  user: {
    id: string;
    email?: string | null;
    created_at?: string;
    user_metadata?: Record<string, unknown>;
  },
  profile?: {
    full_name?: string | null;
    role?: string | null;
    store_slug?: string | null;
    created_at?: string;
  } | null,
  fallbackName = ""
): UserProfile {
  return {
    id: user.id,
    email: user.email || "",
    fullName:
      profile?.full_name ||
      (user.user_metadata?.full_name as string) ||
      fallbackName,
    role:
      (profile?.role as UserProfile["role"]) ||
      (user.user_metadata?.role as UserProfile["role"]) ||
      "merchant",
    storeSlug: profile?.store_slug || null,
    createdAt:
      profile?.created_at || user.created_at || new Date().toISOString(),
  };
}

export function persistSession(profile: UserProfile): void {
  const storage = safeLocalStorage();
  if (storage) {
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
  }
  notifyAuthChange(profile);
}

export function parseAuthError(error: { message: string }): Error {
  const msg = error.message.toLowerCase();
  if (msg.includes("already registered") || msg.includes("already exists")) {
    return new Error("البريد الإلكتروني مسجل بالفعل / Email already registered");
  }
  if (
    msg.includes("password") &&
    (msg.includes("short") || msg.includes("least 6"))
  ) {
    return new Error(
      "كلمة المرور يجب أن لا تقل عن 6 أحرف / Password must be at least 6 characters"
    );
  }
  if (
    msg.includes("invalid login credentials") ||
    msg.includes("invalid credentials")
  ) {
    return new Error(
      "بيانات الدخول غير صحيحة، يرجى التحقق من البريد وكلمة المرور / Invalid login credentials"
    );
  }
  if (msg.includes("email not confirmed")) {
    return new Error(
      "يرجى تأكيد البريد الإلكتروني لتسجيل الدخول / Email not confirmed, please check your inbox"
    );
  }
  return new Error(error.message);
}
