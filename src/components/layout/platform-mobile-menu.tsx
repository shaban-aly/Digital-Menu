"use client";

import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { UserProfile } from "@/features/auth/types";

interface PlatformMobileMenuProps {
  navLinks: { href: string; label: string }[];
  isAr: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onLogout: () => void;
}

export const PlatformMobileMenu: React.FC<PlatformMobileMenuProps> = ({
  navLinks,
  isAr,
  user,
  onClose,
  onLogout,
}) => (
  <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-4 space-y-3">
    <nav className="flex flex-col space-y-1">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="px-3 py-2 rounded-xl text-sm font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          {link.label}
        </Link>
      ))}
    </nav>
    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
      {user ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-bold">
            <span>{user.fullName}</span>
            <span className="px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              {user.role === "superadmin" ? (isAr ? "مدير" : "Admin") : isAr ? "تاجر" : "Merchant"}
            </span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40"
          >
            <LogOut className="w-4 h-4" />
            <span>{isAr ? "تسجيل خروج" : "Logout"}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full flex items-center justify-center py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold"
          >
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="w-full flex items-center justify-center py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            {isAr ? "ابدأ مجاناً" : "Start Free"}
          </Link>
        </div>
      )}
    </div>
  </div>
);
