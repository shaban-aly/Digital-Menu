import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { ImageUploadModal } from "@/components/ui/image-upload-modal";
import { ImageUploadField } from "@/components/ui/image-upload-field";

describe("Sub-Agent 2: Image Upload UI Components Audit", () => {
  const rootDir = process.cwd();
  const modalPath = path.join(rootDir, "src/components/ui/image-upload-modal.tsx");
  const fieldPath = path.join(rootDir, "src/components/ui/image-upload-field.tsx");

  it("should export ImageUploadModal and ImageUploadField components", () => {
    expect(ImageUploadModal).toBeDefined();
    expect(ImageUploadField).toBeDefined();
  });

  it("should strictly respect the <= 180 lines limit per component", () => {
    const modalContent = fs.readFileSync(modalPath, "utf-8");
    const modalLines = modalContent.split("\n").length;
    expect(modalLines, `ImageUploadModal lines (${modalLines}) must be <= 180`).toBeLessThanOrEqual(180);

    const fieldContent = fs.readFileSync(fieldPath, "utf-8");
    const fieldLines = fieldContent.split("\n").length;
    expect(fieldLines, `ImageUploadField lines (${fieldLines}) must be <= 180`).toBeLessThanOrEqual(180);
  });

  it("should not use forbidden native browser dialogs (alert/confirm)", () => {
    const modalContent = fs.readFileSync(modalPath, "utf-8");
    const fieldContent = fs.readFileSync(fieldPath, "utf-8");

    expect(modalContent).not.toMatch(/\balert\s*\(/);
    expect(modalContent).not.toMatch(/\bconfirm\s*\(/);
    expect(fieldContent).not.toMatch(/\balert\s*\(/);
    expect(fieldContent).not.toMatch(/\bconfirm\s*\(/);
  });

  it("should enforce directional logical CSS utilities instead of physical ones", () => {
    const modalContent = fs.readFileSync(modalPath, "utf-8");
    const fieldContent = fs.readFileSync(fieldPath, "utf-8");

    // Check for physical classes
    const physicalRegex = /(?:^|\s|")(?:pl-|pr-|ml-|mr-|text-left\b|text-right\b)/;
    expect(modalContent).not.toMatch(physicalRegex);
    expect(fieldContent).not.toMatch(physicalRegex);

    // Verify logical CSS usage
    expect(modalContent).toMatch(/text-start/);
    expect(fieldContent).toMatch(/text-start/);
  });

  it("should support both camera capture and device upload tabs and WebRTC/fallback", () => {
    const modalContent = fs.readFileSync(modalPath, "utf-8");

    // Camera capture attribute
    expect(modalContent).toContain('capture="environment"');
    expect(modalContent).toContain('accept="image/*"');
    // WebRTC mediaDevices API
    expect(modalContent).toContain("getUserMedia");
    // Drag and drop event handlers
    expect(modalContent).toContain("onDragOver");
    expect(modalContent).toContain("onDrop");
    // Upload progress indicator
    expect(modalContent).toContain("Loader2");
  });

  it("should support square and cover aspect ratios in ImageUploadField", () => {
    const fieldContent = fs.readFileSync(fieldPath, "utf-8");

    expect(fieldContent).toContain('aspectRatio === "cover"');
    expect(fieldContent).toContain("aspect-square");
  });
});
