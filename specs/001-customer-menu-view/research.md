# Research & Architecture Decisions: Customer Digital Menu View

**Feature**: `001-customer-menu-view`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Next.js App Router & Rendering Strategy

- **Decision**: Use Next.js 14+ App Router with Hybrid Rendering (Server-Side Pre-rendering for the menu shell and initial categories, combined with Client Components for dynamic interactivity like search filtering, sticky scroll-spy, and modals).
- **Rationale**: 
  - Meets the constitutional performance requirement of First Meaningful Paint under 2 seconds on 3G and initial compressed payload under 500 KB.
  - Server components fetch menu data directly from Supabase at request/build time without leaking keys or inflating client JavaScript.
  - Interactive features (client search, modal toggle, sticky navigation) run smoothly on the client without round-trips.
- **Alternatives Considered**:
  - *Full Single Page Application (Vite / React)*: Rejected by constitution (locked to Next.js App Router) and provides inferior first-paint on mobile 3G.
  - *Pure Static Site Generation (SSG)*: Menu items might change frequently in real restaurant scenarios; ISR or cached server fetches with Supabase provide better freshness without sacrificing cacheability.

---

## 2. Bilingual Support (AR/EN) & RTL Directional Layout

- **Decision**: Utilize route-based localization (`/[locale]/menu`) with dictionary-based translation files (`src/lib/i18n/ar.json` and `en.json`) and CSS logical properties.
- **Rationale**: 
  - Setting `dir="rtl"` or `dir="ltr"` on the root `<html>` tag dynamically based on the route parameter prevents hydration mismatch and layout flickering.
  - Strictly enforcing Tailwind logical CSS utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`, `start-*`, `end-*`) guarantees 100% adherence to Principle IV of the constitution.
- **Alternatives Considered**:
  - *Heavy third-party i18n libraries with dynamic loading*: Rejected to minimize initial JS payload under the 500 KB budget.
  - *Client-only localStorage language toggle*: Causes layout flashing (LTR -> RTL jump); server-rendered `[locale]` prevents layout shifts.

---

## 3. URL Hash Navigation for Item Detail Modal

- **Decision**: Drive the Item Detail Modal via URL hash (`#item-<id>`), listening to `hashchange` events and updating the hash when tapping cards.
- **Rationale**:
  - Allows customers to copy/share direct links to specific dishes (e.g. `https://menu.restaurant.com/ar/menu#item-101`).
  - Native mobile browser "Back" button seamlessly closes the modal instead of navigating away from the menu page.
  - No server round-trip required to display details; data is already in memory or cached locally.
- **Alternatives Considered**:
  - *React state only (`useState`)*: Fails user expectation on mobile when clicking the device back button (exits the app instead of closing the modal).
  - *Route intercepting / Next.js parallel routes*: Overly complex for a simple modal on a single-page digital menu; hash navigation is simpler, robust, and zero-overhead.

---

## 4. Arabic Search & Text Normalization

- **Decision**: Implement client-side Arabic string normalization using a dedicated utility function in `src/features/menu/services/search-normalization.ts`.
- **Rationale**:
  - Arabic users frequently omit diacritics (تشكيل) and mix variants of Alef (`أ`, `إ`, `آ`, `ا`), Taa Marbuta / Haa (`ة`, `ه`), and Yaa / Alif Maqsura (`ي`, `ى`).
  - Normalizing both query strings and item names/descriptions before comparison produces accurate, expected search results without missing items.
- **Normalization Rules**:
  1. Strip Harakat/Tashkeel: `[\u064B-\u065F\u0670]` -> empty string.
  2. Normalize Alef: `[أإآٱ]` -> `ا`.
  3. Normalize Taa Marbuta: `ة` -> `ه` (or vice versa consistently).
  4. Normalize Yaa / Alif Maqsura: `ى` -> `ي`.
- **Alternatives Considered**:
  - *Full-text search on PostgreSQL/Supabase*: Unnecessary latency and network requests for small/medium menus (~50–200 items); client-side search is sub-millisecond and works offline once loaded.

---

## 5. Sticky Category Bar & Scroll-Spy

- **Decision**: Combine CSS `position: sticky` with `IntersectionObserver` in `use-category-scroll.ts` to manage active section tracking and smooth scrolling.
- **Rationale**:
  - CSS sticky positioning ensures hardware-accelerated, zero-jank stickiness on mobile devices.
  - `IntersectionObserver` avoids expensive scroll event listeners that block the main thread.
  - Horizontal scrolling container with `scroll-snap-type: x mandatory` ensures smooth swiping across category chips.
- **Alternatives Considered**:
  - *Window scroll event listener with bounding rect calculations*: Causes scroll jank and violates performance budget on budget mobile devices.

---

## 6. Image Optimization & Storage (WebP/AVIF)

- **Decision**: Store original uploads in Supabase Storage bucket (`menu-images`) and serve them using Next.js Image component (`next/image`) with WebP/AVIF format auto-negotiation, quality=80, and `sizes` attribute.
- **Rationale**:
  - Constitutional Principle I & V mandate WebP/AVIF formats and lazy loading for off-screen images.
  - `next/image` handles responsive srcset, preventing 2MB high-res images from downloading on mobile 3G.
- **Alternatives Considered**:
  - *Raw `<img>` tags directly from Supabase Storage*: Transmits uncompressed files, easily blowing past the 500 KB page weight ceiling.

---

## 7. Currency Formatting (EGP / ج.م)

- **Decision**: Centralized currency formatting utility `formatCurrency(amount: number, locale: 'ar' | 'en')`:
  - Arabic (`ar`): `45 ج.م`
  - English (`en`): `45 EGP`
- **Rationale**:
  - Adheres directly to user clarification for Egyptian Pound.
  - Keeps formatting consistent across all cards and modal views.

