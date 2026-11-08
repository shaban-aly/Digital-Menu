# Implementation Plan: Merchant Admin Dashboard

**Branch**: `003-merchant-admin-dashboard` | **Date**: 2026-11-08 | **Spec**: [specs/003-merchant-admin-dashboard/spec.md](file:///e:/Projects/digital-menu/specs/003-merchant-admin-dashboard/spec.md)

**Input**: Feature specification from `/specs/003-merchant-admin-dashboard/spec.md`

---

## Summary

Build a dedicated, responsive, bilingual Merchant Admin Dashboard for digital menu store owners. The dashboard enables full catalog management (instant item availability toggle, adding/editing/deleting items and categories), store profile and fulfillment configuration (WhatsApp receiving number, delivery fees, order types), and storefront QR code generator with printable tent cards. In accordance with the user's architectural strategy, the feature is implemented using an extensible **Mock Store Repository** with `localStorage` state persistence, guaranteeing an interactive prototype that syncs immediately with the customer menu, while providing clean repository interfaces ready for seamless Supabase database connection before production launch.

---

## Technical Context

**Language/Version**: TypeScript 5.7+ (Strict Mode, zero `any`, zero `@ts-ignore`)  
**Primary Dependencies**: Next.js 16+ App Router, React 19, Tailwind CSS v4, Lucide React, Zod v4, `qrcode`  
**Storage**: Client-side `localStorage` overlay atop initial mock data (`IStoreRepository` abstraction) → designed for 1-to-1 Supabase PostgreSQL migration  
**Testing**: Vitest v5+ (unit tests for store repository & validation schemas) and Playwright (end-to-end admin flows)  
**Target Platform**: Responsive Web (Mobile & Desktop browsers)  
**Project Type**: Next.js App Router Web Application  
**Performance Goals**: Instant stock toggles (< 100ms UI response), local persistence without page reload  
**Constraints**: Component limit <= 180 lines, zero native dialogs (`window.confirm` strictly prohibited; custom `ConfirmDialog` only), 100% logical directional CSS (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`)  
**Scale/Scope**: 3 demo store models (Oriental Grill, Aroma Cafe, Fresh Market), 4 primary tabs (Items, Categories, Settings, QR & Print)  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Compliance Status | Notes |
|:---|:---|:---:|:---|
| **I. Locked Tech Stack** | Next.js 16+, React 19, Tailwind v4, Zod v4, Supabase-ready | **PASSED** | Follows locked stack; uses Zod for runtime input validation. |
| **II. Strict Folder Structure** | `src/features/admin/`, `src/app/admin/`, `src/components/ui/` | **PASSED** | Admin feature scoped under `src/features/admin/` with thin routes in `src/app/admin/`. |
| **III. Component Line Limit** | Max 180 lines per component | **PASSED** | Decomposed into dedicated tab and card components (each <= 140 lines). |
| **III. Prohibition of Native Dialogs** | No `window.confirm()`, `window.alert()`, `window.prompt()` | **PASSED** | All deletions and warnings strictly use `src/components/ui/confirm-dialog.tsx`. |
| **III. Mandatory Shared UI Primitives** | Audit and reuse `src/components/ui/` | **PASSED** | Reuses `Modal`, `Button`, `ConfirmDialog`, `EmptyState`, and `Skeleton`. |
| **IV. Separation of Concerns** | Logic in services/hooks, UI presentational | **PASSED** | All mutations managed in `useStoreAdmin` hook and `StoreRepository`. |
| **V. Internationalization & RTL** | Bilingual AR/EN, zero physical CSS directions | **PASSED** | Full dictionary entries in `ar.json` and `en.json`; 100% logical CSS utilities. |

---

## Project Structure

### Documentation (this feature)

```text
specs/003-merchant-admin-dashboard/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Architectural decisions & state sync
├── data-model.md        # Entities & Zod validation schemas
├── contracts/
│   └── store-repository.md # Repository interface contract
├── quickstart.md        # Step-by-step validation guide
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Implementation tasks (/speckit-tasks output)
```

### Source Code Architecture

```text
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx               # Admin portal & store switcher
│   │   └── [slug]/
│   │       ├── page.tsx           # Thin route for specific store dashboard
│   │       └── print-qr/
│   │           └── page.tsx       # Dedicated print view for QR tent card
├── features/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── admin-header.tsx         # Store banner, tabs, language & theme switch
│   │   │   ├── items-tab.tsx            # Items table/grid, filter, and add trigger
│   │   │   ├── item-row-card.tsx        # Individual item row with stock toggle & actions
│   │   │   ├── item-form-modal.tsx      # Add/Edit item dialog form
│   │   │   ├── categories-tab.tsx       # Category manager with add/edit/delete
│   │   │   ├── category-modal.tsx       # Add/Edit category modal
│   │   │   ├── settings-tab.tsx         # WhatsApp phone, delivery fee, order type toggles
│   │   │   ├── qr-tab.tsx               # Store QR generator & Wi-Fi configuration
│   │   │   └── printable-tent-card.tsx  # Print layout for A4/A5 tent cards
│   │   ├── hooks/
│   │   │   ├── use-store-admin.ts       # Hook managing admin mutations and local state
│   │   │   └── use-store-qr.ts          # Hook managing QR canvas/image generation
│   │   ├── services/
│   │   │   ├── store-repository.ts      # IStoreRepository implementation (mock + localStorage)
│   │   │   └── qr-generator-service.ts  # QR generation utility
│   │   └── types.ts                     # Admin-specific TypeScript interfaces & Zod schemas
│   └── menu/                            # Customer menu connects to the same store repository
tests/
├── unit/
│   ├── store-repository.test.ts         # Unit tests for mutations, persistence & stock toggle
│   └── admin-validation.test.ts         # Zod schema validation tests
└── e2e/
    └── admin-dashboard.spec.ts          # Playwright test covering P1-P4 user stories
```

---

## Phase 0: Research & Decisions
See complete research details in [research.md](file:///e:/Projects/digital-menu/specs/003-merchant-admin-dashboard/research.md).
- Decided on **Store Repository Pattern** with `localStorage` overrides for immediate customer menu sync and zero-friction Supabase swap.
- Decided on `qrcode` library for high-res offline-capable vector/raster QR generation.
- Decided on component decomposition ensuring all files remain <= 180 lines.

---

## Phase 1: Design & Contracts
See design artifacts:
- [data-model.md](file:///e:/Projects/digital-menu/specs/003-merchant-admin-dashboard/data-model.md)
- [contracts/store-repository.md](file:///e:/Projects/digital-menu/specs/003-merchant-admin-dashboard/contracts/store-repository.md)
- [quickstart.md](file:///e:/Projects/digital-menu/specs/003-merchant-admin-dashboard/quickstart.md)

---

## Post-Design Constitution Check
Re-evaluated post-design: **100% Compliant**. All gates pass with zero constitutional violations. Ready for `/speckit-tasks`.
