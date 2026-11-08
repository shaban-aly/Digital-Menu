-- Migration: 20261108000003_stores_table.sql
-- Description: Multi-tenant stores table and subscription link

-- 1. Stores Table
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  business_type public.business_type NOT NULL DEFAULT 'restaurant',
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  logo_url TEXT,
  cover_url TEXT,
  phone_number TEXT NOT NULL DEFAULT '201012345678',
  default_language TEXT NOT NULL DEFAULT 'ar',
  currency TEXT NOT NULL DEFAULT 'EGP',
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  supported_order_types TEXT[] NOT NULL DEFAULT ARRAY['dine_in', 'takeaway', 'delivery'],
  plan public.plan_tier NOT NULL DEFAULT 'free',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Foreign Key link from subscriptions to stores
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_subscriptions_store' AND table_name = 'subscriptions'
  ) THEN
    ALTER TABLE public.subscriptions
      ADD CONSTRAINT fk_subscriptions_store
      FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Automatic subscription creation on store insert
CREATE OR REPLACE FUNCTION public.handle_new_store_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (
    store_id,
    plan,
    billing_cycle,
    max_categories,
    max_products,
    price_egp,
    is_active
  ) VALUES (
    NEW.id,
    COALESCE(NEW.plan, 'free'::public.plan_tier),
    CASE
      WHEN NEW.plan = 'pro_yearly' THEN 'yearly'::public.billing_cycle
      ELSE 'monthly'::public.billing_cycle
    END,
    CASE
      WHEN NEW.plan = 'enterprise' THEN -1
      WHEN NEW.plan IN ('pro', 'pro_monthly', 'pro_yearly') THEN 50
      ELSE 7
    END,
    CASE
      WHEN NEW.plan = 'enterprise' THEN -1
      WHEN NEW.plan IN ('pro', 'pro_monthly', 'pro_yearly') THEN 500
      ELSE 50
    END,
    CASE
      WHEN NEW.plan = 'pro_yearly' THEN 2500.00
      WHEN NEW.plan IN ('pro', 'pro_monthly') THEN 250.00
      ELSE 0.00
    END,
    true
  )
  ON CONFLICT (store_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_store_created_subscription ON public.stores;
CREATE TRIGGER trg_on_store_created_subscription
  AFTER INSERT ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_store_subscription();

-- 4. Automatic subscription synchronization on store plan update
CREATE OR REPLACE FUNCTION public.handle_store_plan_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    UPDATE public.subscriptions
    SET
      plan = NEW.plan,
      billing_cycle = CASE
        WHEN NEW.plan = 'pro_yearly' THEN 'yearly'::public.billing_cycle
        ELSE billing_cycle
      END,
      max_categories = CASE
        WHEN NEW.plan = 'enterprise' THEN -1
        WHEN NEW.plan IN ('pro', 'pro_monthly', 'pro_yearly') THEN 50
        ELSE 7
      END,
      max_products = CASE
        WHEN NEW.plan = 'enterprise' THEN -1
        WHEN NEW.plan IN ('pro', 'pro_monthly', 'pro_yearly') THEN 500
        ELSE 50
      END,
      price_egp = CASE
        WHEN NEW.plan = 'pro_yearly' THEN 2500.00
        WHEN NEW.plan IN ('pro', 'pro_monthly') THEN 250.00
        ELSE 0.00
      END,
      updated_at = timezone('utc'::text, now())
    WHERE store_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_store_updated_subscription ON public.stores;
CREATE TRIGGER trg_on_store_updated_subscription
  AFTER UPDATE OF plan ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.handle_store_plan_update();
