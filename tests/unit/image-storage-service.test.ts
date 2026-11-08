import { describe, it, expect, vi, beforeEach } from "vitest";
import * as supabaseClient from "@/lib/supabase/client";
import { setupMockSupabase, resetMockSupabase, mockStorageUploads } from "../mocks/mock-supabase-auth";
import {
  uploadStoreAsset,
  deleteStoreAsset,
  generateAssetPath,
  STORE_ASSETS_BUCKET,
  AssetFolder,
} from "@/lib/storage/image-storage-service";

describe("Image Storage Service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetMockSupabase();
    setupMockSupabase(supabaseClient);
  });

  describe("generateAssetPath", () => {
    it.each<AssetFolder>(["products", "logos", "covers"])(
      "should route assets into the correct folder: %s",
      (folder) => {
        const filePath = generateAssetPath(folder, "my-store-101", "photo.PNG");
        expect(filePath.startsWith(`${folder}/my-store-101/`)).toBe(true);
        expect(filePath.endsWith(".png")).toBe(true);
      }
    );

    it("should sanitize accented and special characters in store slugs", () => {
      const pathResult = generateAssetPath("products", " Cafe_Grill @ Cairo ", "item.jpg");
      expect(pathResult).toMatch(/^products\/cafe_grill---cairo\/\d+_[a-z0-9]+\.jpg$/);
    });

    it("should fallback to webp extension when fileName has no extension", () => {
      const pathResult = generateAssetPath("logos", "demo-cafe", "raw-avatar");
      expect(pathResult.endsWith(".webp")).toBe(true);
    });
  });

  describe("uploadStoreAsset", () => {
    it("should upload a product asset and return a valid publicUrl", async () => {
      const dummyFile = new File(["product-bytes"], "burger.jpg", { type: "image/jpeg" });
      const publicUrl = await uploadStoreAsset(dummyFile, "products", "oriental-grill");

      expect(publicUrl).toContain(`/storage/v1/object/public/${STORE_ASSETS_BUCKET}/products/oriental-grill/`);
      expect(publicUrl).toMatch(/\.jpg$/);
      expect(mockStorageUploads.size).toBe(1);
    });

    it("should upload a store logo to the logos/ directory", async () => {
      const logoFile = new File(["logo-bytes"], "logo.png", { type: "image/png" });
      const publicUrl = await uploadStoreAsset(logoFile, "logos", "fresh-market");

      expect(publicUrl).toContain("/logos/fresh-market/");
      const storedKey = Array.from(mockStorageUploads.keys())[0];
      expect(storedKey.startsWith(`${STORE_ASSETS_BUCKET}/logos/fresh-market/`)).toBe(true);
    });

    it("should upload a store cover banner to the covers/ directory", async () => {
      const coverFile = new File(["cover-bytes"], "banner.webp", { type: "image/webp" });
      const publicUrl = await uploadStoreAsset(coverFile, "covers", "specialty-cafe");

      expect(publicUrl).toContain("/covers/specialty-cafe/");
      const storedKey = Array.from(mockStorageUploads.keys())[0];
      expect(storedKey.startsWith(`${STORE_ASSETS_BUCKET}/covers/specialty-cafe/`)).toBe(true);
    });

    it("should throw an error if no file is provided", async () => {
      await expect(
        uploadStoreAsset(null as unknown as File, "products", "demo")
      ).rejects.toThrow("No file provided for upload.");
    });

    it("should throw an error when Supabase is not configured", async () => {
      vi.spyOn(supabaseClient, "isSupabaseConfigured").mockReturnValue(false);
      const file = new File(["data"], "test.png", { type: "image/png" });

      await expect(
        uploadStoreAsset(file, "products", "demo")
      ).rejects.toThrow(/Supabase is not configured/);
    });

    it("should propagate upload errors from Supabase Storage", async () => {
      vi.spyOn(supabaseClient.supabase.storage, "from").mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: null, error: { message: "Quota exceeded" } }),
        getPublicUrl: vi.fn(),
      } as unknown as ReturnType<typeof supabaseClient.supabase.storage.from>);

      const file = new File(["bytes"], "large.jpg", { type: "image/jpeg" });
      await expect(
        uploadStoreAsset(file, "products", "demo")
      ).rejects.toThrow("Failed to upload asset: Quota exceeded");
    });

    it("should throw an error if getPublicUrl fails to return a publicUrl", async () => {
      vi.spyOn(supabaseClient.supabase.storage, "from").mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: { path: "products/demo/1.jpg" }, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "" } }),
      } as unknown as ReturnType<typeof supabaseClient.supabase.storage.from>);

      const file = new File(["bytes"], "photo.jpg", { type: "image/jpeg" });
      await expect(
        uploadStoreAsset(file, "products", "demo")
      ).rejects.toThrow("Failed to retrieve public URL for uploaded asset.");
    });
  });

  describe("deleteStoreAsset", () => {
    it("should delete an asset given its full public URL", async () => {
      const file = new File(["avatar"], "avatar.png", { type: "image/png" });
      const publicUrl = await uploadStoreAsset(file, "logos", "al-baraka");
      expect(mockStorageUploads.size).toBe(1);

      const success = await deleteStoreAsset(publicUrl);
      expect(success).toBe(true);
      expect(mockStorageUploads.size).toBe(0);
    });

    it("should delete an asset given its relative path", async () => {
      const file = new File(["data"], "item.webp", { type: "image/webp" });
      await uploadStoreAsset(file, "products", "al-baraka");
      const uploadKey = Array.from(mockStorageUploads.keys())[0];
      const relativePath = uploadKey.replace(`${STORE_ASSETS_BUCKET}/`, "");

      const success = await deleteStoreAsset(relativePath);
      expect(success).toBe(true);
      expect(mockStorageUploads.size).toBe(0);
    });

    it("should return false gracefully if path is empty or Supabase is unconfigured", async () => {
      expect(await deleteStoreAsset("")).toBe(false);

      vi.spyOn(supabaseClient, "isSupabaseConfigured").mockReturnValue(false);
      expect(await deleteStoreAsset("logos/store/test.png")).toBe(false);
    });
  });
});
