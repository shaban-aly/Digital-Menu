import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Sub-Agent 3: Forms & Dashboard Image Integration Audit", () => {
  const rootDir = process.cwd();
  const pricingPath = path.join(rootDir, "src/features/admin/components/item-pricing-fields.tsx");
  const modalPath = path.join(rootDir, "src/features/admin/components/item-form-modal.tsx");
  const profileFormPath = path.join(rootDir, "src/features/admin/components/store-profile-form.tsx");
  const settingsTabPath = path.join(rootDir, "src/features/admin/components/settings-tab.tsx");
  const typesPath = path.join(rootDir, "src/features/admin/types.ts");

  const files = [pricingPath, modalPath, profileFormPath, settingsTabPath, typesPath];

  it("should strictly respect the <= 180 lines limit per file", () => {
    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n").length;
      expect(lines, `${path.basename(filePath)} lines (${lines}) must be <= 180`).toBeLessThanOrEqual(180);
    });
  });

  it("should not use forbidden native browser dialogs (alert/confirm)", () => {
    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).not.toMatch(/\balert\s*\(/);
      expect(content).not.toMatch(/\bconfirm\s*\(/);
    });
  });

  it("should enforce directional logical CSS instead of physical CSS", () => {
    const physicalRegex = /(?:^|\s|")(?:pl-|pr-|ml-|mr-|text-left\b|text-right\b)/;
    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content, `${path.basename(filePath)} must not use physical CSS`).not.toMatch(physicalRegex);
    });
  });

  it("should have replaced manual url input with ImageUploadField in ItemPricingFields", () => {
    const content = fs.readFileSync(pricingPath, "utf-8");
    expect(content).not.toMatch(/type=["']url["']/);
    expect(content).toContain("<ImageUploadField");
    expect(content).toContain('folder="products"');
    expect(content).toContain("storeSlug={storeSlug}");
  });

  it("should pass storeSlug through ItemFormModal to ItemPricingFields", () => {
    const content = fs.readFileSync(modalPath, "utf-8");
    expect(content).toContain("storeSlug?: string");
    expect(content).toContain("storeSlug={storeSlug}");
  });

  it("should integrate store Logo and Cover image upload in StoreProfileForm", () => {
    const content = fs.readFileSync(profileFormPath, "utf-8");
    expect(content).toContain('folder="logos"');
    expect(content).toContain('aspectRatio="square"');
    expect(content).toContain('folder="covers"');
    expect(content).toContain('aspectRatio="cover"');
    expect(content).toContain("logo_url: logoUrl");
    expect(content).toContain("cover_url: coverUrl");
  });

  it("should validate optional or empty logo_url and cover_url in StoreSettingsSchema", () => {
    const content = fs.readFileSync(typesPath, "utf-8");
    expect(content).toContain("logo_url:");
    expect(content).toContain("cover_url:");
  });
});
