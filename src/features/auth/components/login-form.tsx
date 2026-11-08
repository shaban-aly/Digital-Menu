"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";

export const LoginForm: React.FC = () => {
  const { locale } = useLanguage();
  const t = locale === "ar" ? arTranslations : enTranslations;
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.storeSlug) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mb-3">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
          {t.auth.login}
        </h1>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 flex items-start gap-3 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="flex-1 text-start leading-relaxed">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 text-start"
          >
            {t.auth.email}
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            dir="ltr"
            placeholder="merchant@example.com"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-start text-sm transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 text-start"
          >
            {t.auth.password}
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            dir="ltr"
            placeholder="••••••••"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-start text-sm transition-all"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[44px] text-sm font-bold flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{locale === "ar" ? "جارٍ الدخول..." : "Signing in..."}</span>
              </>
            ) : (
              <span>{t.auth.login}</span>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <span>{t.auth.dontHaveAccount} </span>
        <Link
          href="/register"
          className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 underline underline-offset-4 ms-1 min-h-[44px] inline-flex items-center"
        >
          {t.auth.register}
        </Link>
      </div>
    </div>
  );
};
