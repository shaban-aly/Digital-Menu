-- Migration: 20261108000004_categories_and_products.sql
-- Description: Categories and products tables with subscription quota enforcement triggers

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  short_desc_ar TEXT DEFAULT '',
  short_desc_en TEXT DEFAULT '',
  full_desc_ar TEXT DEFAULT '',
  full_desc_en TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  unit_ar TEXT,
  unit_en TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  badges TEXT[] NOT NULL DEFAULT '{}',
  allergens TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Category Quota Enforcement Trigger
CREATE OR REPLACE FUNCTION public.check_category_quota()
RETURNS TRIGGER AS $$
DECLARE
  v_max INTEGER;
  v_count INTEGER;
BEGIN
  -- Allow upsert/update of an existing category without consuming quota
  IF NEW.id IS NOT NULL AND EXISTS (SELECT 1 FROM public.categories WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Read active subscription quota limit
  SELECT max_categories INTO v_max
  FROM public.subscriptions
  WHERE store_id = NEW.store_id AND is_active = true
  LIMIT 1;

  -- Fallback to store plan if subscription record is absent
  IF v_max IS NULL THEN
    SELECT CASE
      WHEN plan = 'enterprise' THEN -1
      WHEN plan IN ('pro', 'pro_monthly', 'pro_yearly') THEN 50
      ELSE 7
    END INTO v_max
    FROM public.stores
    WHERE id = NEW.store_id;
  END IF;

  -- Default to Free tier limit if still undetermined
  IF v_max IS NULL THEN
    v_max := 7;
  END IF;

  -- Unlimited tier bypass
  IF v_max = -1 OR v_max >= 999999 THEN
    RETURN NEW;
  END IF;

  -- Count existing categories for this store
  SELECT COUNT(*) INTO v_count
  FROM public.categories
  WHERE store_id = NEW.store_id;

  IF v_count >= v_max THEN
    RAISE EXCEPTION 'Category quota limit reached (max: %). Upgrade subscription to add more.', v_max;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_category_quota ON public.categories;
CREATE TRIGGER trg_check_category_quota
  BEFORE INSERT ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.check_category_quota();

-- 4. Product Quota Enforcement Trigger
CREATE OR REPLACE FUNCTION public.check_product_quota()
RETURNS TRIGGER AS $$
DECLARE
  v_max INTEGER;
  v_count INTEGER;
BEGIN
  -- Allow upsert/update of an existing product without consuming quota
  IF NEW.id IS NOT NULL AND EXISTS (SELECT 1 FROM public.products WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Read active subscription quota limit
  SELECT max_products INTO v_max
  FROM public.subscriptions
  WHERE store_id = NEW.store_id AND is_active = true
  LIMIT 1;

  -- Fallback to store plan if subscription record is absent
  IF v_max IS NULL THEN
    SELECT CASE
      WHEN plan = 'enterprise' THEN -1
      WHEN plan IN ('pro', 'pro_monthly', 'pro_yearly') THEN 500
      ELSE 50
    END INTO v_max
    FROM public.stores
    WHERE id = NEW.store_id;
  END IF;

  -- Default to Free tier limit if still undetermined
  IF v_max IS NULL THEN
    v_max := 50;
  END IF;

  -- Unlimited tier bypass
  IF v_max = -1 OR v_max >= 999999 THEN
    RETURN NEW;
  END IF;

  -- Count existing products for this store
  SELECT COUNT(*) INTO v_count
  FROM public.products
  WHERE store_id = NEW.store_id;

  IF v_count >= v_max THEN
    RAISE EXCEPTION 'Product quota limit reached (max: %). Upgrade subscription to add more.', v_max;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_product_quota ON public.products;
CREATE TRIGGER trg_check_product_quota
  BEFORE INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.check_product_quota();
