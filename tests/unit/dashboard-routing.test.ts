import { describe, it, expect, vi, beforeEach } from "vitest";
import { QuotaService } from "@/features/subscription/services/quota-service";
import { SubscriptionService } from "@/features/subscription/services/subscription-service";
import { MenuData, CategoryWithItems } from "@/features/menu/types";
import DashboardRootPage from "@/app/dashboard/page";
import MenuIndexPage from "@/app/menu/page";
import { UserProfile } from "@/features/auth/types";
import { OnboardingService } from "@/features/onboarding/services/onboarding-service";

const mockReplace = vi.fn();
const mockRedirect = vi.fn();

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useEffect: (fn: () => void) => {
      fn();
    },
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: vi.fn() }),
  redirect: (url: string) => mockRedirect(url),
}));

let mockUser: UserProfile | null = null;
let mockIsLoading = false;

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: () => ({
    user: mockUser,
    isLoading: mockIsLoading,
    isAuthenticated: !!mockUser,
  }),
}));

function createMockStore(cats: number, prods: number): MenuData {
  return {
    restaurant: {
      id: "rest_1", slug: "test-store", name_ar: "متجر تجريبي", name_en: "Test Store",
      business_type: "restaurant", description_ar: "", description_en: "", logo_url: "https://example.com/logo.png",
      phone_number: "201012345678", default_language: "ar", currency: "EGP",
      supported_order_types: ["dine_in", "takeaway", "delivery"], delivery_fee: 20,
    },
    categories: Array.from({ length: cats }, (_, c) => ({
      id: `cat_${c + 1}`, name_ar: `قسم ${c + 1}`, name_en: `Category ${c + 1}`, display_order: c + 1, is_active: true,
      items: Array.from({ length: prods }, (_, i) => ({
        id: `item_${c + 1}_${i + 1}`, category_id: `cat_${c + 1}`, name_ar: `صنف ${i + 1}`, name_en: `Item ${i + 1}`,
        short_desc_ar: "", short_desc_en: "", full_desc_ar: "", full_desc_en: "", price: 50,
        unit_ar: null, unit_en: null, image_url: null, display_order: i + 1, is_available: true, badges: [], allergens: [],
      })),
    })),
  };
}

describe("Dashboard Routing & 1-Account-1-Store Protection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect unauthenticated visitor to /login", () => {
    mockUser = null;
    mockIsLoading = false;
    DashboardRootPage();
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("should redirect authenticated merchant to their own store /dashboard/[storeSlug]", () => {
    mockUser = {
      id: "merchant-1", email: "merchant@test.com", fullName: "Ahmed Merchant",
      role: "merchant", storeSlug: "oriental-grill", createdAt: new Date().toISOString(),
    };
    mockIsLoading = false;
    DashboardRootPage();
    expect(mockReplace).toHaveBeenCalledWith("/dashboard/oriental-grill");
  });

  it("should redirect merchant without store to /onboarding", async () => {
    mockUser = {
      id: "merchant-new", email: "new@test.com", fullName: "New Merchant",
      role: "merchant", storeSlug: undefined, createdAt: new Date().toISOString(),
    };
    mockIsLoading = false;
    vi.spyOn(OnboardingService, "getUserStore").mockResolvedValue(null);

    DashboardRootPage();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockReplace).toHaveBeenCalledWith("/onboarding");
  });

  it("should redirect /menu without slug to /", () => {
    MenuIndexPage();
    expect(mockRedirect).toHaveBeenCalledWith("/");
  });
});

describe("QuotaService Calculations & Limits", () => {
  it("should enforce Free plan limits (max 7 categories, 50 products)", () => {
    const store = createMockStore(6, 5);
    const usage = QuotaService.getQuotaUsage(store, "free");

    expect(usage.categoriesCount).toBe(6);
    expect(usage.maxCategories).toBe(7);
    expect(usage.isCategoriesExceeded).toBe(false);
    expect(usage.productsCount).toBe(30);
    expect(usage.maxProducts).toBe(50);
    expect(usage.isProductsExceeded).toBe(false);

    expect(QuotaService.canAddCategory(store, "free")).toBe(true);
    expect(QuotaService.canAddProduct(store, "free")).toBe(true);
  });

  it("should block adding categories when Free plan reaches 7 categories", () => {
    const storeAtLimit = createMockStore(7, 2);
    const usage = QuotaService.getQuotaUsage(storeAtLimit, "free");

    expect(usage.categoriesCount).toBe(7);
    expect(usage.maxCategories).toBe(7);
    expect(usage.isCategoriesExceeded).toBe(true);
    expect(usage.categoriesUsagePercent).toBe(100);
    expect(QuotaService.canAddCategory(storeAtLimit, "free")).toBe(false);
  });

  it("should block adding products when Free plan reaches 50 products", () => {
    const storeAtLimit = createMockStore(5, 10);
    const usage = QuotaService.getQuotaUsage(storeAtLimit, "free");

    expect(usage.productsCount).toBe(50);
    expect(usage.maxProducts).toBe(50);
    expect(usage.isProductsExceeded).toBe(true);
    expect(usage.productsUsagePercent).toBe(100);
    expect(QuotaService.canAddProduct(storeAtLimit, "free")).toBe(false);
  });

  it("should allow higher capacities on Pro plan (50 categories, 500 products)", () => {
    const storeWith10Cats = createMockStore(10, 8);
    expect(QuotaService.canAddCategory(storeWith10Cats, "free")).toBe(false);
    expect(QuotaService.canAddCategory(storeWith10Cats, "pro")).toBe(true);
    expect(QuotaService.canAddProduct(storeWith10Cats, "pro")).toBe(true);

    const proUsage = QuotaService.getQuotaUsage(storeWith10Cats, "pro");
    expect(proUsage.maxCategories).toBe(50);
    expect(proUsage.maxProducts).toBe(500);
    expect(proUsage.isCategoriesExceeded).toBe(false);
  });

  it("should allow unlimited capacity on Enterprise plan", () => {
    const hugeStore = createMockStore(60, 20);
    expect(QuotaService.canAddCategory(hugeStore, "enterprise")).toBe(true);
    expect(QuotaService.canAddProduct(hugeStore, "enterprise")).toBe(true);
  });
});

describe("SubscriptionService WhatsApp URL Builder", () => {
  it("should generate a proper WhatsApp deep-link with store info and plan", () => {
    const url = SubscriptionService.buildUpgradeWhatsAppUrl({
      platformPhone: "+201099887766",
      storeName: "مطعم السعادة",
      storeSlug: "happiness-grill",
      targetPlan: "pro",
      billingCycle: "yearly",
    });

    expect(url).toContain("https://wa.me/201099887766");
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("مطعم السعادة");
    expect(decoded).toContain("happiness-grill");
    expect(decoded).toContain("Pro");
    expect(decoded).toContain("2,500");
  });
});
