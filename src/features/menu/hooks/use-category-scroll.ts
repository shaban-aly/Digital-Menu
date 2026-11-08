"use client";

import { useState, useEffect, useRef } from "react";
import { CategoryWithItems } from "@/features/menu/types";

export function useCategoryScroll(categories: CategoryWithItems[]) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id || ""
  );
  const isUserScrollingRef = useRef(false);

  useEffect(() => {
    if (!categories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserScrollingRef.current) return;

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries[0];
          const catId = topEntry.target.getAttribute("data-category-id");
          if (catId) {
            setActiveCategoryId(catId);
          }
        }
      },
      {
        rootMargin: "-120px 0px -60% 0px",
        threshold: 0,
      }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(`category-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    isUserScrollingRef.current = true;

    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Scroll active chip into view inside CategoryBar
    const chip = document.getElementById(`category-chip-${categoryId}`);
    if (chip) {
      chip.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 800);
  };

  return {
    activeCategoryId,
    scrollToCategory,
  };
}

