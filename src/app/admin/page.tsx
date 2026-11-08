"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { SuperAdminService } from "@/features/admin/services/superadmin-service";
import { SuperAdminDashboard } from "@/features/admin/components/superadmin-dashboard";

export default function SuperAdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login?redirect=/admin");
      return;
    }

    let isMounted = true;
    SuperAdminService.isCurrentUserSuperAdmin().then((hasRole) => {
      if (!isMounted) return;
      if (hasRole || user.role === "superadmin") {
        setIsSuperAdmin(true);
      } else {
        setIsSuperAdmin(false);
        if (user.storeSlug) {
          router.replace(`/dashboard/${user.storeSlug}`);
        } else {
          router.replace("/dashboard");
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user, isLoading, router]);

  if (isLoading || isSuperAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return <SuperAdminDashboard />;
}
