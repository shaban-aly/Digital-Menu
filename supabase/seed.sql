-- Seed Data for 3 Core Demo Businesses & Superadmin
-- Compatible with local Supabase CLI and cloud environments

-- 1. Create Demo Users in auth.users if auth schema is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES
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
  email = EXCLUDED.email, full_name = EXCLUDED.full_name, role = EXCLUDED.role, store_slug = EXCLUDED.store_slug, updated_at = now();

-- 3. Upsert Stores
INSERT INTO public.stores (id, owner_id, slug, name_ar, name_en, business_type, description_ar, description_en, logo_url, phone_number, delivery_fee, supported_order_types, plan, is_active) VALUES
  ('11111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'oriental-grill', 'مطعم مشويات البركة', 'Al-Baraka Oriental Grill', 'restaurant', 'أشهى المشويات الشرقية، الطواجن البلدي، والمقبلات الفاخرة', 'Authentic oriental grills, traditional tagines, and appetizers', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&fit=crop', '201012345678', 25.00, ARRAY['dine_in', 'takeaway', 'delivery'], 'pro', true),
  ('22222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'specialty-cafe', 'كافيه ومخبوزات أروما', 'Aroma Specialty Café & Bakery', 'cafe', 'قهوة مختصة محضرة بأعلى المعايير، مع تشكيلة مخبوزات وحلويات فرنسية طازجة', 'Specialty coffee brewed with precision, along with artisan bakery & pastries', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&fit=crop', '201023456789', 15.00, ARRAY['dine_in', 'takeaway'], 'free', true),
  ('33333333-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'fresh-market', 'سوبر ماركت فريش ماركت', 'Fresh Market Supermarket', 'supermarket', 'خضروات وفواكه طازجة، ألبان وأجبان، ومنتجات بقالة وسلع تموينية يومية', 'Fresh produce, dairy & cheese, groceries, and daily essentials', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&fit=crop', '201034567890', 20.00, ARRAY['delivery', 'takeaway'], 'enterprise', true)
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, business_type = EXCLUDED.business_type,
  description_ar = EXCLUDED.description_ar, description_en = EXCLUDED.description_en,
  phone_number = EXCLUDED.phone_number, delivery_fee = EXCLUDED.delivery_fee,
  supported_order_types = EXCLUDED.supported_order_types, plan = EXCLUDED.plan, is_active = EXCLUDED.is_active, updated_at = now();

-- 4. Upsert Subscriptions
INSERT INTO public.subscriptions (store_id, plan, billing_cycle, max_categories, max_products, price_egp, is_active) VALUES
  ('11111111-0000-0000-0000-000000000001', 'pro', 'monthly', 50, 500, 250.00, true),
  ('22222222-0000-0000-0000-000000000002', 'free', 'monthly', 7, 50, 0.00, true),
  ('33333333-0000-0000-0000-000000000003', 'enterprise', 'yearly', -1, -1, 0.00, true)
ON CONFLICT (store_id) DO UPDATE SET
  plan = EXCLUDED.plan, billing_cycle = EXCLUDED.billing_cycle, max_categories = EXCLUDED.max_categories,
  max_products = EXCLUDED.max_products, price_egp = EXCLUDED.price_egp, is_active = EXCLUDED.is_active, updated_at = now();

-- 5. Upsert Categories
INSERT INTO public.categories (id, store_id, name_ar, name_en, display_order) VALUES
  ('c1111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'المقبلات والشوربة', 'Appetizers & Soups', 1),
  ('c1111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'المشويات على الفحم', 'Charcoal Grills', 2),
  ('c2222222-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'القهوة المختصة والمشروبات', 'Specialty Coffee & Beverages', 1),
  ('c2222222-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'المخبوزات والحلويات', 'Artisan Bakery & Sweets', 2),
  ('c3333333-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000003', 'الخضروات والفواكه الطازجة', 'Fresh Produce & Fruits', 1),
  ('c3333333-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003', 'الألبان والأجبان والبقالة', 'Dairy, Eggs & Groceries', 2)
ON CONFLICT (id) DO UPDATE SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, display_order = EXCLUDED.display_order, updated_at = now();

-- 6. Upsert Products with Full Bilingual Details and Custom Units
INSERT INTO public.products (id, store_id, category_id, name_ar, name_en, short_desc_ar, short_desc_en, full_desc_ar, full_desc_en, price, unit_ar, unit_en, image_url, display_order, is_available, badges, allergens) VALUES
  ('p1111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000001',
   'شوربة لسان عصفور بالمستكة', 'Orzo Soup with Mastic',
   'شوربة لسان عصفور غنية بمرقة اللحم والمستكة الطبيعية', 'Rich orzo soup with meat broth and natural mastic',
   'شوربة لسان عصفور بلدي محضرة بعناية مع مرق اللحم الطازج ونكهة المستكة والحبهان وقطع لحم ناعمة، تقدم مع ليمون طازج.',
   'Traditional orzo soup prepared with fresh meat broth, mastic, cardamom, and tender meat bites. Served with fresh lemon.',
   55.00, 'طبق', 'Bowl', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&fit=crop', 1, true, ARRAY['best_seller'], ARRAY['gluten']),

  ('p1111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000002',
   'مشكل كباب وكفتة ضاني', 'Mixed Lamb Kebab & Kofta',
   'قطع لحم ضاني بلدي مشوية على الفحم مع كفتة متبلة', 'Tender lamb chunks and spiced kofta grilled over hot charcoal',
   'طبق مشويات ملكي يحتوي على سيخ كباب ضاني وسيخين كفتة بلدي مشوية على الفحم الطبيعي، يقدم مع أرز بسمتي بالمكسرات وطحينة وسلطة خضراء وخبز صاج.',
   'Charcoal-grilled tender lamb chunks and two skewers of seasoned lamb kofta. Served with basmati rice, tahini, and salad.',
   290.00, 'وجبة', 'Meal', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&fit=crop', 1, true, ARRAY['best_seller'], ARRAY['gluten']),

  ('p2222222-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'c2222222-0000-0000-0000-000000000001',
   'سبانش لاتيه مثلج', 'Iced Spanish Latte',
   'إسبريسو غني مع حليب مكثف محلى وحليب بارد ومكعبات ثلج', 'Double espresso with condensed milk, fresh milk and ice',
   'مزيج فاخر من الإسبريسو الإثيوبي الفاخر مع حليب مكثف وحليب طازج بارد، توازن مثالي بين حلاوة الحليب وقوة القهوة.',
   'Double shot of single-origin espresso blended with sweetened milk and cold whole milk over ice.',
   85.00, 'كوب 350 مل', '350 ml Cup', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&fit=crop', 1, true, ARRAY['best_seller'], ARRAY['dairy']),

  ('p2222222-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'c2222222-0000-0000-0000-000000000002',
   'كرواسون زبدة فرنسي فاخر', 'French Butter Croissant',
   'مخبوز طازج يومياً بطبقات هشة من زبدة بريتاني الفرنسية', 'Flaky golden layers made with French churned butter',
   'كرواسون كلاسيكي مقرمش من الخارج وطري مورق من الداخل، مخبوز يومياً باستخدام زبدة فرنسية طبيعية 100%.',
   'Traditional French croissant with flaky crust and honeycomb interior, freshly baked each morning.',
   60.00, 'قطعة', 'Piece', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&fit=crop', 1, true, ARRAY['best_seller', 'vegetarian'], ARRAY['gluten', 'dairy']),

  ('p3333333-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000001',
   'طماطم بلدي فرز أول طازجة', 'Fresh Local Tomatoes (Grade A)',
   'طماطم بلدي حمراء متماسكة من المزرعة مباشرة للمطبخ', 'Ripe and firm local vine tomatoes delivered fresh',
   'طماطم طازجة منتقاة بعناية فائقة، خالية من العيوب ومثالية للسلطات والصلصات المنزلية اليومية.',
   'Hand-picked ripe red tomatoes directly from Egyptian farms, perfect for everyday salads and cooking.',
   22.00, '1 كجم', '1 kg', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&fit=crop', 1, true, ARRAY['vegetarian'], ARRAY[]::text[]),

  ('p3333333-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000002',
   'حليب بقري كامل الدسم', 'Full Cream Cow Milk',
   'حليب طبيعي مبستر 100% بدون أي مواد حافظة', '100% pasteurized fresh whole milk bottle',
   'حليب بقري نقي مبستر ومغلف بطريقة صحية للحفاظ على القيمة الغذائية ونكهة الحليب الطبيعي الغنية.',
   'Pure whole milk freshly pasteurized with full natural cream, rich in calcium and vitamin D.',
   44.00, 'عبوة 1 لتر', '1L Bottle', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&fit=crop', 1, true, ARRAY['best_seller'], ARRAY['dairy'])
ON CONFLICT (id) DO UPDATE SET
  name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, short_desc_ar = EXCLUDED.short_desc_ar,
  short_desc_en = EXCLUDED.short_desc_en, full_desc_ar = EXCLUDED.full_desc_ar, full_desc_en = EXCLUDED.full_desc_en,
  price = EXCLUDED.price, unit_ar = EXCLUDED.unit_ar, unit_en = EXCLUDED.unit_en,
  image_url = EXCLUDED.image_url, display_order = EXCLUDED.display_order, is_available = EXCLUDED.is_available,
  badges = EXCLUDED.badges, allergens = EXCLUDED.allergens, updated_at = now();
