import { MenuData, Restaurant } from "@/features/menu/types";
import { StoreRepository } from "./store-repository";
import { MOCK_MENU_DATA } from "./mock-menu-data";

export async function getStoreBySlug(slug: string): Promise<MenuData | null> {
  return StoreRepository.getStore(slug);
}

export async function getAllStores(): Promise<Restaurant[]> {
  return StoreRepository.getAllStores();
}

export async function getMenuData(): Promise<MenuData> {
  const store = await StoreRepository.getStore("oriental-grill");
  return store || MOCK_MENU_DATA;
}
