import { z } from "zod";

export const UserRoleSchema = z.enum(["merchant", "superadmin"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserProfileSchema = z.object({
  id: z.string().min(1),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  fullName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  role: UserRoleSchema.default("merchant"),
  storeSlug: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UserRegistrationInputSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  fullName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  password: z.string().min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف"),
});
export type UserRegistrationInput = z.infer<typeof UserRegistrationInputSchema>;

export const UserLoginInputSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
export type UserLoginInput = z.infer<typeof UserLoginInputSchema>;

export interface StoredUserAccount extends UserProfile {
  passwordHash?: string;
}

export interface IAuthService {
  getCurrentUser(): Promise<UserProfile | null>;
  login(email: string, password?: string): Promise<UserProfile>;
  register(email: string, fullName: string, password?: string): Promise<UserProfile>;
  logout(): Promise<void>;
  updateUserStoreSlug(userId: string, storeSlug: string): Promise<UserProfile>;
}

export const AUTH_STORAGE_KEY = "digital_menu_auth_user";
export const USERS_STORAGE_KEY = "digital_menu_users";
export const AUTH_STATE_CHANGED_EVENT = "digital_menu_auth_changed";
