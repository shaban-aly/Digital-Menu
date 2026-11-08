import { describe, it, expect } from "vitest";
import {
  normalizeArabicText,
  matchesSearch,
} from "@/features/menu/services/search-normalization";

describe("search-normalization", () => {
  it("should normalize alef variants correctly", () => {
    expect(normalizeArabicText("أرز")).toBe("ارز");
    expect(normalizeArabicText("إفطار")).toBe("افطار");
    expect(normalizeArabicText("شوربة بالأعشاب")).toBe("شوربه بالاعشاب");
  });

  it("should strip harakat / diacritics", () => {
    expect(normalizeArabicText("شَوْرَبَةٌ")).toBe("شوربه");
    expect(normalizeArabicText("كَبَابٌ مَشْوِيّ")).toBe("كباب مشوي");
  });

  it("should normalize taa marbuta and yaa variants", () => {
    expect(normalizeArabicText("طحينة")).toBe("طحينه");
    expect(normalizeArabicText("شامي")).toBe("شامي");
    expect(normalizeArabicText("حلوى")).toBe("حلوي");
  });

  it("should match queries regardless of alef variation", () => {
    const isMatched = matchesSearch("ارز", "أرز بالخلطة", true);
    expect(isMatched).toBe(true);

    const isTaaMatched = matchesSearch("طحينه", "حمص بالطحينة", true);
    expect(isTaaMatched).toBe(true);
  });
});

