import {
  MenuData,
  Restaurant,
} from "@/features/menu/types";
import {
  getMockStoreBySlug,
  getAllMockStores,
  MOCK_MENU_DATA,
} from "./mock-menu-data";

export async function getStoreBySlug(slug: string): Promise<MenuData | null> {
  return getMockStoreBySlug(slug);
}

export async function getAllStores(): Promise<Restaurant[]> {
  return getAllMockStores();
}

export async function getMenuData(): Promise<MenuData> {
  return MOCK_MENU_DATA;
}
