"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile, AUTH_STATE_CHANGED_EVENT } from "../types";
import { AuthService } from "../services/auth-service";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface UseAuthReturn {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<UserProfile>;
  register: (
    email: string,
    fullName: string,
    password?: string
  ) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserProfile | null>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const current = await AuthService.getCurrentUser();
      setUser(current);
      return current;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    let authSubscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured()) {
      try {
        const { data } = supabase.auth.onAuthStateChange((event) => {
          if (
            event === "SIGNED_IN" ||
            event === "USER_UPDATED" ||
            event === "TOKEN_REFRESHED"
          ) {
            refreshUser();
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setIsLoading(false);
          }
        });
        authSubscription = data.subscription;
      } catch (err) {
        console.warn("Supabase auth state listener error:", err);
      }
    }

    const handleAuthEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ user: UserProfile | null }>;
      if (customEvent.detail && customEvent.detail.user !== undefined) {
        setUser(customEvent.detail.user);
      } else {
        refreshUser();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === "digital_menu_auth_user" ||
        event.key === "digital_menu_users"
      ) {
        refreshUser();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthEvent);
      window.addEventListener("storage", handleStorage);
    }

    return () => {
      if (authSubscription) authSubscription.unsubscribe();
      if (typeof window !== "undefined") {
        window.removeEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthEvent);
        window.removeEventListener("storage", handleStorage);
      }
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const loggedIn = await AuthService.login(email, password);
      setUser(loggedIn);
      return loggedIn;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, fullName: string, password?: string) => {
      setIsLoading(true);
      try {
        const res = await AuthService.register(email, fullName, password);
        setUser(res);
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };
}
