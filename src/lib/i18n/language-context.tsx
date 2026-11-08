"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Locale } from "@/types";

interface LanguageContextValue {
  locale: Locale;
  toggleLanguage: () => void;
  setLocale: (locale: Locale) => void;
}

const STORAGE_KEY = "app_locale";
const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "ar" || saved === "en") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      } else {
        document.documentElement.lang = "ar";
        document.documentElement.dir = "rtl";
      }
    } catch {
      // localStorage unavailable during SSR or incognito restrictions
    }
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    try {
      localStorage.setItem(STORAGE_KEY, nextLocale);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = nextLocale;
      document.documentElement.dir = nextLocale === "ar" ? "rtl" : "ltr";
    }
  };

  const toggleLanguage = () => {
    setLocale(locale === "ar" ? "en" : "ar");
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

