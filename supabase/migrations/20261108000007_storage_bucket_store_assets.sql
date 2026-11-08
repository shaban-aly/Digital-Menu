-- Migration: 20261108000007_storage_bucket_store_assets.sql
-- Description: Create store-assets bucket in Supabase Storage with public access and RLS policies

-- 1. Insert store-assets bucket with 5MB max size and allowed image MIME types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'store-assets',
  'store-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies for store-assets

-- Public Read Policy: Allow anyone (anon + authenticated) to view images
DROP POLICY IF EXISTS "Public can view store-assets" ON storage.objects;
CREATE POLICY "Public can view store-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'store-assets');

-- Upload Policy: Allow authenticated and anon users to upload store assets
DROP POLICY IF EXISTS "Allow upload to store-assets" ON storage.objects;
CREATE POLICY "Allow upload to store-assets"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'store-assets');

-- Update Policy: Allow authenticated and anon users to replace store assets
DROP POLICY IF EXISTS "Allow update to store-assets" ON storage.objects;
CREATE POLICY "Allow update to store-assets"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'store-assets')
WITH CHECK (bucket_id = 'store-assets');

-- Delete Policy: Allow authenticated and anon users to delete store assets
DROP POLICY IF EXISTS "Allow delete from store-assets" ON storage.objects;
CREATE POLICY "Allow delete from store-assets"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'store-assets');
