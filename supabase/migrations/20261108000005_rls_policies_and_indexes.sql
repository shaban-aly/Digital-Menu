-- Migration: 20261108000005_rls_policies_and_indexes.sql
-- Description: Superadmin bypass, performance indexes, and strict Row-Level Security policies

-- 1. Helper function for superadmin role check
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores (slug);
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON public.stores (owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON public.stores (is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_store_id ON public.subscriptions (store_id);
CREATE INDEX IF NOT EXISTS idx_categories_store_id ON public.categories (store_id);
CREATE INDEX IF NOT EXISTS idx_categories_store_order ON public.categories (store_id, display_order);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products (store_id);
CREATE INDEX IF NOT EXISTS idx_products_store_order ON public.products (store_id, display_order);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

-- 3. Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Profiles RLS Policies
DROP POLICY IF EXISTS "profiles_select_own_or_superadmin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_superadmin"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_superadmin());

DROP POLICY IF EXISTS "profiles_update_own_or_superadmin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_superadmin"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_superadmin())
  WITH CHECK (id = auth.uid() OR public.is_superadmin());

DROP POLICY IF EXISTS "profiles_insert_own_or_superadmin" ON public.profiles;
CREATE POLICY "profiles_insert_own_or_superadmin"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid() OR public.is_superadmin());

-- 5. Stores RLS Policies
DROP POLICY IF EXISTS "stores_public_active_read" ON public.stores;
CREATE POLICY "stores_public_active_read"
  ON public.stores FOR SELECT
  USING (is_active = true OR owner_id = auth.uid() OR public.is_superadmin());

DROP POLICY IF EXISTS "stores_owner_manage" ON public.stores;
CREATE POLICY "stores_owner_manage"
  ON public.stores FOR ALL
  USING (owner_id = auth.uid() OR public.is_superadmin())
  WITH CHECK (owner_id = auth.uid() OR public.is_superadmin());

-- 6. Subscriptions RLS Policies
DROP POLICY IF EXISTS "subscriptions_owner_read" ON public.subscriptions;
CREATE POLICY "subscriptions_owner_read"
  ON public.subscriptions FOR SELECT
  USING (
    store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    OR public.is_superadmin()
  );

DROP POLICY IF EXISTS "subscriptions_superadmin_manage" ON public.subscriptions;
CREATE POLICY "subscriptions_superadmin_manage"
  ON public.subscriptions FOR ALL
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());

-- 7. Categories RLS Policies
DROP POLICY IF EXISTS "categories_public_active_read" ON public.categories;
CREATE POLICY "categories_public_active_read"
  ON public.categories FOR SELECT
  USING (
    is_active = true
    OR store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    OR public.is_superadmin()
  );

DROP POLICY IF EXISTS "categories_owner_manage" ON public.categories;
CREATE POLICY "categories_owner_manage"
  ON public.categories FOR ALL
  USING (
    store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    OR public.is_superadmin()
  )
  WITH CHECK (
    store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    OR public.is_superadmin()
  );

-- 8. Products RLS Policies
DROP POLICY IF EXISTS "products_public_available_read" ON public.products;
CREATE POLICY "products_public_available_read"
  ON public.products FOR SELECT
  USING (
    store_id IN (SELECT id FROM public.stores WHERE is_active = true)
    OR store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    OR public.is_superadmin()
  );

DROP POLICY IF EXISTS "products_owner_manage" ON public.products;
CREATE POLICY "products_owner_manage"
  ON public.products FOR ALL
  USING (
    store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    OR public.is_superadmin()
  )
  WITH CHECK (
    store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    OR public.is_superadmin()
  );

-- 9. Role Permissions (Schema & Table Grants)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
