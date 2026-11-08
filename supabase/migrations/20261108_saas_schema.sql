-- SaaS Multi-Tenant Platform Schema & Initial Seeds
-- Migration: 20261108_saas_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Helper function for superadmin role check
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'merchant' CHECK (role IN ('merchant', 'superadmin')),
  store_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Stores Table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'restaurant' CHECK (business_type IN ('restaurant', 'cafe', 'supermarket', 'store')),
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  logo_url TEXT,
  cover_url TEXT,
  phone_number TEXT NOT NULL DEFAULT '201012345678',
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 20.00,
  currency TEXT NOT NULL DEFAULT 'EGP',
  default_language TEXT NOT NULL DEFAULT 'ar' CHECK (default_language IN ('ar', 'en')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise', 'pro_monthly', 'pro_yearly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise', 'pro_monthly', 'pro_yearly')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  short_desc_ar TEXT DEFAULT '',
  short_desc_en TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  unit_ar TEXT,
  unit_en TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Enable Row-Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 8. Row-Level Security Policies
CREATE POLICY "Profiles read own or superadmin" ON profiles FOR SELECT USING (id = auth.uid() OR is_superadmin());
CREATE POLICY "Profiles update own" ON profiles FOR UPDATE USING (id = auth.uid() OR is_superadmin());
CREATE POLICY "Stores public active read" ON stores FOR SELECT USING (is_active = true OR owner_id = auth.uid() OR is_superadmin());
CREATE POLICY "Stores owner update" ON stores FOR UPDATE USING (owner_id = auth.uid() OR is_superadmin());
CREATE POLICY "Stores superadmin all" ON stores FOR ALL USING (is_superadmin());
CREATE POLICY "Subscriptions view own" ON subscriptions FOR SELECT USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()) OR is_superadmin());
CREATE POLICY "Subscriptions superadmin manage" ON subscriptions FOR ALL USING (is_superadmin());
CREATE POLICY "Categories public read" ON categories FOR SELECT USING (is_active = true OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()) OR is_superadmin());
CREATE POLICY "Categories owner write" ON categories FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()) OR is_superadmin());
CREATE POLICY "Products public read" ON products FOR SELECT USING (is_available = true OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()) OR is_superadmin());
CREATE POLICY "Products owner write" ON products FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()) OR is_superadmin());

-- 9. Seed Data for 3 Core Businesses
INSERT INTO profiles (id, email, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@digitalmenu.eg', 'Platform Superadmin', 'superadmin'),
  ('11111111-1111-1111-1111-111111111111', 'baraka@orientalgrill.eg', 'Mohamed Baraka', 'merchant'),
  ('22222222-2222-2222-2222-222222222222', 'aroma@specialtycafe.eg', 'Sarah Tarek', 'merchant'),
  ('33333333-3333-3333-3333-333333333333', 'fresh@freshmarket.eg', 'Ahmed Nour', 'merchant')
ON CONFLICT (id) DO NOTHING;

INSERT INTO stores (id, owner_id, slug, name_ar, name_en, business_type, phone_number, plan, is_active) VALUES
  ('11111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'oriental-grill', 'مطعم مشويات البركة', 'Al-Baraka Oriental Grill', 'restaurant', '201012345678', 'pro', true),
  ('22222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'specialty-cafe', 'كافيه ومخبوزات أروما', 'Aroma Specialty Cafe', 'cafe', '201098765432', 'free', true),
  ('33333333-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'fresh-market', 'سوبر ماركت فريش ماركت', 'Fresh Market Supermarket', 'supermarket', '201011223344', 'enterprise', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subscriptions (store_id, plan, billing_cycle, status) VALUES
  ('11111111-0000-0000-0000-000000000001', 'pro', 'monthly', 'active'),
  ('22222222-0000-0000-0000-000000000002', 'free', 'monthly', 'active'),
  ('33333333-0000-0000-0000-000000000003', 'enterprise', 'yearly', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO categories (id, store_id, name_ar, name_en, display_order) VALUES
  ('c1111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'المقبلات والشوربة', 'Appetizers & Soups', 1),
  ('c2222222-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'القهوة المختصة', 'Specialty Coffee', 1),
  ('c3333333-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000003', 'الخضروات والفواكه', 'Fresh Produce', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, store_id, category_id, name_ar, name_en, price, display_order) VALUES
  ('p1111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000001', 'شوربة لسان عصفور', 'Orzo Soup', 45.00, 1),
  ('p2222222-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'c2222222-0000-0000-0000-000000000002', 'فلات وايت', 'Flat White', 75.00, 1),
  ('p3333333-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000003', 'تفاح أحمر سكري', 'Red Gala Apples', 65.00, 1)
ON CONFLICT (id) DO NOTHING;
