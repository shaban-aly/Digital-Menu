-- Migration: 20261108000001_clean_reset_and_enums.sql
-- Description: Clean schema reset and PostgreSQL enum type definitions

-- 1. Drop existing tables if any
DROP TABLE IF EXISTS public.products, public.categories, public.stores, public.subscriptions, public.profiles CASCADE;

-- 2. Drop legacy enum types if any
DROP TYPE IF EXISTS public.business_type CASCADE;
DROP TYPE IF EXISTS public.plan_tier CASCADE;
DROP TYPE IF EXISTS public.billing_cycle CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- 3. Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 4. SaaS Business Type Enum
CREATE TYPE public.business_type AS ENUM (
  'restaurant',
  'cafe',
  'supermarket',
  'store'
);

-- 5. SaaS Plan Tier Enum
CREATE TYPE public.plan_tier AS ENUM (
  'free',
  'pro',
  'enterprise'
);

-- 6. Subscription Billing Cycle Enum
CREATE TYPE public.billing_cycle AS ENUM (
  'monthly',
  'yearly'
);

-- 7. User Role Enum
CREATE TYPE public.user_role AS ENUM (
  'merchant',
  'superadmin'
);
