import { describe, it, expect, vi, beforeEach } from "vitest";
import { isValidUUID } from "@/lib/utils";
import * as clientMod from "@/lib/supabase/client";
import { saveMenuItemAction, saveCategoryAction } from "@/lib/supabase/actions";
import { StoreRepository } from "@/features/menu/services/store-repository";
import { MenuItem } from "@/features/menu/types";

describe("UUID Integrity and Form Validation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("isValidUUID helper", () => {
    it("should accept valid lowercase and uppercase v4 UUIDs", () => {
      expect(isValidUUID("c56a4180-65aa-42ec-a945-5fd2decdec52")).toBe(true);
      expect(isValidUUID("C56A4180-65AA-42EC-A945-5FD2DECDEC52")).toBe(true);
      expect(isValidUUID(crypto.randomUUID())).toBe(true);
    });

    it("should reject invalid strings, temp IDs, and empty values", () => {
      expect(isValidUUID("temp_id")).toBe(false);
      expect(isValidUUID("temp_cat_id")).toBe(false);
      expect(isValidUUID("item_123456789")).toBe(false);
      expect(isValidUUID("")).toBe(false);
      expect(isValidUUID(null)).toBe(false);
      expect(isValidUUID(undefined)).toBe(false);
      expect(isValidUUID("not-a-uuid-at-all")).toBe(false);
    });
  });

  describe("saveMenuItemAction UUID integrity", () => {
    it("should replace temp_id or non-UUID id with a valid crypto UUID", async () => {
      vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

      let upsertedId = "";
      vi.spyOn(clientMod.supabase, "from").mockReturnValue({
        upsert: async (payload: { id: string }) => {
          upsertedId = payload.id;
          return { data: null, error: null };
        },
      } as unknown as ReturnType<typeof clientMod.supabase.from>);

      const itemWithTempId: MenuItem = {
        id: "temp_id",
        category_id: "c56a4180-65aa-42ec-a945-5fd2decdec52",
        name_ar: "صنف تجريبي",
        name_en: "Test Item",
        price: 50,
        short_desc_ar: "",
        short_desc_en: "",
        full_desc_ar: "",
        full_desc_en: "",
        display_order: 0,
        is_available: true,
        badges: [],
        allergens: [],
      };

      const result = await saveMenuItemAction("store-uuid", itemWithTempId);
      expect(isValidUUID(result.id)).toBe(true);
      expect(result.id).not.toBe("temp_id");
      expect(isValidUUID(upsertedId)).toBe(true);
      expect(upsertedId).not.toBe("temp_id");
    });

    it("should preserve valid existing UUID on update", async () => {
      vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

      const existingUuid = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
      let upsertedId = "";
      vi.spyOn(clientMod.supabase, "from").mockReturnValue({
        upsert: async (payload: { id: string }) => {
          upsertedId = payload.id;
          return { data: null, error: null };
        },
      } as unknown as ReturnType<typeof clientMod.supabase.from>);

      const existingItem: MenuItem = {
        id: existingUuid,
        category_id: "c56a4180-65aa-42ec-a945-5fd2decdec52",
        name_ar: "صنف معدل",
        name_en: "Updated Item",
        price: 75,
        short_desc_ar: "",
        short_desc_en: "",
        full_desc_ar: "",
        full_desc_en: "",
        display_order: 0,
        is_available: true,
        badges: [],
        allergens: [],
      };

      const result = await saveMenuItemAction("store-uuid", existingItem);
      expect(result.id).toBe(existingUuid);
      expect(upsertedId).toBe(existingUuid);
    });
  });

  describe("saveCategoryAction UUID integrity", () => {
    it("should replace temp_cat_id or missing id with a valid UUID", async () => {
      vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

      let upsertedId = "";
      vi.spyOn(clientMod.supabase, "from").mockReturnValue({
        upsert: async (payload: { id: string }) => {
          upsertedId = payload.id;
          return { data: null, error: null };
        },
      } as unknown as ReturnType<typeof clientMod.supabase.from>);

      const result = await saveCategoryAction("store-uuid", {
        id: "temp_cat_id",
        name_ar: "قسم جديد",
        name_en: "New Category",
      });

      expect(isValidUUID(result.id)).toBe(true);
      expect(result.id).not.toBe("temp_cat_id");
      expect(isValidUUID(upsertedId)).toBe(true);
    });

    it("should preserve valid existing UUID on category update", async () => {
      vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

      const existingUuid = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      let upsertedId = "";
      vi.spyOn(clientMod.supabase, "from").mockReturnValue({
        upsert: async (payload: { id: string }) => {
          upsertedId = payload.id;
          return { data: null, error: null };
        },
      } as unknown as ReturnType<typeof clientMod.supabase.from>);

      const result = await saveCategoryAction("store-uuid", {
        id: existingUuid,
        name_ar: "قسم معدل",
        name_en: "Updated Category",
      });

      expect(result.id).toBe(existingUuid);
      expect(upsertedId).toBe(existingUuid);
    });
  });

  describe("StoreRepository Supabase integration", () => {
    it("should ensure generated item has valid UUID when saving to Supabase", async () => {
      vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);
      vi.spyOn(StoreRepository, "getStore").mockResolvedValue({
        restaurant: { id: "store-uuid", slug: "test-slug" } as unknown as MenuItem,
        categories: [],
      } as unknown as ReturnType<typeof StoreRepository.getStore> extends Promise<infer U> ? U : never);

      let capturedPayloadId = "";
      vi.spyOn(clientMod.supabase, "from").mockReturnValue({
        upsert: async (payload: { id: string }) => {
          capturedPayloadId = payload.id;
          return { data: null, error: null };
        },
      } as unknown as ReturnType<typeof clientMod.supabase.from>);

      const item = await StoreRepository.saveMenuItem("test-slug", {
        name_ar: "صنف جديد كلياً",
        name_en: "Brand New Item",
        price: 120,
        category_id: "c56a4180-65aa-42ec-a945-5fd2decdec52",
      });

      expect(isValidUUID(item.id)).toBe(true);
      expect(isValidUUID(capturedPayloadId)).toBe(true);
    });
  });
});