# Quickstart & Verification Guide: Customer Digital Menu View

**Feature**: `001-customer-menu-view`  
**Date**: 2026-11-08  
**Status**: Ready  

This guide provides step-by-step instructions to set up, run, and verify the Customer Digital Menu feature locally and end-to-end.

---

## 1. Prerequisites

- **Node.js**: v20.x or higher (`node -v`)
- **Package Manager**: npm or pnpm
- **Supabase Account / Project**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Database schema and seed data applied (see [data-model.md](./data-model.md))

---

## 2. Environment Setup

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Install dependencies:
```bash
npm install
```

---

## 3. Database Seeding

Run the seed script or paste SQL from [data-model.md](./data-model.md) into the Supabase SQL Editor:
1. Ensure tables `restaurants`, `categories`, and `menu_items` exist.
2. Ensure sample categories (Appetizers, Main Courses, Desserts, Beverages) and items with Arabic and English titles/descriptions and EGP prices are inserted.
3. Ensure RLS policies allowing public select are active.

---

## 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000/ar/menu](http://localhost:3000/ar/menu) in your browser (preferably in Mobile Emulation mode: iPhone 14 or Pixel 7, 375×667 px).

---

## 5. End-to-End Verification Scenarios

### Scenario 1: Initial Load & Skeleton UI (P1)
1. In Chrome DevTools, throttle network to **Slow 3G**.
2. Refresh `http://localhost:3000/ar/menu`.
3. **Verify**: Animated skeleton placeholders appear for the header, sticky category chips, and card grid before real data renders. No sudden layout shifts occur.

### Scenario 2: Sticky Categories & Scroll-Spy (P1)
1. Scroll down the menu.
2. **Verify**: The horizontal category bar stays pinned to the top of the viewport.
3. Tap on "الحلويات" (Desserts).
4. **Verify**: The viewport smoothly scrolls to the Desserts heading, and the "الحلويات" chip highlights as active.

### Scenario 3: Language & RTL/LTR Toggle (P2)
1. Click the language toggle button in the header (e.g. "English").
2. **Verify**: URL changes or page re-renders in LTR (`/en/menu`), texts are in English, prices display as `45 EGP`, and layout switches from right-to-left to left-to-right without visual clipping.
3. Click "العربية".
4. **Verify**: Switched back to RTL, prices display as `45 ج.م`.

### Scenario 4: Real-time Arabic Search (P3)
1. In Arabic mode, type in the search bar: `لحم` (Meat).
2. **Verify**: Only items containing "لحم" appear immediately (<200ms).
3. Try typing with different Alef forms (e.g., `شاورما` or `أرز` vs `ارز`).
4. **Verify**: Arabic normalization correctly matches the items regardless of alef/hamza variation.
5. Clear the search input.
6. **Verify**: Full categorized menu returns.

### Scenario 5: Item Detail Modal via URL Hash (P2)
1. Tap any menu item card.
2. **Verify**: Modal opens displaying large image, full description, calories, and allergens.
3. **Verify**: Browser URL updates with `#item-<id>`.
4. Press the mobile device/browser **Back** button.
5. **Verify**: Modal closes, and user is back on the menu without page reload.

---

## 6. Automated Testing Commands

```bash
# Unit & integration tests
npm run test

# Type checking (TypeScript Strict Mode)
npm run type-check

# Linting & Formatting
npm run lint

# End-to-End Playwright tests
npm run test:e2e
```

