export interface ImageCompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/webp" | "image/jpeg" | "image/png" | string;
}

const DEFAULT_MAX_WIDTH = 1200;
const DEFAULT_MAX_HEIGHT = 1200;
const DEFAULT_QUALITY = 0.8;
const DEFAULT_MIME_TYPE = "image/webp";

/**
 * Checks if the current environment supports browser Canvas & Image APIs.
 */
function isCanvasSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined" &&
    typeof Image !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function"
  );
}

/**
 * Compresses an image file in the browser using HTML Canvas.
 * Safely falls back to returning the original file in non-browser or unsupported environments.
 */
export async function compressImage(
  file: File,
  options?: ImageCompressOptions
): Promise<File> {
  // If not running in browser, or SVG/GIF (preserve vector/animation), return original file
  if (!isCanvasSupported()) {
    return file;
  }

  const mime = file.type.toLowerCase();
  if (
    !mime.startsWith("image/") ||
    mime === "image/svg+xml" ||
    mime === "image/gif"
  ) {
    return file;
  }

  const targetMime = options?.mimeType || DEFAULT_MIME_TYPE;
  const quality = options?.quality ?? DEFAULT_QUALITY;
  const maxWidth = options?.maxWidth ?? DEFAULT_MAX_WIDTH;
  const maxHeight = options?.maxHeight ?? DEFAULT_MAX_HEIGHT;

  return new Promise<File>((resolve) => {
    let objectUrl = "";
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      return resolve(file);
    }

    const img = new Image();

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onload = () => {
      try {
        let { width, height } = img;

        // Calculate aspect-ratio-preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            cleanup();
            if (!blob) {
              return resolve(file);
            }

            const ext =
              targetMime === "image/webp"
                ? "webp"
                : targetMime === "image/png"
                  ? "png"
                  : "jpg";
            const originalName = file.name || "image";
            const baseName = originalName.replace(/\.[^/.]+$/, "");
            const newFileName = `${baseName}.${ext}`;

            const compressedFile = new File([blob], newFileName, {
              type: blob.type || targetMime,
              lastModified: Date.now(),
            });

            if (compressedFile.size < file.size) {
              resolve(compressedFile);
            } else if (file.type === targetMime) {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          targetMime,
          quality
        );
      } catch {
        cleanup();
        resolve(file);
      }
    };

    img.onerror = () => {
      cleanup();
      resolve(file);
    };

    img.src = objectUrl;
  });
}
