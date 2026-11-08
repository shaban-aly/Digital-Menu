# Implementation Plan: Customer Digital Menu View

**Branch**: `001-customer-menu-view` | **Date**: 2026-11-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-customer-menu-view/spec.md`

## Summary

Build a mobile-first, bilingual (Arabic RTL / English LTR) digital menu
browsing experience for restaurant customers. The page displays the
restaurant identity, a sticky horizontal category bar with scroll-spy,
item cards with badges and availability status, instant client-side
search, and an item detail modal with allergen and calorie information.
The stack is Next.js App Router + TypeScript + Tailwind CSS + Supabase,
deployed on Vercel, following a feature-sliced architecture inside
`src/`.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) on Node.js 20+

**Primary Dependencies**: Next.js 16+ App Router (Turbopack, async `params`),
React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), `@supabase/supabase-js`,
`@supabase/ssr`, Zod v4, Lucide React

**Storage**: Supabase (PostgreSQL) — read-only queries for this feature;
Supabase Storage for menu-item images (WebP/AVIF)

**Testing**: Vitest v5 (unit), Playwright (E2E / integration)

**Target Platform**: Mobile-first responsive web (320 px – 1440 px),
deployed on Vercel

**Project Type**: Web application (Next.js App Router, SSR + CSR)

**Performance Goals**: < 500 KB initial compressed payload, < 2 s first
meaningful paint on 3G, < 200 ms search filtering per keystroke

**Constraints**: All directional CSS via logical properties (ms-/me-/
ps-/pe-/text-start/text-end), no `any`/`@ts-ignore`, max 180 lines per
component file, Zod validation for all runtime inputs

**Scale/Scope**: Single restaurant, ~5–15 categories, ~50–200 menu
items, public read-only access, no authentication

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | Locked Technology Stack | ✅ PASS | Next.js 16+ App Router (Turbopack, async params) + React 19 + TS strict + Tailwind CSS v4 + Supabase + Vercel. Zod v4 for validation. |
| II | Strict Folder Structure | ✅ PASS | Source layout below follows `src/app/`, `src/features/menu/`, `src/components/ui/`, `src/lib/`, `src/types/`. |
| III | Code & Component Rules | ✅ PASS | 180-line limit enforced. Presentational components + service/hook separation. kebab-case files, PascalCase components, camelCase functions. No `any`/`@ts-ignore`. |
| IV | Mobile-First & RTL | ✅ PASS | 320 px baseline, 44×44 px touch targets. Full AR/EN with RTL/LTR toggle. Logical properties only (ms-/me-/ps-/pe-/text-start/text-end). |
| V | Performance & Simplicity | ✅ PASS | < 500 KB payload, lazy-load off-screen images, YAGNI (only what spec.md requires), dependency minimalism. |

**Gate result: ✅ ALL PASS — proceed to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-customer-menu-view/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── menu-api.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, metadata, i18n provider
│   ├── page.tsx                      # Home redirect or landing
│   └── [locale]/
│       └── menu/
│           └── page.tsx              # Thin route: fetches data, renders MenuPage
│
├── features/
│   └── menu/
│       ├── components/
│       │   ├── restaurant-header.tsx # Restaurant name, logo, language toggle
│       │   ├── category-bar.tsx      # Sticky horizontal category chips
│       │   ├── menu-section.tsx      # Category heading + item cards grid
│       │   ├── menu-item-card.tsx    # Individual item card
│       │   ├── item-detail-modal.tsx # Full item details overlay
│       │   ├── menu-search.tsx       # Search input with filtering
│       │   ├── badge-list.tsx        # Badge indicators (spicy, veg, best seller)
│       │   └── menu-page.tsx         # Orchestrator: assembles all menu components
│       ├── hooks/
│       │   ├── use-menu-data.ts      # Fetches and caches menu data from Supabase
│       │   ├── use-category-scroll.ts# Scroll-spy + smooth scroll to category
│       │   ├── use-menu-search.ts    # Client-side search/filter logic
│       │   └── use-language.ts       # Language state and toggle
│       ├── services/
│       │   ├── menu-service.ts       # Supabase queries: categories, items
│       │   └── image-service.ts      # Image URL builder with format/size params
│       └── types.ts                  # MenuItem, Category, Badge, Allergen types
│
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── modal.tsx
│       ├── skeleton.tsx              # Loading skeleton placeholder
│       ├── error-state.tsx           # Error with retry action
│       ├── empty-state.tsx           # "No results" display
│       └── image-placeholder.tsx     # Fallback for missing images
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser Supabase client
│   │   └── server.ts                # Server-side Supabase client
│   ├── i18n/
│   │   ├── config.ts                # Supported locales, default locale
│   │   ├── ar.json                  # Arabic translations
│   │   └── en.json                  # English translations
│   └── utils.ts                     # Shared utility functions
│
└── types/
    └── index.ts                     # Project-wide shared types (e.g., Locale)

tests/
├── e2e/
│   ├── menu-browsing.spec.ts
│   ├── language-switch.spec.ts
│   └── search.spec.ts
└── unit/
    ├── use-menu-search.test.ts
    └── menu-service.test.ts
```

**Structure Decision**: Feature-sliced architecture under `src/features/menu/`
as mandated by the constitution (Principle II). The `menu` feature encapsulates
all components, hooks, services, and types for the customer menu view. Shared
UI primitives live in `src/components/ui/`. Database clients and i18n config
live in `src/lib/`.

## Complexity Tracking

> No constitution violations detected. This section is intentionally empty.
