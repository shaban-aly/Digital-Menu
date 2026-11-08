import {
  UserProfile,
  StoredUserAccount,
  AUTH_STORAGE_KEY,
  USERS_STORAGE_KEY,
  AUTH_STATE_CHANGED_EVENT,
  UserRegistrationInputSchema,
  UserLoginInputSchema,
  UserProfileSchema,
} from "../types";

export function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}

export function notifyAuthChange(user: UserProfile | null) {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent(AUTH_STATE_CHANGED_EVENT, { detail: { user } })
      );
    } catch { /* noop */ }
  }
}

export function getStoredUsers(): StoredUserAccount[] {
  const storage = safeLocalStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveStoredUsers(users: StoredUserAccount[]) {
  const storage = safeLocalStorage();
  if (!storage) return;
  try { storage.setItem(USERS_STORAGE_KEY, JSON.stringify(users)); } catch {}
}

export async function fallbackGetUser(): Promise<UserProfile | null> {
  const storage = safeLocalStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validation = UserProfileSchema.safeParse(parsed);
    return validation.success ? validation.data : null;
  } catch { return null; }
}

export async function fallbackRegister(
  email: string,
  fullName: string,
  password = ""
): Promise<UserProfile> {
  const validated = UserRegistrationInputSchema.parse({
    email: email.trim().toLowerCase(),
    fullName: fullName.trim(),
    password: password || "temp123",
  });

  const users = getStoredUsers();
  if (users.some((u) => u.email === validated.email)) {
    throw new Error("البريد الإلكتروني مسجل بالفعل / Email already registered");
  }

  const newUser: StoredUserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: validated.email,
    fullName: validated.fullName,
    role: "merchant",
    storeSlug: null,
    createdAt: new Date().toISOString(),
    passwordHash: validated.password,
  };

  users.push(newUser);
  saveStoredUsers(users);

  const { passwordHash: _, ...userProfile } = newUser;
  const storage = safeLocalStorage();
  if (storage) {
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
  }
  notifyAuthChange(userProfile);
  return userProfile;
}

export async function fallbackLogin(
  email: string,
  password = ""
): Promise<UserProfile> {
  const validated = UserLoginInputSchema.parse({
    email: email.trim().toLowerCase(),
    password: password || "default",
  });

  const users = getStoredUsers();
  let account = users.find((u) => u.email === validated.email);

  if (!account) {
    if (validated.email === "admin@digitalmenu.eg") {
      account = {
        id: "usr_superadmin",
        email: "admin@digitalmenu.eg",
        fullName: "Platform Admin",
        role: "superadmin",
        storeSlug: null,
        createdAt: new Date().toISOString(),
        passwordHash: validated.password,
      };
      users.push(account);
      saveStoredUsers(users);
    } else {
      throw new Error(
        "الحساب غير موجود، يرجى التسجيل أولاً / Account not found, please register"
      );
    }
  }

  if (
    account.passwordHash &&
    validated.password !== "default" &&
    account.passwordHash !== validated.password
  ) {
    throw new Error("كلمة المرور غير صحيحة / Incorrect password");
  }

  const { passwordHash: _, ...userProfile } = account;
  const storage = safeLocalStorage();
  if (storage) {
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
  }
  notifyAuthChange(userProfile);
  return userProfile;
}

export async function fallbackUpdateStoreSlug(
  userId: string,
  storeSlug: string
): Promise<UserProfile> {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    users[idx] = { ...users[idx], storeSlug };
    saveStoredUsers(users);
    const { passwordHash: _, ...profile } = users[idx];
    return profile;
  }
  throw new Error("المستخدم غير موجود / User not found");
}
