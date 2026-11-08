# Research: QR Code Table Generator & Printable Cards

**Feature**: `003-qr-table-generator`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Client-Side QR Code Generation Engine

### Problem / Context
We need to generate between 1 and 100 QR codes dynamically on the client without sending requests to external APIs (e.g., Google Charts API or third-party QR services) to ensure instant rendering (<500ms), zero network reliance, and full offline/local capability.

### Technical Decision
Use the already-installed `qrcode` package with client-side async `QRCode.toDataURL()` and `QRCode.toString()` (SVG mode).
- **Format**: PNG Data URL for `<img />` rendering and one-click download; SVG format optionally for ultra-sharp vectors.
- **Error Correction Level**: Level `'H'` (~30% error recovery) or `'M'` (~15% error recovery). We select Level `'M'` as optimal balance between data density (cleaner, less cluttered modules for fast mobile camera recognition) and durability for restaurant table use (dirt/scratches).
- **Module Margins (Quiet Zone)**: `margin: 2` modules to prevent camera framing issues while keeping cards compact.
- **Colors**: Foreground `#0f172a` (Slate 900) or `#000000` (Pure Black), Background `#ffffff` (Pure White).

### Alternatives Evaluated
1. *External QR API (api.qrserver.com / Google Charts)*: Rejected because it breaks offline capability, introduces network latency, and poses privacy/uptime concerns.
2. *`react-qr-code` / `qrcode.react`*: Rejected because `qrcode` is already installed in `package.json` (`^1.5.4`), supports node + browser, and allows direct canvas/dataURL extraction without extra React wrappers (abiding by Principle V: Dependency minimalism).

---

## 2. Print Architecture & A4 Tent-Card Layout

### Problem / Context
Table cards must print reliably on standard A4 paper (or US Letter) from any office or restaurant printer. They must:
- Fit 2 cards per sheet (ideal table tent format ~ 13cm × 18cm or A5 equivalent).
- Force page breaks cleanly between card pairs (`page-break-after: always`).
- Strip out navigation bars, header buttons, configuration forms, and footers (`@media print`).
- Enforce pure white background, pure black ink, and high-contrast borders even if the user views the screen in dark mode.

### Technical Decision
- Use Tailwind CSS v4 `@media print` utilities: `print:hidden`, `print:block`, `print:bg-white`, `print:text-black`, `print:shadow-none`, `print:border-slate-300`.
- Use CSS Paged Media properties via a dedicated print stylesheet/utility class:
  ```css
  @media print {
    @page {
      size: A4 portrait;
      margin: 1cm;
    }
    .print-card-grid {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 1.5cm !important;
    }
    .print-card-item {
      break-inside: avoid;
      page-break-inside: avoid;
      height: calc(50vh - 1.5cm);
      max-height: 13.5cm;
    }
  }
  ```
- Trigger printing via custom UI button invoking `window.print()` safely.

### Alternatives Evaluated
1. *PDF generation library (jsPDF / pdfmake)*: Rejected due to bundle size (>300KB), which violates Principle V (Page weight < 500KB) and Constitution Rule I (no heavy libraries without justification). Browser native `window.print()` with CSS paged media achieves pixel-perfect output with zero runtime bloat.

---

## 3. High-Resolution PNG Download Mechanism

### Problem / Context
Merchants need to download individual table QR cards as standalone PNG images (e.g., `qr-table-5.png`) to send to professional print shops or laser engravers.

### Technical Decision
- Each generated item produces a high-res PNG Data URL (`width: 600px`, `margin: 2`).
- A download helper creates a synthetic `<a download="qr-table-[number].png" href="dataUrl">` and triggers `.click()`.
- Clean, 100% native, zero dependencies.

---

## 4. Origin Resolution in Next.js App Router

### Problem / Context
In Next.js App Router, server-rendered components do not have access to `window.location.origin` without reading `headers()`. Furthermore, client environments in local testing might be `http://localhost:3000`, while production could be `https://menuby.app`.

### Technical Decision
- The QR generator page `src/app/menu/[slug]/qr/page.tsx` will be a thin Server Component that resolves the store via `getMockStoreBySlug(slug)` and passes store details to the Client Component `QRGeneratorScreen`.
- In `QRGeneratorScreen`, origin is resolved client-side via `typeof window !== 'undefined' ? window.location.origin : ''` with fallback or optional custom domain override.
- The generated URL strictly follows `${origin}/menu/${storeSlug}?table=${tableNumber}` (or `${origin}/menu/${storeSlug}` for retail/supermarket).

---

## 5. Integration with Customer Cart (Table Auto-Fill)

### Problem / Context
When a customer scans a table QR code (`/menu/oriental-grill?table=7`), the landing page should automatically capture `table=7` from `searchParams` and pre-fill the cart's dine-in table number.

### Technical Decision
- In `src/app/menu/[slug]/page.tsx`, read `searchParams` (`await searchParams`).
- Pass optional `initialTableNumber` to the menu view / cart provider.
- If `table` query parameter is present:
  - Default order type to `dine_in`.
  - Automatically populate `tableNumber` state in `useCart` / cart storage.
- Customer immediately sees table number locked or pre-filled in their cart!

