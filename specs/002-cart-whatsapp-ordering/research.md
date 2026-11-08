# Research & Architecture Decisions: Cart & WhatsApp Ordering

**Feature**: `002-cart-whatsapp-ordering`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Client Cart State Management & Persistence

- **Decision**: Implement a native React Context (`CartContext` and custom hook `useCart`) in `src/features/cart/hooks/use-cart.tsx`, persisting state to browser `localStorage` under the key `digital_menu_cart_v1`.
- **Rationale**:
  - Adheres strictly to the constitutional Simplicity principle (Principle V / YAGNI): Avoids adding external state management libraries (e.g., Redux, Zustand) when standard React 19 Context provides instantaneous client-side reactivity for ~1–30 cart items with zero bundle overhead.
  - Automatic `localStorage` synchronization ensures that accidental mobile reloads, tab switches, or connection drops never wipe a customer's order.
  - An `isHydrated` state flag prevents server/client HTML hydration mismatches in Next.js 16 App Router.
- **Alternatives Considered**:
  - *Zustand / Redux Toolkit*: Extra npm dependencies violating Constitution Principle I (Locked Tech Stack) and Principle V (Dependency minimalism).
  - *Server-side cart sessions (Database/Cookies)*: Unnecessary latency and database writes for an anonymous, client-initiated digital menu where checkout happens via WhatsApp.

---

## 2. Cart Drawer / Sheet UI Architecture

- **Decision**: Deconstruct the cart UI into two focused, decoupled components:
  1. `src/features/cart/components/cart-bar.tsx`: A sticky floating bottom bar displaying item count, formatted total in EGP, and a "View Cart" action button.
  2. `src/features/cart/components/cart-drawer.tsx`: An accessible slide-up sheet / modal that reveals itemized details, quantity (+ / -) controls, delete actions, order notes, and the WhatsApp checkout button.
- **Rationale**:
  - Enforces Constitution Principle III (File size limit ≤ 180 lines). Splitting the bar and drawer prevents monolithic files and keeps both components easily readable and maintainable.
  - High z-index (`z-40` for bar, `z-50` for drawer) with backdrop blur provides a modern mobile-app experience on touchscreens.
- **Alternatives Considered**:
  - *Navigating to a separate `/cart` page*: Degrades mobile UX by requiring full page transitions and disrupting the customer's menu browsing flow. A slide-up drawer keeps the customer anchored on the menu.

---

## 3. WhatsApp Message Formatting & Deep Linking

- **Decision**: Centralize message generation in `src/features/cart/services/whatsapp-service.ts` using clean plain-text templates with emoji bullet points, formatted in the customer's active language (`ar` or `en`), and generate deep links via `https://wa.me/<phone>?text=<encoded_message>`.
- **Message Format (Arabic Example)**:
  ```text
  🍽️ *طلب جديد من منيو [اسم المطعم]*
  --------------------------
  📍 *نوع الطلب:* داخل المطعم
  🪑 *رقم الطاولة:* طاولة 4
  👤 *الاسم:* محمد أحمد

  📋 *تفاصيل الطلب:*
  • 2x كباب وكفتة مشوية (580 ج.م)
    _ملاحظة: بدون بصل_
  • 1x عصير مانجو فريش (50 ج.م)

  📝 *ملاحظات عامة:* برجاء تسوية اللحم جيداً
  --------------------------
  💰 *الإجمالي النهائي: 630 ج.م*
  ```
- **Rationale**:
  - Clear formatting with bold headers and bullets makes orders immediately readable for kitchen and service staff.
  - Using `encodeURIComponent` properly encodes Arabic characters, line breaks (`%0A`), and symbols across iOS, Android, and desktop WhatsApp Web.
- **Alternatives Considered**:
  - *Direct WhatsApp Business API*: Requires restaurant backend webhooks, access tokens, and monthly fees. Direct `wa.me` links are 100% free, instantaneous, and zero-maintenance.

---

## 4. Table Number Pre-filling via URL Parameters

- **Decision**: Extract `?table=<value>` using Next.js `useSearchParams()` on initial load, saving it into the cart state and pre-selecting "Dine-in" mode.
- **Rationale**:
  - Restaurants often print table-specific QR codes (e.g. `https://menu.com/ar/menu?table=12`). Pre-filling the table eliminates human error and accelerates the checkout process.
- **Alternatives Considered**:
  - *Hardcoding tables or requiring manual input only*: Increases waiter overhead when customers mistype their table numbers.

---

## 5. Bidirectional (RTL / LTR) & Currency Consistency

- **Decision**: Enforce CSS logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`) across all cart components and format all prices in Egyptian Pounds (`ج.م` / `EGP`) via the shared `formatCurrency` utility.
- **Rationale**:
  - 100% compliant with Constitution Principle IV (Mobile-First & RTL).
