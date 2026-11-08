export {
  getStoreBySlugAction as fetchStoreFromSupabase,
  getAllStoresAction as fetchAllStoresFromSupabase,
  saveMenuItemAction as syncProductToSupabase,
  toggleItemAvailabilityAction as syncProductAvailabilityToSupabase,
  deleteMenuItemAction as deleteProductFromSupabase,
  saveCategoryAction as syncCategoryToSupabase,
  deleteCategoryAction as deleteCategoryFromSupabase,
  updateStoreSettingsAction as syncStoreSettingsToSupabase,
} from "@/lib/supabase/actions";
