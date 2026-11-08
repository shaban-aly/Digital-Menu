# Implementation Plan: Smart Operating Hours & Availability Engine

**Branch**: `005-smart-operating-hours`  
**Spec**: [spec.md](file:///e:/Projects/digital-menu/specs/005-smart-operating-hours/spec.md)  
**Date**: 2026-11-08  
**Constitution**: v2.2.0  

---

## 1. Technical Context & Scope

- **Objective**: Provide automated and manual control over store open/closed states, visually inform customers via header badges and schedule dialogs, and guard checkout with pre-order options.
- **Tech Stack**:
  - Next.js 16+ App Router, React 19, TypeScript Strict Mode.
  - Tailwind CSS v4 with 100% logical directional properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`).
  - Zod v4 schemas for schedule validation.
  - Vitest v5 for unit testing date/time evaluation.
  - Shared UI primitives: `Modal`, `Button`, `ConfirmDialog`.

---

## 2. Constitution Alignment Check

- [x] **File Size Limit (<= 180 lines)**: All new components and services are decomposed into standalone units (< 180 lines each).
- [x] **Zero Native Dialogs**: Zero `window.confirm`, `window.alert`, `window.prompt`.
- [x] **Shared UI Primitives**: Uses `src/components/ui/modal.tsx` and `src/components/ui/confirm-dialog.tsx`.
- [x] **Logical Directional CSS**: 100% logical properties used for all padding, margins, borders, and positioning.
- [x] **Strict Type Safety**: Zero `any`, zero `@ts-ignore`.
- [x] **Bilingual Support**: All strings externalized to `ar.json` and `en.json`.

---

## 3. Architecture & File Structure

```
src/
├── features/
│   ├── schedule/
│   │   ├── components/
│   │   │   ├── store-status-badge.tsx    # Header status pill (open/closed/break)
│   │   │   ├── schedule-modal.tsx        # 7-day operating hours modal
│   │   │   └── closed-guard-banner.tsx   # Cart drawer warning & pre-order disclaimer
│   │   ├── hooks/
│   │   │   └── use-store-schedule.ts     # Real-time reactive schedule evaluation hook
│   │   ├── services/
│   │   │   └── schedule-service.ts       # Pure algorithmic evaluation of open/closed/overnight
│   │   └── types.ts                      # Schedule types & Zod schemas
│   ├── admin/
│   │   └── components/
│   │       ├── operating-hours-editor.tsx # 7-day schedule configuration card in Store Settings
│   │       └── emergency-pause-switch.tsx # Rapid one-tap rush pause switch
│   └── cart/
│       └── services/
│           └── whatsapp-service.ts       # Add pre-order prefix if store is closed
tests/
└── unit/
    └── schedule-service.test.ts          # Comprehensive tests for normal, overnight, off-day, and pause states
```

---

## 4. Phase Breakdown

- **Phase 1: Foundation & Types**: Types, schemas, and `schedule-service.ts` with unit test suite.
- **Phase 2: Customer Status Badge & Modal**: Header pill in `restaurant-header.tsx` and weekly schedule popup.
- **Phase 3: Cart Guard & Pre-Ordering**: Closed banner in `cart-drawer.tsx` and `[طلب مسبق]` WhatsApp prefix.
- **Phase 4: Admin Schedule Editor & Rush Pause**: Schedule editor in `/admin/[slug]` Store Settings and instant pause switch.
- **Phase 5: Verification & Production Build**: Test suite, type-check, linter, and `npm run build`.
