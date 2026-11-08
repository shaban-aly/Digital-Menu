# Service Contract: Store Repository

**Feature**: `003-merchant-admin-dashboard`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Interface Definition (`IStoreRepository`)

This contract defines the methods for managing store data. Both `LocalStorageStoreRepository` (used during this mock phase) and `SupabaseStoreRepository` (used at pre-launch) implement this exact interface.

```typescript
import { StoreSettings, Category, AdminMenuItem, StoreQRConfig } from "../types";
import { Store } from "@/features/menu/types";

export interface IStoreRepository {
  /**
   * Retrieves the full store profile, categories, and items with all overrides applied.
   */
  getStore(slug: string): Promise<Store | null>;

  /**
   * Updates store-level profile and fulfillment settings.
   */
  updateSettings(slug: string, settings: Partial<StoreSettings>): Promise<StoreSettings>;

  /**
   * Saves (creates or updates) a category.
   */
  saveCategory(slug: string, category: Partial<Category> & { name_ar: string; name_en: string }): Promise<Category>;

  /**
   * Deletes a category by id.
   */
  deleteCategory(slug: string, categoryId: string): Promise<boolean>;

  /**
   * Toggles the live availability (in-stock / out-of-stock) of a menu item.
   */
  toggleItemAvailability(slug: string, itemId: string, isAvailable: boolean): Promise<boolean>;

  /**
   * Saves (creates or updates) a menu item.
   */
  saveMenuItem(slug: string, item: Partial<AdminMenuItem> & { name_ar: string; name_en: string; price: number; categoryId: string }): Promise<AdminMenuItem>;

  /**
   * Deletes a menu item by id.
   */
  deleteMenuItem(slug: string, itemId: string): Promise<boolean>;

  /**
   * Retrieves or updates QR configuration for the store.
   */
  getQRConfig(slug: string): Promise<StoreQRConfig>;
  saveQRConfig(slug: string, config: Partial<StoreQRConfig>): Promise<StoreQRConfig>;

  /**
   * Resets all local overrides back to initial mock data.
   */
  resetToDefaults(slug: string): Promise<void>;
}
```

---

## 2. Event-Driven Cross-Tab & Cross-View Sync Contract

When a merchant modifies store data in `/admin/[slug]`:
1. The repository commits the change to `localStorage`.
2. A `CustomEvent` (`"digital_menu_store_updated"`) or native `storage` event is dispatched.
3. The customer menu hook (`useMenuData` or `useStore`) listens to this event and updates its local React state without requiring a full page refresh.
