-- Seed Data for 3 Core Demo Businesses & Superadmin
-- Compatible with local Supabase CLI and cloud environments

-- 1. Create Demo Users in auth.users if auth schema is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
    ) VALUES
      ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@digitalmenu.eg', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Platform Superadmin","role":"superadmin"}', now(), now(), 'authenticated', 'authenticated'),
      ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'baraka@orientalgrill.eg', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mohamed Baraka","role":"merchant"}', now(), now(), 'authenticated', 'authenticated'),
      ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'aroma@specialtycafe.eg', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sarah Tarek","role":"merchant"}', now(), now(), 'authenticated', 'authenticated'),
      ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'fresh@freshmarket.eg', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ahmed Nour","role":"merchant"}', now(), now(), 'authenticated', 'authenticated')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- 2. Upsert Profiles
INSERT INTO public.profiles (id, email, full_name, role, store_slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@digitalmenu.eg', 'Platform Superadmin', 'superadmin', NULL),
  ('11111111-1111-1111-1111-111111111111', 'baraka@orientalgrill.eg', 'Mohamed Baraka', 'merchant', 'oriental-grill'),
  ('22222222-2222-2222-2222-222222222222', 'aroma@specialtycafe.eg', 'Sarah Tarek', 'merchant', 'specialty-cafe'),
  ('33333333-3333-3333-3333-333333333333', 'fresh@freshmarket.eg', 'Ahmed Nour', 'merchant', 'fresh-market')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email, full_name = EXCLUDED.full_name, role = EXCLUDED.role, store_slug = EXCLUDED.store_slug;

-- 3. Upsert Stores
INSERT INTO public.stores (
  id, owner_id, slug, name_ar, name_en, business_type, description_ar, description_en,
  phone_number, delivery_fee, supported_order_types, plan, is_active
) VALUES
  ('11111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'oriental-grill', 'مطعم مشويات البركة', 'Al-Baraka Oriental Grill', 'restaurant', 'أشهى المشويات الشرقية والطواجن', 'Authentic charcoal grill and dishes', '201012345678', 25.00, ARRAY['dine_in', 'takeaway', 'delivery'], 'pro', true),
  ('22222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'specialty-cafe', 'كافيه ومخبوزات أروما', 'Aroma Specialty Cafe', 'cafe', 'محمصة قهوة ومخبوزات طازجة', 'Specialty coffee and fresh pastries', '201098765432', 15.00, ARRAY['dine_in', 'takeaway'], 'free', true),
  ('33333333-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'fresh-market', 'سوبر ماركت فريش ماركت', 'Fresh Market Supermarket', 'supermarket', 'خضروات وفواكه طازجة يومياً', 'Daily fresh farm produce and goods', '201011223344', 20.00, ARRAY['takeaway', 'delivery'], 'enterprise', true)
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, plan = EXCLUDED.plan, is_active = EXCLUDED.is_active;

-- 4. Upsert Subscriptions
INSERT INTO public.subscriptions (store_id, plan, billing_cycle, max_categories, max_products, price_egp, is_active) VALUES
  ('11111111-0000-0000-0000-000000000001', 'pro', 'monthly', 50, 500, 250.00, true),
  ('22222222-0000-0000-0000-000000000002', 'free', 'monthly', 7, 50, 0.00, true),
  ('33333333-0000-0000-0000-000000000003', 'enterprise', 'yearly', -1, -1, 0.00, true)
ON CONFLICT (store_id) DO UPDATE SET
  plan = EXCLUDED.plan, billing_cycle = EXCLUDED.billing_cycle, max_categories = EXCLUDED.max_categories,
  max_products = EXCLUDED.max_products, price_egp = EXCLUDED.price_egp, is_active = EXCLUDED.is_active;

-- 5. Upsert Categories
INSERT INTO public.categories (id, store_id, name_ar, name_en, display_order) VALUES
  ('c1111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'المقبلات والشوربة', 'Appetizers & Soups', 1),
  ('c1111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'مشويات على الفحم', 'Charcoal Grills', 2),
  ('c2222222-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'القهوة المختصة', 'Specialty Coffee', 1),
  ('c2222222-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'مخبوزات طازجة', 'Fresh Pastries', 2),
  ('c3333333-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000003', 'الخضروات والفواكه', 'Fresh Produce', 1),
  ('c3333333-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003', 'الألبان والأجبان', 'Dairy & Cheese', 2)
ON CONFLICT (id) DO UPDATE SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en;

-- 6. Upsert Products
INSERT INTO public.products (id, store_id, category_id, name_ar, name_en, price, display_order, badges) VALUES
  ('p1111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000001', 'شوربة لسان عصفور', 'Orzo Soup', 45.00, 1, ARRAY['popular']),
  ('p1111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000002', 'كباب وكفتة مشكل', 'Mixed Kebab & Kofta', 280.00, 1, ARRAY['bestseller']),
  ('p2222222-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'c2222222-0000-0000-0000-000000000001', 'فلات وايت', 'Flat White', 75.00, 1, ARRAY['signature']),
  ('p2222222-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'c2222222-0000-0000-0000-000000000002', 'كرواسون زبدة فرنسي', 'French Butter Croissant', 60.00, 1, ARRAY['fresh']),
  ('p3333333-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000001', 'تفاح أحمر سكري (كجم)', 'Red Gala Apples (1kg)', 65.00, 1, ARRAY['fresh']),
  ('p3333333-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000002', 'جبنة فيتا طبيعية (500 جم)', 'Fresh Feta Cheese (500g)', 85.00, 1, ARRAY['organic'])
ON CONFLICT (id) DO UPDATE SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, price = EXCLUDED.price;
