/**
 * Contracts: SaaS Multi-Tenant Platform Interfaces
 */

import {
  SubscriptionPlanKey,
  BillingCycle,
  StoreOnboardingInput,
  QuotaUsage,
  UserProfile,
} from "../data-model";
import { MenuData, Restaurant } from "@/features/menu/types";

export interface IQuotaService {
  getQuotaUsage(storeData: MenuData, planKey?: SubscriptionPlanKey): QuotaUsage;
  canAddCategory(storeData: MenuData, planKey?: SubscriptionPlanKey): boolean;
  canAddProduct(storeData: MenuData, planKey?: SubscriptionPlanKey): boolean;
}

export interface ISubscriptionService {
  buildUpgradeWhatsAppUrl(params: {
    platformPhone: string;
    storeName: string;
    storeSlug: string;
    ownerName: string;
    ownerEmail: string;
    targetPlan: SubscriptionPlanKey;
    billingCycle?: BillingCycle;
  }): string;
}

export interface IOnboardingService {
  createStore(input: StoreOnboardingInput, ownerId: string): Promise<Restaurant>;
  checkSlugAvailability(slug: string): Promise<boolean>;
}

export interface IAuthService {
  getCurrentUser(): Promise<UserProfile | null>;
  login(email: string): Promise<UserProfile>;
  register(email: string, fullName: string): Promise<UserProfile>;
  logout(): Promise<void>;
}

export interface ISuperAdminService {
  getPlatformStats(): Promise<{
    totalStores: number;
    activeStores: number;
    planBreakdown: Record<SubscriptionPlanKey, number>;
    totalProducts: number;
  }>;
  listAllStores(): Promise<Restaurant[]>;
  updateStorePlan(slug: string, plan: SubscriptionPlanKey): Promise<void>;
  toggleStoreStatus(slug: string, isActive: boolean): Promise<void>;
}
