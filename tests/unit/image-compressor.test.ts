import { describe, it, expect, vi, afterEach } from "vitest";
import { compressImage } from "@/lib/storage/image-compressor";

function setupBrowserEnv(config?: {
  width?: number; height?: number; blobData?: string;
  contextNull?: boolean; failToBlob?: boolean; triggerError?: boolean; throwCreateUrl?: boolean;
}) {
  const { width = 2000, height = 1000, blobData = "small", contextNull, failToBlob, triggerError, throwCreateUrl } = config || {};
  const revokedUrls: string[] = [];

  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    width = width; height = height;
    set src(_val: string) {
      setTimeout(() => {
        if (triggerError && this.onerror) this.onerror();
        else if (this.onload) this.onload();
      }, 0);
    }
  }

  const mockCanvas = {
    width: 0, height: 0,
    getContext: vi.fn().mockReturnValue(contextNull ? null : { drawImage: vi.fn() }),
    toBlob: vi.fn().mockImplementation((cb: (b: Blob | null) => void, mime: string) => {
      cb(failToBlob ? null : new Blob([blobData], { type: mime }));
    }),
  };

  const globals = globalThis as unknown as Record<string, unknown>;
  globals.window = {};
  globals.document = { createElement: vi.fn().mockReturnValue(mockCanvas) };
  globals.HTMLCanvasElement = class {};
  globals.Image = MockImage;
  globals.URL = {
    createObjectURL: vi.fn().mockImplementation(() => {
      if (throwCreateUrl) throw new Error("createObjectURL failed");
      return "blob:mock-url";
    }),
    revokeObjectURL: vi.fn().mockImplementation((u: string) => revokedUrls.push(u)),
  };

  return {
    mockCanvas, revokedUrls,
    cleanup: () => {
      delete globals.window; delete globals.document;
      delete globals.HTMLCanvasElement; delete globals.Image; delete globals.URL;
    },
  };
}

describe("Image Compressor", () => {
  afterEach(() => { vi.restoreAllMocks(); });

  describe("Node.js / Unsupported Environment Fallback", () => {
    it("should safely return the original file in Node environment without crashing", async () => {
      const file = new File(["sample image bytes"], "product.jpg", { type: "image/jpeg" });
      expect(await compressImage(file)).toBe(file);
    });

    it("should bypass non-image, SVG, and GIF files without raster processing", async () => {
      const txt = new File(["hello"], "note.txt", { type: "text/plain" });
      const svg = new File(["<svg></svg>"], "logo.svg", { type: "image/svg+xml" });
      const gif = new File(["gifbytes"], "anim.gif", { type: "image/gif" });
      expect(await compressImage(txt)).toBe(txt);
      expect(await compressImage(svg)).toBe(svg);
      expect(await compressImage(gif)).toBe(gif);
    });
  });

  describe("Browser Environment Canvas Compression", () => {
    it("should downscale dimensions preserving aspect ratio and convert to WebP", async () => {
      const env = setupBrowserEnv({ width: 2400, height: 1200, blobData: "tiny" });
      try {
        const file = new File(["large-uncompressed-content-1234567890"], "item.png", { type: "image/png" });
        const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200 });
        expect(env.mockCanvas.width).toBe(1200);
        expect(env.mockCanvas.height).toBe(600);
        expect(compressed.name).toBe("item.webp");
        expect(compressed.type).toBe("image/webp");
        expect(env.revokedUrls).toContain("blob:mock-url");
      } finally {
        env.cleanup();
      }
    });

    it("should honor custom quality and mimeType options", async () => {
      const env = setupBrowserEnv({ width: 800, height: 600, blobData: "data" });
      try {
        const file = new File(["huge-bytes-content"], "photo.jpg", { type: "image/jpeg" });
        await compressImage(file, { quality: 0.5, mimeType: "image/jpeg" });
        expect(env.mockCanvas.toBlob).toHaveBeenCalledWith(expect.any(Function), "image/jpeg", 0.5);
      } finally {
        env.cleanup();
      }
    });

    it("should retain original dimensions when image is smaller than max constraints", async () => {
      const env = setupBrowserEnv({ width: 400, height: 300, blobData: "data" });
      try {
        const file = new File(["bytes"], "small.png", { type: "image/png" });
        await compressImage(file, { maxWidth: 1000, maxHeight: 1000 });
        expect(env.mockCanvas.width).toBe(400);
        expect(env.mockCanvas.height).toBe(300);
      } finally {
        env.cleanup();
      }
    });
  });

  describe("Resilient Error Handling", () => {
    it("should resolve original file and cleanup on image load error", async () => {
      const env = setupBrowserEnv({ triggerError: true });
      try {
        const file = new File(["corrupt"], "broken.jpg", { type: "image/jpeg" });
        expect(await compressImage(file)).toBe(file);
        expect(env.revokedUrls).toContain("blob:mock-url");
      } finally {
        env.cleanup();
      }
    });

    it("should resolve original file when canvas 2D context is unavailable", async () => {
      const env = setupBrowserEnv({ contextNull: true });
      try {
        const file = new File(["bytes"], "test.png", { type: "image/png" });
        expect(await compressImage(file)).toBe(file);
      } finally {
        env.cleanup();
      }
    });

    it("should resolve original file when toBlob returns null", async () => {
      const env = setupBrowserEnv({ failToBlob: true });
      try {
        const file = new File(["bytes"], "test.png", { type: "image/png" });
        expect(await compressImage(file)).toBe(file);
      } finally {
        env.cleanup();
      }
    });

    it("should resolve original file if URL.createObjectURL throws", async () => {
      const env = setupBrowserEnv({ throwCreateUrl: true });
      try {
        const file = new File(["bytes"], "test.png", { type: "image/png" });
        expect(await compressImage(file)).toBe(file);
      } finally {
        env.cleanup();
      }
    });
  });
});
