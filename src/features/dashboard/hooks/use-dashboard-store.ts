"use client";

import { useState, useMemo, useCallback } from "react";
import { useStoreAdmin } from "@/features/admin/hooks/use-store-admin";
import { QuotaService } from "@/features/subscription/services/quota-service";
import { SubscriptionPlanKey, QuotaUsage } from "@/features/subscription/types";
import { DashboardTab } from "../types";

export function useDashboardStore(slug: string) {
  const storeAdmin = useStoreAdmin(slug);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [quotaModalType, setQuotaModalType] = useState<"category" | "product">("category");

  const planKey: SubscriptionPlanKey = useMemo(() => {
    if (typeof window !== "undefined") {
      const savedPlan = window.localStorage.getItem(`store_plan_${slug}`);
      if (savedPlan === "pro" || savedPlan === "enterprise" || savedPlan === "free") {
        return savedPlan;
      }
    }
    return "free";
  }, [slug]);

  const quotaUsage: QuotaUsage = useMemo(() => {
    if (!storeAdmin.store) {
      return QuotaService.getQuotaUsage(
        { restaurant: {} as unknown as MenuDataRestaurant, categories: [] },
        planKey
      );
    }
    return QuotaService.getQuotaUsage(storeAdmin.store, planKey);
  }, [storeAdmin.store, planKey]);

  const checkCanAddCategory = useCallback((): boolean => {
    if (!storeAdmin.store) return false;
    const can = QuotaService.canAddCategory(storeAdmin.store, planKey);
    if (!can) {
      setQuotaModalType("category");
      setIsQuotaModalOpen(true);
      return false;
    }
    return true;
  }, [storeAdmin.store, planKey]);

  const checkCanAddProduct = useCallback((): boolean => {
    if (!storeAdmin.store) return false;
    const can = QuotaService.canAddProduct(storeAdmin.store, planKey);
    if (!can) {
      setQuotaModalType("product");
      setIsQuotaModalOpen(true);
      return false;
    }
    return true;
  }, [storeAdmin.store, planKey]);

  return {
    ...storeAdmin,
    activeTab: storeAdmin.activeTab as DashboardTab,
    setActiveTab: storeAdmin.setActiveTab as (tab: DashboardTab) => void,
    planKey,
    quotaUsage,
    isQuotaModalOpen,
    quotaModalType,
    setIsQuotaModalOpen,
    setQuotaModalType,
    checkCanAddCategory,
    checkCanAddProduct,
  };
}

type MenuDataRestaurant = import("@/features/menu/types").Restaurant;
