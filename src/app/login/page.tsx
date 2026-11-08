"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  const { locale, toggleLanguage } = useLanguage();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.storeSlug) {
        router.push(`/dashboard/${user.storeSlug}`);
      } else {
        router.push("/onboarding");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between p-4 sm:p-6">
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-neutral-900 dark:text-neutral-100 font-black text-lg min-h-[44px]"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span>{locale === "ar" ? "المنيو الرقمي" : "Digital Menu"}</span>
        </Link>

        <button
          onClick={toggleLanguage}
          type="button"
          aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors inline-flex items-center gap-1.5"
        >
          <Globe className="w-4 h-4" />
          <span>{locale === "ar" ? "English" : "العربية"}</span>
        </button>
      </header>

      <main className="w-full my-auto py-8">
        <LoginForm />
      </main>

      <footer className="text-center py-4 text-xs text-neutral-400">
        © {new Date().getFullYear()}{" "}
        {locale === "ar"
          ? "منصة المنيو الرقمي — جميع الحقوق محفوظة"
          : "Digital Menu Platform — All Rights Reserved"}
      </footer>
    </div>
  );
}
