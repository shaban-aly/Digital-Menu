"use client";

import { useState, useEffect, useCallback } from "react";
import { MenuData, MenuItem, CategoryWithItems, Restaurant } from "@/features/menu/types";
import { StoreRepository, STORE_UPDATED_EVENT } from "../services/store-repository";
import { AdminActiveTab, StoreSettings } from "../types";

export function useStoreAdmin(slug: string) {
  const [store, setStore] = useState<MenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminActiveTab>("items");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadStore = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await StoreRepository.getStore(slug);
      if (!data) {
        setError(`Store "${slug}" not found`);
      } else {
        setStore(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed loading store");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadStore();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug: string }>;
      if (!customEvent.detail || customEvent.detail.slug === slug) {
        loadStore();
      }
    };

    window.addEventListener(STORE_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(STORE_UPDATED_EVENT, handleUpdate);
  }, [loadStore, slug]);

  const toggleItemAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await StoreRepository.toggleItemAvailability(slug, itemId, newStatus);
      showNotification(newStatus ? "تم تفعيل الصنف للطلب" : "تم تعطيل الصنف (غير متوفر)", "success");
      await loadStore();
    } catch {
      showNotification("فشل تحديث حالة الصنف", "error");
    }
  };

  const saveItem = async (itemData: Partial<MenuItem> & { name_ar: string; name_en: string; price: number; category_id: string }) => {
    try {
      await StoreRepository.saveMenuItem(slug, itemData);
      showNotification("تم حفظ الصنف بنجاح", "success");
      await loadStore();
      return true;
    } catch {
      showNotification("فشل حفظ الصنف", "error");
      return false;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await StoreRepository.deleteMenuItem(slug, itemId);
      showNotification("تم حذف الصنف", "success");
      await loadStore();
      return true;
    } catch {
      showNotification("فشل حذف الصنف", "error");
      return false;
    }
  };

  const saveCategory = async (catData: { id?: string; name_ar: string; name_en: string }) => {
    try {
      await StoreRepository.saveCategory(slug, catData);
      showNotification("تم حفظ القسم بنجاح", "success");
      await loadStore();
      return true;
    } catch {
      showNotification("فشل حفظ القسم", "error");
      return false;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await StoreRepository.deleteCategory(slug, categoryId);
      showNotification("تم حذف القسم", "success");
      await loadStore();
      return true;
    } catch {
      showNotification("فشل حذف القسم", "error");
      return false;
    }
  };

  const updateSettings = async (settings: Partial<StoreSettings>) => {
    try {
      await StoreRepository.updateSettings(slug, settings);
      showNotification("تم حفظ إعدادات المتجر بنجاح", "success");
      await loadStore();
      return true;
    } catch {
      showNotification("فشل حفظ إعدادات المتجر", "error");
      return false;
    }
  };

  const resetToDefaults = async () => {
    try {
      await StoreRepository.resetToDefaults(slug);
      showNotification("تم استعادة البيانات الافتراضية للمتجر", "success");
      await loadStore();
    } catch {
      showNotification("فشل استعادة البيانات الافتراضية", "error");
    }
  };

  return {
    store,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    notification,
    toggleItemAvailability,
    saveItem,
    deleteItem,
    saveCategory,
    deleteCategory,
    updateSettings,
    resetToDefaults,
    reload: loadStore,
  };
}

