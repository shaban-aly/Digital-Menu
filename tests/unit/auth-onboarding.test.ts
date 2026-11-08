import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthService } from "@/features/auth/services/auth-service";
import { OnboardingService } from "@/features/onboarding/services/onboarding-service";
import { AUTH_STORAGE_KEY } from "@/features/auth/types";
import { STORES_MAP } from "@/features/menu/services/mock-menu-data";

describe("Auth & Onboarding Workflows", () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    for (const key in mockStorage) delete mockStorage[key];
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => {
        mockStorage[key] = val;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        for (const key in mockStorage) delete mockStorage[key];
      },
    });

    vi.stubGlobal("window", {
      localStorage: globalThis.localStorage,
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  describe("AuthService", () => {
    it("should register a new user and persist session in localStorage", async () => {
      const user = await AuthService.register(
        "chef@test.com",
        "Chef Tarek",
        "secret123"
      );

      expect(user.id).toBeDefined();
      expect(user.email).toBe("chef@test.com");
      expect(user.fullName).toBe("Chef Tarek");
      expect(user.role).toBe("merchant");
      expect(user.storeSlug).toBeNull();

      const storedSession = JSON.parse(mockStorage[AUTH_STORAGE_KEY]);
      expect(storedSession.email).toBe("chef@test.com");

      const currentUser = await AuthService.getCurrentUser();
      expect(currentUser?.id).toBe(user.id);
    });

    it("should reject duplicate registration with same email", async () => {
      await AuthService.register("dupe@test.com", "User One", "pass123");
      await expect(
        AuthService.register("dupe@test.com", "User Two", "pass456")
      ).rejects.toThrow();
    });

    it("should authenticate an existing user and handle bad credentials", async () => {
      await AuthService.register("login@test.com", "Ali Sami", "mypassword");

      const loggedIn = await AuthService.login("login@test.com", "mypassword");
      expect(loggedIn.email).toBe("login@test.com");

      await expect(
        AuthService.login("login@test.com", "wrongpassword")
      ).rejects.toThrow();

      await expect(
        AuthService.login("unknown@test.com", "any")
      ).rejects.toThrow();
    });

    it("should log out and clear active session", async () => {
      await AuthService.register("logout@test.com", "Logout User", "pass123");
      expect(await AuthService.getCurrentUser()).not.toBeNull();

      await AuthService.logout();
      expect(await AuthService.getCurrentUser()).toBeNull();
      expect(mockStorage[AUTH_STORAGE_KEY]).toBeUndefined();
    });
  });

  describe("OnboardingService & 1:1 Store Relationship", () => {
    it("should validate slug availability correctly", async () => {
      // Reserved slugs
      expect(await OnboardingService.checkSlugAvailability("admin")).toBe(false);
      expect(await OnboardingService.checkSlugAvailability("dashboard")).toBe(false);

      // Existing mock store
      expect(
        await OnboardingService.checkSlugAvailability("oriental-grill")
      ).toBe(false);

      // Invalid format
      expect(await OnboardingService.checkSlugAvailability("ab")).toBe(false);
      expect(
        await OnboardingService.checkSlugAvailability("Invalid Slug!")
      ).toBe(false);

      // Available unique slug
      expect(
        await OnboardingService.checkSlugAvailability("unique-cafe-2026")
      ).toBe(true);
    });

    it("should create new store and link 1:1 slug to user profile", async () => {
      const user = await AuthService.register(
        "owner@store.com",
        "Store Owner",
        "pass123"
      );
      expect(user.storeSlug).toBeNull();

      const newStore = await OnboardingService.createStore(
        {
          businessType: "cafe",
          nameAr: "كافيه النيل",
          nameEn: "Nile Cafe",
          slug: "nile-cafe",
          phoneNumber: "201012345678",
          deliveryFee: 15,
          selectedPlan: "free",
          billingCycle: "monthly",
        },
        user.id
      );

      expect(newStore.slug).toBe("nile-cafe");
      expect(newStore.business_type).toBe("cafe");
      expect(STORES_MAP["nile-cafe"]).toBeDefined();

      // Verify slug is now unavailable
      expect(await OnboardingService.checkSlugAvailability("nile-cafe")).toBe(false);

      // Verify user session was updated with storeSlug
      const updatedUser = await AuthService.getCurrentUser();
      expect(updatedUser?.storeSlug).toBe("nile-cafe");
    });

    it("should reject store creation when slug is taken", async () => {
      const user = await AuthService.register(
        "owner2@store.com",
        "Second Owner",
        "pass123"
      );

      await expect(
        OnboardingService.createStore(
          {
            businessType: "restaurant",
            nameAr: "مشويات الشرق",
            nameEn: "Oriental Grill",
            slug: "oriental-grill", // taken by base store
            phoneNumber: "201012345678",
            deliveryFee: 20,
            selectedPlan: "pro",
            billingCycle: "yearly",
          },
          user.id
        )
      ).rejects.toThrow();
    });
  });
});
