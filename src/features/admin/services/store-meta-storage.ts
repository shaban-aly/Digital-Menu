import { SuperAdminPlanKey } from "../types";

export const SUPERADMIN_STORAGE_KEY = "superadmin_stores_meta";

export interface LocalStoreMeta {
  plan: SuperAdminPlanKey;
  is_active: boolean;
}

const DEFAULT_STORE_META: Record<string, LocalStoreMeta> = {
  "oriental-grill": { plan: "pro_monthly", is_active: true },
  "specialty-cafe": { plan: "free", is_active: true },
  "fresh-market": { plan: "enterprise", is_active: true },
};

// In-memory fallback for SSR and testing environments
let memoryMeta: Record<string, LocalStoreMeta> = { ...DEFAULT_STORE_META };

export function getAllStoreMeta(): Record<string, LocalStoreMeta> {
  if (typeof window === "undefined") {
    return { ...memoryMeta };
  }
  try {
    const raw = window.localStorage.getItem(SUPERADMIN_STORAGE_KEY);
    return raw ? { ...DEFAULT_STORE_META, ...JSON.parse(raw) } : { ...DEFAULT_STORE_META };
  } catch {
    return { ...memoryMeta };
  }
}

export function getStoreMeta(slug: string): LocalStoreMeta {
  const all = getAllStoreMeta();
  return all[slug] || { plan: "free", is_active: true };
}

export function saveAllStoreMeta(meta: Record<string, LocalStoreMeta>): void {
  memoryMeta = { ...meta };
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SUPERADMIN_STORAGE_KEY, JSON.stringify(meta));
  } catch {
    // Graceful fallback to memoryMeta
  }
}

export function updateStoreMeta(slug: string, update: Partial<LocalStoreMeta>): LocalStoreMeta {
  const currentAll = getAllStoreMeta();
  const existing = currentAll[slug] || { plan: "free" as SuperAdminPlanKey, is_active: true };
  const updated: LocalStoreMeta = { ...existing, ...update };
  currentAll[slug] = updated;
  saveAllStoreMeta(currentAll);

  // Sync individual key for backward compatibility
  if (update.plan && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(`store_plan_${slug}`, update.plan);
    } catch {
      // Ignore storage errors
    }
  }

  return updated;
}

export function resetStoreMeta(): void {
  memoryMeta = { ...DEFAULT_STORE_META };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(SUPERADMIN_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
