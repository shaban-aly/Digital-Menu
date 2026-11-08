"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { OnboardingService } from "@/features/onboarding/services/onboarding-service";

export default function DashboardRootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "superadmin") {
      router.replace(user.storeSlug ? `/dashboard/${user.storeSlug}` : "/admin");
      return;
    }

    if (user.storeSlug) {
      router.replace(`/dashboard/${user.storeSlug}`);
      return;
    }

    let isMounted = true;
    OnboardingService.getUserStore(user.id)
      .then((slug) => {
        if (!isMounted) return;
        if (slug) {
          router.replace(`/dashboard/${slug}`);
        } else {
          router.replace("/onboarding");
        }
      })
      .catch(() => {
        if (isMounted) router.replace("/onboarding");
      });

    return () => {
      isMounted = false;
    };
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
    </div>
  );
}
