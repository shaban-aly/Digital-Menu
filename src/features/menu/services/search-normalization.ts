export function normalizeArabicText(text: string): string {
  if (!text) return "";

  return (
    text
      // Remove diacritics / tashkeel
      .replace(/[\u064B-\u065F\u0670]/g, "")
      // Normalize alef variants
      .replace(/[أإآٱ]/g, "ا")
      // Normalize taa marbuta
      .replace(/ة/g, "ه")
      // Normalize yaa and alif maqsura
      .replace(/ى/g, "ي")
      .trim()
      .toLowerCase()
  );
}

export function matchesSearch(
  query: string,
  targetText: string,
  isArabic: boolean
): boolean {
  if (!query) return true;
  if (!targetText) return false;

  if (isArabic) {
    const normalizedQuery = normalizeArabicText(query);
    const normalizedTarget = normalizeArabicText(targetText);
    return normalizedTarget.includes(normalizedQuery);
  }

  return targetText.toLowerCase().includes(query.toLowerCase().trim());
}

