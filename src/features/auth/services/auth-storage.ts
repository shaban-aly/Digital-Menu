import {
  UserProfile,
  StoredUserAccount,
  AUTH_STORAGE_KEY,
  USERS_STORAGE_KEY,
  AUTH_STATE_CHANGED_EVENT,
} from "../types";

export function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function notifyAuthChange(user: UserProfile | null) {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent(AUTH_STATE_CHANGED_EVENT, { detail: { user } })
      );
    } catch {
      // Ignore in non-browser env
    }
  }
}

export function getStoredUsers(): StoredUserAccount[] {
  const storage = safeLocalStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredUsers(users: StoredUserAccount[]) {
  const storage = safeLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed saving users", e);
  }
}

