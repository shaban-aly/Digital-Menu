"use client";

import { useState, useMemo } from "react";
import { CategoryWithItems } from "@/features/menu/types";
import { Locale } from "@/types";
import { matchesSearch } from "../services/search-normalization";

export function useMenuSearch(
  categories: CategoryWithItems[],
  locale: Locale
) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }

    const isArabic = locale === "ar";
    const query = searchQuery.trim();

    return categories
      .map((cat) => {
        const matchingItems = cat.items.filter((item) => {
          const name = isArabic ? item.name_ar : item.name_en;
          const shortDesc = isArabic ? item.short_desc_ar : item.short_desc_en;
          const fullDesc = isArabic ? item.full_desc_ar : item.full_desc_en;

          return (
            matchesSearch(query, name, isArabic) ||
            matchesSearch(query, shortDesc, isArabic) ||
            matchesSearch(query, fullDesc, isArabic)
          );
        });

        return {
          ...cat,
          items: matchingItems,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery, locale]);

  const totalResults = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  return {
    searchQuery,
    setSearchQuery,
    filteredCategories,
    totalResults,
    isSearching: searchQuery.trim().length > 0,
    clearSearch: () => setSearchQuery(""),
  };
}

