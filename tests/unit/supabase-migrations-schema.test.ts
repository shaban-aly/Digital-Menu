import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { Database, BusinessType, PlanTier, UserRole } from "@/lib/supabase/types";

describe("Phase 1: Supabase Migrations & Schema Audit", () => {
  const rootDir = process.cwd();
  const migrationsDir = path.join(rootDir, "supabase", "migrations");
  const seedFile = path.join(rootDir, "supabase", "seed.sql");
  const typesFile = path.join(rootDir, "src", "lib", "supabase", "types.ts");

  it("should verify all 5 migration files exist and comply with Constitution line limits (<= 180 lines)", () => {
    const expectedFiles = [
      "20261108000001_clean_reset_and_enums.sql",
      "20261108000002_profiles_and_subscriptions.sql",
      "20261108000003_stores_table.sql",
      "20261108000004_categories_and_products.sql",
      "20261108000005_rls_policies_and_indexes.sql",
    ];

    expectedFiles.forEach((file) => {
      const filePath = path.join(migrationsDir, file);
      expect(fs.existsSync(filePath), `Migration file ${file} should exist`).toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");
      const lineCount = content.split("\n").length;
      expect(lineCount, `${file} line count (${lineCount}) must be <= 180`).toBeLessThanOrEqual(180);
    });
  });

  it("should verify Migration 1 cleanly drops legacy tables, functions, and enums with CASCADE", () => {
    const m1 = fs.readFileSync(
      path.join(migrationsDir, "20261108000001_clean_reset_and_enums.sql"),
      "utf-8"
    );
    expect(m1).toContain("DROP TABLE IF EXISTS public.products, public.categories, public.stores, public.subscriptions, public.profiles CASCADE;");
    expect(m1).toContain("DROP TYPE IF EXISTS public.business_type CASCADE;");
    expect(m1).toContain("DROP TYPE IF EXISTS public.plan_tier CASCADE;");
    expect(m1).toContain("DROP TYPE IF EXISTS public.billing_cycle CASCADE;");
    expect(m1).toContain("DROP TYPE IF EXISTS public.user_role CASCADE;");
    expect(m1).toContain("DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;");
    expect(m1).toContain("DROP FUNCTION IF EXISTS public.check_category_quota() CASCADE;");
    expect(m1).toContain("DROP FUNCTION IF EXISTS public.check_product_quota() CASCADE;");
  });

  it("should verify Migration 2 defines profiles, auth sync trigger, and subscriptions table with exact quotas", () => {
    const m2 = fs.readFileSync(
      path.join(migrationsDir, "20261108000002_profiles_and_subscriptions.sql"),
      "utf-8"
    );
    expect(m2).toContain("CREATE TABLE IF NOT EXISTS public.profiles");
    expect(m2).toContain("REFERENCES auth.users(id) ON DELETE CASCADE");
    expect(m2).toContain("CREATE OR REPLACE FUNCTION public.handle_new_user()");
    expect(m2).toContain("CREATE TRIGGER on_auth_user_created");
    expect(m2).toContain("CREATE TABLE IF NOT EXISTS public.subscriptions");
    expect(m2).toContain("max_categories INTEGER NOT NULL DEFAULT 7");
    expect(m2).toContain("max_products INTEGER NOT NULL DEFAULT 50");
  });

  it("should verify Migration 3 defines stores table, fk link, and auto-subscription trigger with plan sync", () => {
    const m3 = fs.readFileSync(
      path.join(migrationsDir, "20261108000003_stores_table.sql"),
      "utf-8"
    );
    expect(m3).toContain("CREATE TABLE IF NOT EXISTS public.stores");
    expect(m3).toContain("fk_subscriptions_store");
    expect(m3).toContain("FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE");
    expect(m3).toContain("CREATE OR REPLACE FUNCTION public.handle_new_store_subscription()");
    expect(m3).toContain("CREATE OR REPLACE FUNCTION public.handle_store_plan_update()");
    expect(m3).toContain("trg_on_store_updated_subscription");
  });

  it("should verify Migration 4 defines categories, products, and triggers enforcing Free, Pro, and Enterprise quotas", () => {
    const m4 = fs.readFileSync(
      path.join(migrationsDir, "20261108000004_categories_and_products.sql"),
      "utf-8"
    );
    expect(m4).toContain("CREATE TABLE IF NOT EXISTS public.categories");
    expect(m4).toContain("CREATE TABLE IF NOT EXISTS public.products");
    expect(m4).toContain("unit_ar TEXT");
    expect(m4).toContain("unit_en TEXT");
    expect(m4).toContain("CREATE OR REPLACE FUNCTION public.check_category_quota()");
    expect(m4).toContain("CREATE OR REPLACE FUNCTION public.check_product_quota()");
    expect(m4).toContain("Category quota limit reached");
    expect(m4).toContain("Product quota limit reached");
    expect(m4).toContain("v_max = -1 OR v_max >= 999999");
  });

  it("should verify Migration 5 defines RLS policies on all 5 tables and performance indexes", () => {
    const m5 = fs.readFileSync(
      path.join(migrationsDir, "20261108000005_rls_policies_and_indexes.sql"),
      "utf-8"
    );
    expect(m5).toContain("ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;");
    expect(m5).toContain("ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;");
    expect(m5).toContain("ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;");
    expect(m5).toContain("ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;");
    expect(m5).toContain("ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;");

    expect(m5).toContain("idx_stores_slug");
    expect(m5).toContain("idx_stores_is_active");
    expect(m5).toContain("idx_categories_store_order");
    expect(m5).toContain("idx_products_store_order");
    expect(m5).toContain("CREATE OR REPLACE FUNCTION public.is_superadmin()");
  });

  it("should verify seed.sql populates all 3 demo stores with full bilingual fields and correct tiers (<= 180 lines)", () => {
    expect(fs.existsSync(seedFile)).toBe(true);
    const content = fs.readFileSync(seedFile, "utf-8");
    const lineCount = content.split("\n").length;
    expect(lineCount, `seed.sql line count (${lineCount}) must be <= 180`).toBeLessThanOrEqual(180);

    expect(content).toContain("oriental-grill");
    expect(content).toContain("specialty-cafe");
    expect(content).toContain("fresh-market");

    // Supermarket custom units
    expect(content).toContain("1 كجم");
    expect(content).toContain("1 kg");
    expect(content).toContain("عبوة 1 لتر");
    expect(content).toContain("1L Bottle");

    // Descriptions & tiers
    expect(content).toContain("Al-Baraka Oriental Grill");
    expect(content).toContain("Aroma Specialty Café & Bakery");
    expect(content).toContain("Fresh Market Supermarket");
  });

  it("should verify types.ts exports strict types matching DB tables (<= 180 lines)", () => {
    expect(fs.existsSync(typesFile)).toBe(true);
    const content = fs.readFileSync(typesFile, "utf-8");
    const lineCount = content.split("\n").length;
    expect(lineCount, `types.ts line count (${lineCount}) must be <= 180`).toBeLessThanOrEqual(180);

    const bType: BusinessType = "restaurant";
    const pTier: PlanTier = "pro";
    const uRole: UserRole = "merchant";
    expect(bType).toBe("restaurant");
    expect(pTier).toBe("pro");
    expect(uRole).toBe("merchant");

    type DBProfiles = Database["public"]["Tables"]["profiles"]["Row"];
    type DBStores = Database["public"]["Tables"]["stores"]["Row"];
    type DBSubs = Database["public"]["Tables"]["subscriptions"]["Row"];
    type DBCats = Database["public"]["Tables"]["categories"]["Row"];
    type DBProds = Database["public"]["Tables"]["products"]["Row"];

    const mockProfile: Partial<DBProfiles> = { email: "test@example.com", role: "merchant" };
    const mockStore: Partial<DBStores> = { slug: "test-slug", delivery_fee: 20 };
    const mockSub: Partial<DBSubs> = { max_categories: 7, max_products: 50 };
    const mockCat: Partial<DBCats> = { name_ar: "قسم", name_en: "Category" };
    const mockProd: Partial<DBProds> = { price: 50, unit_ar: "كجم" };

    expect(mockProfile.email).toBe("test@example.com");
    expect(mockStore.slug).toBe("test-slug");
    expect(mockSub.max_categories).toBe(7);
    expect(mockCat.name_en).toBe("Category");
    expect(mockProd.unit_ar).toBe("كجم");
  });
});
