import { MenuData, Restaurant } from "@/features/menu/types";
import { ORIENTAL_GRILL_DATA } from "./mock-data/oriental-grill";
import { SPECIALTY_CAFE_DATA } from "./mock-data/specialty-cafe";
import { FRESH_MARKET_DATA } from "./mock-data/fresh-market";

export const STORES_MAP: Record<string, MenuData> = {
  "oriental-grill": ORIENTAL_GRILL_DATA,
  "specialty-cafe": SPECIALTY_CAFE_DATA,
  "fresh-market": FRESH_MARKET_DATA,
};

export const MOCK_MENU_DATA: MenuData = ORIENTAL_GRILL_DATA;

export function getMockStoreBySlug(slug: string): MenuData {
  return STORES_MAP[slug] || ORIENTAL_GRILL_DATA;
}

export function getAllMockStores(): Restaurant[] {
  return Object.values(STORES_MAP).map((data) => data.restaurant);
}
