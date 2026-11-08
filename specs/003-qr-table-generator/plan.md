# Implementation Plan: QR Code Table Generator & Printable Cards

**Branch**: `003-qr-table-generator` | **Date**: 2026-11-08 | **Spec**: [spec.md](file:///e:/Projects/digital-menu/specs/003-qr-table-generator/spec.md)

**Input**: Feature specification from `/specs/003-qr-table-generator/spec.md`

## Summary

Build an autonomous, client-side QR Code Table Generator and Printable Tent Card system at `/menu/[slug]/qr`. The feature enables restaurant, café, and supermarket owners to generate batch QR codes (1 to 100 tables or storefront delivery QR), preview them in responsive tent card layouts with optional WiFi credentials and custom CTAs, download individual high-res PNG images, and print all cards in a 2-per-A4 page format via `@media print`. Additionally, scanning a table QR code automatically pre-fills the table number in the customer's cart.

## Technical Context

**Language/Version**: TypeScript 5+ (Strict mode), Next.js 16+ App Router (React 19).  
**Primary Dependencies**: `qrcode` (`^1.5.4`), `@types/qrcode` (`^1.5.5`), Tailwind CSS v4 (`@tailwindcss/postcss`), `lucide-react`.  
**Storage**: Client-side dynamic state + `localStorage` for cart pre-population (`cart_${slug}`).  
**Testing**: Vitest (`npm test`), Playwright (`npm run test:e2e`), strict TypeScript type-checking (`npm run type-check`).  
**Target Platform**: Mobile-first Web (iOS Safari, Android Chrome, desktop browsers, office printers).  
**Project Type**: Next.js App Router Web Application.  
**Performance Goals**: Generate 50-100 QR codes in <300ms pure client-side; initial page load under 500KB.  
**Constraints**: Zero native browser dialogs (`window.confirm`/`alert`/`prompt`); maximum 180 lines per file; 100% logical directional CSS (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`); minimum 44×44px touch targets.  
**Scale/Scope**: 3 pilot business models (`oriental-grill`, `specialty-cafe`, `fresh-market`), supporting 1-100 tables per merchant.  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Compliance Status | Justification / Implementation Detail |
|---|---|---|
| **I. Locked Tech Stack** | PASSED | Next.js 16, React 19, Tailwind v4, Zod v4, `qrcode` library already installed. No heavy UI libraries added. |
| **II. Strict Folder Structure** | PASSED | All feature code placed in `src/features/qr/` (`components/`, `hooks/`, `services/`, `types.ts`). Thin route in `src/app/menu/[slug]/qr/page.tsx`. |
| **III. Max 180 lines per file** | PASSED | Decomposing into 5 focused subcomponents: `TableCard`, `QRGeneratorForm`, `QRPreviewGrid`, `QRPrintHeader`, and `WiFiConfigFields`. |
| **III. Prohibition on Native Dialogs** | PASSED | Zero `window.confirm`/`window.alert`/`window.prompt`. Uses custom `ConfirmDialog` or feedback UI when needed. |
| **III. UI Primitives Reuse** | PASSED | Reuses `Button`, `Modal`, `ConfirmDialog` from `src/components/ui/`. |
| **IV. Mobile-First & RTL** | PASSED | 320px baseline layout; minimum 44×44px touch targets; 100% CSS logical properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`). Arabic (RTL) & English (LTR) via `LanguageContext`. |
| **V. Performance & Simplicity** | PASSED | Pure client-side generation; zero heavy PDF libraries; native CSS paged media for printing. |

## Project Structure

### Documentation (this feature)

```text
specs/003-qr-table-generator/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 data models & schemas
├── quickstart.md        # Phase 1 verification instructions
├── contracts/           # Phase 1 interface contracts
│   └── qr-service.ts    # QR generation service contract
└── tasks.md             # Phase 2 task checklist
```

### Source Code Layout

```text
src/
├── app/
│   └── menu/
│       └── [slug]/
│           ├── page.tsx               # Updated to accept ?table=N searchParam
│           └── qr/
│               └── page.tsx           # Route for QR generator (Server component delegating to feature)
├── features/
│   └── qr/
│       ├── types.ts                   # Types: TableQRCard, QRGeneratorConfig, QRMode
│       ├── services/
│       │   └── qr-service.ts          # Core service: generateQRCards, generateQRDataUrl, downloadQRImage
│       ├── hooks/
│       │   └── use-qr-generator.ts    # Hook managing QR state, debounced generation, and print triggers
│       └── components/
│           ├── qr-generator-screen.tsx # Main orchestrator (< 180 lines)
│           ├── qr-generator-form.tsx   # Config form (table count, prefix, toggles) (< 180 lines)
│           ├── wifi-config-fields.tsx  # Subcomponent for WiFi SSID & password (< 180 lines)
│           ├── qr-preview-grid.tsx     # Responsive cards grid & print container (< 180 lines)
│           └── table-card.tsx          # Single printable tent card with download button (< 180 lines)
tests/
├── unit/
│   └── qr-service.test.ts             # Unit tests for QR service and URL generation
└── e2e/
    └── qr-generator.spec.ts           # E2E test verifying generation, preview, and cart table auto-fill
```

## Complexity Tracking

*No constitutional violations; no extra complexity requiring justification.*
