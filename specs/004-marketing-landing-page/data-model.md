# Data Model: Marketing Landing Page & Platform Portal

**Feature**: `004-marketing-landing-page`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Entity Definitions & Types

### 1.1 `PricingPlan`
Represents platform subscription tiers:

```typescript
export interface PricingPlan {
  id: string;
  name_ar: string;
  name_en: string;
  badge_ar?: string;
  badge_en?: string;
  priceMonthly: number; // in EGP
  description_ar: string;
  description_en: string;
  features_ar: string[];
  features_en: string[];
  isPopular?: boolean;
  ctaText_ar: string;
  ctaText_en: string;
  whatsappMessage: string;
}
```

### 1.2 `FaqItem`
Represents frequently asked questions in the FAQ accordion:

```typescript
export interface FaqItem {
  id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
}
```

### 1.3 `BusinessSolution`
Highlights the tailored value proposition per vertical:

```typescript
export interface BusinessSolution {
  id: "restaurant" | "cafe" | "supermarket";
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  demoSlug: string;
  highlights_ar: string[];
  highlights_en: string[];
  badge_ar: string;
  badge_en: string;
}
```

### 1.4 `CalculatorState`
State for the ROI / Commission savings calculator:

```typescript
export interface CalculatorState {
  monthlyOrders: number; // Range: 50 - 2,500
  averageBasket: number; // Range: 50 - 1,000 EGP
  aggregatorRate: number; // Range: 12 - 25% (default: 18%)
}
```

---

## 2. Validation Schemas (Zod)

```typescript
import { z } from "zod";

export const calculatorStateSchema = z.object({
  monthlyOrders: z.number().int().min(10).max(10000).default(400),
  averageBasket: z.number().min(20).max(5000).default(220),
  aggregatorRate: z.number().min(5).max(35).default(18),
});
```
