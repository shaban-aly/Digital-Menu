import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const MenuSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-16">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-4 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="w-36 h-5" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
          <Skeleton className="w-24 h-9 rounded-full" />
        </div>
      </div>

      {/* Category Bar Skeleton */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-4 py-3 flex gap-2 overflow-hidden">
        <Skeleton className="w-24 h-10 rounded-full shrink-0" />
        <Skeleton className="w-28 h-10 rounded-full shrink-0" />
        <Skeleton className="w-20 h-10 rounded-full shrink-0" />
        <Skeleton className="w-32 h-10 rounded-full shrink-0" />
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4">
        <Skeleton className="w-36 h-6 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800"
            >
              <div className="flex-1 space-y-2 pe-3">
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-full h-3" />
                <Skeleton className="w-16 h-4 mt-3" />
              </div>
              <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

