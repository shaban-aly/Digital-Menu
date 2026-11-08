const PHRASE_DICTIONARY: Record<string, string> = {
  "شاورما البرنس": "Prince Shawarma",
  "مطعم البركة": "Al-Baraka Restaurant",
  "مشويات البركة": "Al-Baraka Grills",
  "مطعم السعادة": "Happiness Restaurant",
  "كافيه الشرق": "Orient Cafe",
  "كباب مشوي": "Grilled Kebab",
  "كفتة بلدي": "Traditional Kofta",
  "شيش طاووق": "Shish Tawook",
  "شاورما لحم": "Beef Shawarma",
  "شاورما دجاج": "Chicken Shawarma",
  "عصير مانجو طازج": "Fresh Mango Juice",
  "عصير برتقال طازج": "Fresh Orange Juice",
  "سلطة خضراء": "Green Salad",
  "طازج ولذيذ": "Fresh and delicious",
  "محضر من أجود المكونات": "Prepared with the finest ingredients",
  "يقدم مع الأرز والسلطة": "Served with rice and salad",
  "يقدم مع الخبز والطحينة": "Served with bread and tahini",
};

const WORD_DICTIONARY: Record<string, string> = {
  مشويات: "Grills",
  مقبلات: "Appetizers",
  سلطات: "Salads",
  سلطة: "Salad",
  شوربة: "Soup",
  شوربات: "Soups",
  مشروبات: "Beverages",
  عصائر: "Juices",
  عصير: "Juice",
  حلويات: "Desserts",
  سندوتشات: "Sandwiches",
  ساندوتش: "Sandwich",
  برجر: "Burger",
  بيتزا: "Pizza",
  مكرونة: "Pasta",
  باستا: "Pasta",
  أرز: "Rice",
  رز: "Rice",
  طاجن: "Tagine",
  حواوشي: "Hawawshi",
  وجبات: "Meals",
  وجبة: "Meal",
  فطور: "Breakfast",
  غداء: "Lunch",
  عشاء: "Dinner",
  لحوم: "Meat",
  لحم: "Meat",
  دجاج: "Chicken",
  فراخ: "Chicken",
  سمك: "Fish",
  أسماك: "Fish",
  مأكولات: "Cuisine",
  بحرية: "Seafood",
  كباب: "Kebab",
  كفتة: "Kofta",
  شاورما: "Shawarma",
  بطاطس: "French Fries",
  جبنة: "Cheese",
  شاي: "Tea",
  قهوة: "Coffee",
  ماء: "Water",
  مياه: "Water",
  كافيه: "Cafe",
  مطعم: "Restaurant",
  سوبرماركت: "Supermarket",
  متجر: "Store",
  البرنس: "Prince",
  البركة: "Baraka",
  السعادة: "Happiness",
  الشرق: "Orient",
  مشوي: "Grilled",
  مقلي: "Fried",
  مقرمش: "Crispy",
  طازج: "Fresh",
  لذيذ: "Delicious",
  شهي: "Tasty",
  حار: "Spicy",
  بارد: "Cold",
  ساخن: "Hot",
  كبير: "Large",
  وسط: "Medium",
  صغير: "Small",
  عائلي: "Family Size",
  خاص: "Special",
};

const CHAR_MAP: Record<string, string> = {
  أ: "a", إ: "e", آ: "aa", ا: "a", ب: "b", ت: "t", ث: "th", ج: "j",
  ح: "h", خ: "kh", د: "d", ذ: "th", ر: "r", ز: "z", س: "s", ش: "sh",
  ص: "s", ض: "d", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f", ق: "q",
  ك: "k", ل: "l", م: "m", ن: "n", ه: "h", و: "w", ي: "y", ى: "a",
  ة: "a", ئ: "", ؤ: "o", ء: "",
};

function transliterateWord(arabicWord: string): string {
  let res = "";
  for (const ch of arabicWord) {
    res += CHAR_MAP[ch] ?? ch;
  }
  return res ? res.charAt(0).toUpperCase() + res.slice(1).toLowerCase() : "";
}

function translateSingleWord(word: string): string {
  const clean = word.replace(/^[،,.\-—–/]+|[،,.\-—–/]+$/g, "");
  if (!clean) return word;

  if (WORD_DICTIONARY[clean]) return WORD_DICTIONARY[clean];

  // Try removing definite article 'ال'
  if (clean.startsWith("ال") && clean.length > 3) {
    const withoutAl = clean.slice(2);
    if (WORD_DICTIONARY[withoutAl]) {
      return WORD_DICTIONARY[withoutAl];
    }
  }

  return transliterateWord(clean);
}

export async function translateArabicToEnglish(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  // 1. Direct phrase lookup
  if (PHRASE_DICTIONARY[trimmed]) {
    return PHRASE_DICTIONARY[trimmed];
  }

  // 2. Direct word lookup
  if (WORD_DICTIONARY[trimmed]) {
    return WORD_DICTIONARY[trimmed];
  }

  // 3. Word by word translation
  const words = trimmed.split(/\s+/);
  if (words.length === 1) {
    return translateSingleWord(words[0]);
  }

  const translatedWords = words.map(translateSingleWord);
  return translatedWords.join(" ");
}

export async function requestAiTranslation(text: string): Promise<string> {
  if (!text || !text.trim()) return "";
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim() }),
    });
    if (res.ok) {
      const json: { translation?: string } = await res.json();
      if (json.translation) return json.translation;
    }
  } catch {
    // Fallback gracefully to client translation helper
  }
  return translateArabicToEnglish(text);
}

export const TranslationService = {
  translateArabicToEnglish,
  requestAiTranslation,
};
