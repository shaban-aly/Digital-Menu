"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  Globe,
  Menu,
  X,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PlatformMobileMenu } from "./platform-mobile-menu";
import { cn } from "@/lib/utils";

export const PlatformHeader: React.FC = () => {
  const { locale, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAr = locale === "ar";

  const navLinks = [
    { href: "/", label: isAr ? "الرئيسية" : "Home" },
    { href: "/pricing", label: isAr ? "الأسعار والباقات" : "Pricing" },
    { href: "/dashboard", label: isAr ? "لوحة التاجر" : "Merchant Dashboard" },
    { href: "/admin", label: isAr ? "لوحة إدارة المنصة" : "Platform Admin" },
  ];

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 min-h-[44px]"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
            {isAr ? "المنيو الرقمي" : "Digital Menu"}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-neutral-600 dark:text-neutral-300">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors py-2 px-1 hover:text-brand-600 dark:hover:text-brand-400",
                  isActive && "text-brand-600 dark:text-brand-400 font-black"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            data-testid="header-lang-toggle"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors min-h-[40px] cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>{isAr ? "English" : "العربية"}</span>
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
                <UserIcon className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[110px]">
                  {user.fullName}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  {user.role === "superadmin"
                    ? isAr ? "مدير" : "Admin"
                    : isAr ? "تاجر" : "Merchant"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                data-testid="header-logout-btn"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors min-h-[40px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isAr ? "تسجيل خروج" : "Logout"}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                data-testid="header-login-btn"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:text-brand-600 transition-colors min-h-[40px] flex items-center"
              >
                {isAr ? "تسجيل الدخول" : "Sign In"}
              </Link>
              <Link
                href="/register"
                data-testid="header-register-btn"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-xs min-h-[40px] flex items-center"
              >
                {isAr ? "ابدأ مجاناً" : "Start Free"}
              </Link>
            </div>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLanguage}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-bold min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <PlatformMobileMenu
          navLinks={navLinks}
          isAr={isAr}
          user={isAuthenticated ? user : null}
          onClose={() => setMobileMenuOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </header>
  );
};
