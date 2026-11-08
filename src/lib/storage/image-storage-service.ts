import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { compressImage } from "./image-compressor";

export type AssetFolder = "products" | "logos" | "covers";

export const STORE_ASSETS_BUCKET = "store-assets";

/**
 * Generates a clean, unique file path for an asset within the store's directory.
 */
export function generateAssetPath(
  folder: AssetFolder,
  storeSlug: string,
  fileName: string
): string {
  const sanitizedSlug = storeSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");
  const extensionMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extensionMatch ? extensionMatch[1].toLowerCase() : "webp";
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${folder}/${sanitizedSlug}/${timestamp}_${randomStr}.${ext}`;
}

/**
 * Uploads an image asset to Supabase Storage after optimizing and compressing it.
 *
 * @param file The original File from an input or dropzone.
 * @param folder The target directory category ("products" | "logos" | "covers").
 * @param storeSlug The unique slug of the store owning the asset.
 * @returns The direct public URL of the uploaded asset.
 */
export async function uploadStoreAsset(
  file: File,
  folder: AssetFolder,
  storeSlug: string
): Promise<string> {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please check environment variables.");
  }

  // 1. Compress image in browser if applicable
  const processedFile = await compressImage(file);

  // 2. Generate unique storage path: folder/storeSlug/timestamp_random.ext
  const filePath = generateAssetPath(folder, storeSlug, processedFile.name);

  // 3. Upload to Supabase Storage bucket
  const { data, error } = await supabase.storage
    .from(STORE_ASSETS_BUCKET)
    .upload(filePath, processedFile, {
      upsert: true,
      contentType: processedFile.type || "image/webp",
      cacheControl: "3600",
    });

  if (error || !data) {
    throw new Error(`Failed to upload asset: ${error?.message || "Storage error"}`);
  }

  // 4. Retrieve and return public URL
  const { data: urlData } = supabase.storage
    .from(STORE_ASSETS_BUCKET)
    .getPublicUrl(data.path);

  if (!urlData?.publicUrl) {
    throw new Error("Failed to retrieve public URL for uploaded asset.");
  }

  return urlData.publicUrl;
}

/**
 * Deletes an asset from the store-assets bucket given its path or public URL.
 */
export async function deleteStoreAsset(pathOrUrl: string): Promise<boolean> {
  if (!pathOrUrl || !isSupabaseConfigured()) return false;

  let storagePath = pathOrUrl;
  if (pathOrUrl.includes(`/${STORE_ASSETS_BUCKET}/`)) {
    const parts = pathOrUrl.split(`/${STORE_ASSETS_BUCKET}/`);
    storagePath = parts[1] ? parts[1].split("?")[0] : pathOrUrl;
  }

  const { error } = await supabase.storage
    .from(STORE_ASSETS_BUCKET)
    .remove([storagePath]);

  return !error;
}
