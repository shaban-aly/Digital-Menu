import { describe, it, expect } from "vitest";
import {
  buildQRTargetUrl,
  generateQRDataUrl,
  generateQRCards,
} from "@/features/qr/services/qr-service";
import { DEFAULT_QR_CONFIG } from "@/features/qr/types";
import { Store } from "@/features/menu/types";

const mockRestaurant: Store = {
  id: "store-1",
  slug: "oriental-grill",
  name_ar: "مشويات الشرق",
  name_en: "Oriental Grill",
  business_type: "restaurant",
  description_ar: "أشهى المشويات",
  description_en: "Authentic grills",
  logo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200",
  phone_number: "201012345678",
  default_language: "ar",
  currency: "EGP",
  supported_order_types: ["dine_in", "takeaway", "delivery"],
  delivery_fee: 25,
};

const mockSupermarket: Store = {
  ...mockRestaurant,
  id: "store-3",
  slug: "fresh-market",
  name_ar: "فريش ماركت",
  name_en: "Fresh Market",
  business_type: "supermarket",
  supported_order_types: ["takeaway", "delivery"],
};

describe("QR Service", () => {
  describe("buildQRTargetUrl", () => {
    it("should build storefront url without table number", () => {
      const url = buildQRTargetUrl("https://example.com", "oriental-grill");
      expect(url).toBe("https://example.com/menu/oriental-grill");
    });

    it("should build table url when table number is provided", () => {
      const url = buildQRTargetUrl("https://example.com", "oriental-grill", 5);
      expect(url).toBe("https://example.com/menu/oriental-grill?table=5");
    });

    it("should handle trailing slashes in origin cleanly", () => {
      const url = buildQRTargetUrl("https://example.com///", "specialty-cafe", "VIP-1");
      expect(url).toBe("https://example.com/menu/specialty-cafe?table=VIP-1");
    });
  });

  describe("generateQRDataUrl", () => {
    it("should return a base64 image data url", async () => {
      const dataUrl = await generateQRDataUrl("https://example.com/test");
      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe("generateQRCards", () => {
    it("should generate specified number of table cards for restaurant", async () => {
      const config = {
        ...DEFAULT_QR_CONFIG,
        tableCount: 3,
        startNumber: 1,
      };

      const cards = await generateQRCards(mockRestaurant, config, "http://localhost:3000");
      expect(cards).toHaveLength(3);
      expect(cards[0].targetUrl).toBe("http://localhost:3000/menu/oriental-grill?table=1");
      expect(cards[1].targetUrl).toBe("http://localhost:3000/menu/oriental-grill?table=2");
      expect(cards[2].targetUrl).toBe("http://localhost:3000/menu/oriental-grill?table=3");
      expect(cards[0].qrDataUrl).toMatch(/^data:image\/png;base64,/);
    });

    it("should automatically default to storefront code for supermarket", async () => {
      const config = {
        ...DEFAULT_QR_CONFIG,
        tableCount: 15, // should be ignored for supermarket
      };

      const cards = await generateQRCards(mockSupermarket, config, "http://localhost:3000");
      expect(cards).toHaveLength(1);
      expect(cards[0].targetUrl).toBe("http://localhost:3000/menu/fresh-market");
      expect(cards[0].tableNumber).toBeUndefined();
    });

    it("should apply table prefix if specified", async () => {
      const config = {
        ...DEFAULT_QR_CONFIG,
        tableCount: 2,
        startNumber: 1,
        tablePrefix: "T-",
      };

      const cards = await generateQRCards(mockRestaurant, config, "http://localhost:3000");
      expect(cards[0].tableNumber).toBe("T-1");
      expect(cards[0].targetUrl).toBe("http://localhost:3000/menu/oriental-grill?table=T-1");
    });
  });
});
