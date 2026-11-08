import { z } from "zod";
import {
  SubscriptionPlanKeySchema,
  BillingCycleSchema,
} from "@/features/subscription/types";
import { Restaurant } from "@/features/menu/types";

export const RESERVED_SLUGS = [
  "admin",
  "dashboard",
  "menu",
  "login",
  "register",
  "onboarding",
  "pricing",
  "api",
  "auth",
  "settings",
  "superadmin",
] as const;

export const StoreOnboardingInputSchema = z.object({
  businessType: z.enum(["restaurant", "cafe", "supermarket", "store"]),
  nameAr: z.string().min(2, "الاسم بالعربية مطلوب"),
  nameEn: z.string().min(2, "English name is required"),
  slug: z
    .string()
    .min(3, "الرابط يجب أن يكون 3 أحرف على الأقل")
    .max(50, "الرابط يجب ألا يتجاوز 50 حرفاً")
    .regex(
      /^[a-z0-9-]+$/,
      "الرابط يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط"
    ),
  phoneNumber: z.string().min(7, "رقم الهاتف غير صالح"),
  deliveryFee: z.number().nonnegative().default(20),
  selectedPlan: SubscriptionPlanKeySchema.default("free"),
  billingCycle: BillingCycleSchema.default("monthly"),
});
export type StoreOnboardingInput = z.infer<typeof StoreOnboardingInputSchema>;

export interface IOnboardingService {
  createStore(
    input: StoreOnboardingInput,
    ownerId: string
  ): Promise<Restaurant>;
  checkSlugAvailability(slug: string): Promise<boolean>;
  getUserStore(ownerId: string): Promise<string | null>;
}
