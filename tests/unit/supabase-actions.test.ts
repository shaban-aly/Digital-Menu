import { describe, it, expect, vi, beforeEach } from "vitest";
import * as clientMod from "@/lib/supabase/client";
import {
  getStoreBySlugAction,
  saveMenuItemAction,
  saveCategoryAction,
  updateStoreSettingsAction,
  toggleItemAvailabilityAction,
  deleteMenuItemAction,
  deleteCategoryAction,
} from "@/lib/supabase/actions";
import { MenuItem } from "@/features/menu/types";

describe("Supabase Actions & SQL Engine", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should catch Product quota limit reached error from SQL trigger", async () => {
    vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

    vi.spyOn(clientMod.supabase, "from").mockReturnValue({
      upsert: async () => ({
        data: null,
        error: { message: "Product quota limit reached (max: 50). Upgrade subscription to add more." },
      }),
    } as unknown as ReturnType<typeof clientMod.supabase.from>);

    const mockItem: MenuItem = {
      id: "prod-1",
      category_id: "cat-1",
      name_ar: "صنف تجريبي",
      name_en: "Test Item",
      price: 100,
      short_desc_ar: "",
      short_desc_en: "",
      full_desc_ar: "",
      full_desc_en: "",
      display_order: 1,
      is_available: true,
      badges: [],
      allergens: [],
    };

    await expect(saveMenuItemAction("store-1", mockItem)).rejects.toThrow(
      /Product quota limit reached/
    );
  });

  it("should catch Category quota limit reached error from SQL trigger", async () => {
    vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

    vi.spyOn(clientMod.supabase, "from").mockReturnValue({
      upsert: async () => ({
        data: null,
        error: { message: "Category quota limit reached (max: 7). Upgrade subscription to add more." },
      }),
    } as unknown as ReturnType<typeof clientMod.supabase.from>);

    await expect(
      saveCategoryAction("store-1", {
        id: "cat-1",
        name_ar: "قسم تجريبي",
        name_en: "Test Category",
      })
    ).rejects.toThrow(/Category quota limit reached/);
  });

  it("should persist schedule and settings directly to public.stores", async () => {
    vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

    let capturedPayload: Record<string, unknown> = {};
    vi.spyOn(clientMod.supabase, "from").mockReturnValue({
      update: (payload: Record<string, unknown>) => {
        capturedPayload = payload;
        return {
          eq: async () => ({ data: null, error: null }),
        };
      },
    } as unknown as ReturnType<typeof clientMod.supabase.from>);

    const success = await updateStoreSettingsAction("oriental-grill", {
      phone_number: "201012345678",
      schedule: {
        timezone: "Africa/Cairo",
        allow_preorders: false,
        is_manually_paused: true,
        pause_note_ar: "مغلق مؤقتا",
        pause_note_en: "Paused",
        weekly_schedule: [],
      },
    });

    expect(success).toBe(true);
    expect(capturedPayload.phone_number).toBe("201012345678");
    expect(capturedPayload.schedule).toBeDefined();
    expect((capturedPayload.schedule as { is_manually_paused: boolean }).is_manually_paused).toBe(true);
  });

  it("should update item availability directly via products.update", async () => {
    vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

    let updatedAvailability: boolean | undefined;
    vi.spyOn(clientMod.supabase, "from").mockReturnValue({
      update: (payload: { is_available?: boolean }) => {
        updatedAvailability = payload.is_available;
        return {
          eq: async () => ({ data: null, error: null }),
        };
      },
    } as unknown as ReturnType<typeof clientMod.supabase.from>);

    const res = await toggleItemAvailabilityAction("prod-1", false);
    expect(res).toBe(false);
    expect(updatedAvailability).toBe(false);
  });

  it("should delete item directly via products.delete", async () => {
    vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

    let deletedId: string | undefined;
    vi.spyOn(clientMod.supabase, "from").mockReturnValue({
      delete: () => ({
        eq: async (_col: string, val: string) => {
          deletedId = val;
          return { data: null, error: null };
        },
      }),
    } as unknown as ReturnType<typeof clientMod.supabase.from>);

    const res = await deleteMenuItemAction("prod-to-delete");
    expect(res).toBe(true);
    expect(deletedId).toBe("prod-to-delete");
  });

  it("should delete category directly via categories.delete", async () => {
    vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

    let deletedCatId: string | undefined;
    vi.spyOn(clientMod.supabase, "from").mockReturnValue({
      delete: () => ({
        eq: async (_col: string, val: string) => {
          deletedCatId = val;
          return { data: null, error: null };
        },
      }),
    } as unknown as ReturnType<typeof clientMod.supabase.from>);

    const res = await deleteCategoryAction("cat-to-delete");
    expect(res).toBe(true);
    expect(deletedCatId).toBe("cat-to-delete");
  });
});
