import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as clientMod from "@/lib/supabase/client";
import { compressImage } from "@/lib/storage/image-compressor";
import {
  generateAssetPath,
  uploadStoreAsset,
  deleteStoreAsset,
  STORE_ASSETS_BUCKET,
} from "@/lib/storage/image-storage-service";

describe("Storage Infrastructure & Image Services", () => {
  const rootDir = process.cwd();
  const migrationFile = path.join(
    rootDir,
    "supabase",
    "migrations",
    "20261108000007_storage_bucket_store_assets.sql"
  );

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Migration 7: store-assets Bucket & RLS", () => {
    it("should exist and adhere to Constitution line limits (<= 180 lines)", () => {
      expect(fs.existsSync(migrationFile)).toBe(true);
      const content = fs.readFileSync(migrationFile, "utf-8");
      const lines = content.split("\n").length;
      expect(lines).toBeLessThanOrEqual(180);
    });

    it("should configure store-assets bucket with public access, 5MB limit and allowed MIME types", () => {
      const content = fs.readFileSync(migrationFile, "utf-8");
      expect(content).toContain("store-assets");
      expect(content).toContain("5242880");
      expect(content).toContain("image/jpeg");
      expect(content).toContain("image/png");
      expect(content).toContain("image/webp");
      expect(content).toContain("image/gif");
      expect(content).toContain("image/svg+xml");
    });

    it("should include RLS policies for SELECT, INSERT, UPDATE, and DELETE", () => {
      const content = fs.readFileSync(migrationFile, "utf-8");
      expect(content).toContain("FOR SELECT");
      expect(content).toContain("FOR INSERT");
      expect(content).toContain("FOR UPDATE");
      expect(content).toContain("FOR DELETE");
      expect(content).toContain("bucket_id = 'store-assets'");
    });
  });

  describe("Image Compressor", () => {
    it("should return the original file in Node/non-browser environment safely", async () => {
      const file = new File(["dummy content"], "test-item.jpg", {
        type: "image/jpeg",
      });
      const result = await compressImage(file);
      expect(result).toBe(file);
    });

    it("should pass-through SVG and GIF files without raster compression", async () => {
      const svgFile = new File(["<svg></svg>"], "logo.svg", {
        type: "image/svg+xml",
      });
      const gifFile = new File(["gif content"], "animation.gif", {
        type: "image/gif",
      });

      const processedSvg = await compressImage(svgFile);
      const processedGif = await compressImage(gifFile);

      expect(processedSvg).toBe(svgFile);
      expect(processedGif).toBe(gifFile);
    });
  });

  describe("Image Storage Service", () => {
    it("should generate a well-formed asset path with folder, slug, timestamp, and extension", () => {
      const pathResult = generateAssetPath("products", "my-burger-joint", "burger.png");
      expect(pathResult).toMatch(/^products\/my-burger-joint\/\d+_[a-z0-9]+\.png$/);

      const coverPath = generateAssetPath("covers", "Fresh Market", "banner.webp");
      expect(coverPath).toMatch(/^covers\/fresh-market\/\d+_[a-z0-9]+\.webp$/);
    });

    it("should throw error if Supabase is not configured", async () => {
      vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(false);
      const file = new File(["content"], "food.jpg", { type: "image/jpeg" });

      await expect(
        uploadStoreAsset(file, "products", "demo-store")
      ).rejects.toThrow(/Supabase is not configured/);
    });

    it("should upload file to store-assets and return public URL", async () => {
      vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

      const expectedPublicUrl =
        "https://example.supabase.co/storage/v1/object/public/store-assets/products/demo-store/123_abc.webp";

      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: "products/demo-store/123_abc.webp" },
        error: null,
      });

      const mockGetPublicUrl = vi.fn().mockReturnValue({
        data: { publicUrl: expectedPublicUrl },
      });

      vi.spyOn(clientMod.supabase.storage, "from").mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      } as unknown as ReturnType<typeof clientMod.supabase.storage.from>);

      const file = new File(["fake-image-bytes"], "burger.jpg", {
        type: "image/jpeg",
      });

      const resultUrl = await uploadStoreAsset(file, "products", "demo-store");

      expect(resultUrl).toBe(expectedPublicUrl);
      expect(clientMod.supabase.storage.from).toHaveBeenCalledWith(STORE_ASSETS_BUCKET);
      expect(mockUpload).toHaveBeenCalled();
    });

    it("should throw error if upload fails", async () => {
      vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

      const mockUpload = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "File exceeds 5MB limit" },
      });

      vi.spyOn(clientMod.supabase.storage, "from").mockReturnValue({
        upload: mockUpload,
      } as unknown as ReturnType<typeof clientMod.supabase.storage.from>);

      const file = new File(["fake-image-bytes"], "huge.jpg", {
        type: "image/jpeg",
      });

      await expect(
        uploadStoreAsset(file, "products", "demo-store")
      ).rejects.toThrow(/File exceeds 5MB limit/);
    });

    it("should delete asset using path or full URL", async () => {
      vi.spyOn(clientMod, "isSupabaseConfigured").mockReturnValue(true);

      const mockRemove = vi.fn().mockResolvedValue({ data: [], error: null });

      vi.spyOn(clientMod.supabase.storage, "from").mockReturnValue({
        remove: mockRemove,
      } as unknown as ReturnType<typeof clientMod.supabase.storage.from>);

      const fullUrl =
        "https://example.supabase.co/storage/v1/object/public/store-assets/logos/my-store/logo.webp";

      const deleted = await deleteStoreAsset(fullUrl);
      expect(deleted).toBe(true);
      expect(mockRemove).toHaveBeenCalledWith(["logos/my-store/logo.webp"]);
    });
  });
});
