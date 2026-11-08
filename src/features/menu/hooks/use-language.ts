"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Locale } from "@/types";

export function useLanguage(initialLocale: Locale) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    const saved = sessionStorage.getItem("preferred_locale") as Locale | null;
    if (saved && (saved === "ar" || saved === "en") && saved !== initialLocale) {
      setLocale(saved);
      const newPath = pathname.replace(`/${initialLocale}`, `/${saved}`);
      router.replace(newPath);
    }
  }, [initialLocale, pathname, router]);

  const toggleLanguage = () => {
    const nextLocale: Locale = locale === "ar" ? "en" : "ar";
    setLocale(nextLocale);
    sessionStorage.setItem("preferred_locale", nextLocale);

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && (segments[0] === "ar" || segments[0] === "en")) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }

    router.push("/" + segments.join("/"));
  };

  return {
    locale,
    toggleLanguage,
  };
}

