-- Migration: 20261108000001_clean_reset_and_enums.sql
-- Description: Clean schema reset and PostgreSQL enum type definitions

-- 1. Cleanly drop old triggers on auth.users if auth schema exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  END IF;
END $$;

-- 2. Cleanly drop legacy functions if any
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_store_subscription() CASCADE;
DROP FUNCTION IF EXISTS public.handle_store_plan_update() CASCADE;
DROP FUNCTION IF EXISTS public.check_category_quota() CASCADE;
DROP FUNCTION IF EXISTS public.check_product_quota() CASCADE;
DROP FUNCTION IF EXISTS public.is_superadmin() CASCADE;

-- 3. Drop existing tables if any
DROP TABLE IF EXISTS public.products, public.categories, public.stores, public.subscriptions, public.profiles CASCADE;

-- 4. Drop legacy enum types if any
DROP TYPE IF EXISTS public.business_type CASCADE;
DROP TYPE IF EXISTS public.plan_tier CASCADE;
DROP TYPE IF EXISTS public.billing_cycle CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- 5. Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 6. SaaS Business Type Enum
CREATE TYPE public.business_type AS ENUM (
  'restaurant',
  'cafe',
  'supermarket',
  'store'
);

-- 7. SaaS Plan Tier Enum
CREATE TYPE public.plan_tier AS ENUM (
  'free',
  'pro',
  'enterprise',
  'pro_monthly',
  'pro_yearly'
);

-- 8. Subscription Billing Cycle Enum
CREATE TYPE public.billing_cycle AS ENUM (
  'monthly',
  'yearly'
);

-- 9. User Role Enum
CREATE TYPE public.user_role AS ENUM (
  'merchant',
  'superadmin'
);
