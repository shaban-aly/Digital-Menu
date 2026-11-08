# Implementation Plan: Marketing Landing Page & Platform Portal

**Branch**: `004-marketing-landing-page` | **Date**: 2026-11-08 | **Spec**: [spec.md](file:///e:/Projects/digital-menu/specs/004-marketing-landing-page/spec.md)

**Input**: Feature specification from `/specs/004-marketing-landing-page/spec.md`

## Summary

Build an autonomous, high-converting Marketing Landing Page at route `/` (`src/app/page.tsx`) that elevates Digital Menu from a testing portal to a production-grade commercial platform. The landing page features a compelling bilingual Hero, an interactive in-browser Smartphone Simulator, tailored industry solutions (Restaurants, Cafes, Supermarkets), a real-time Commission Savings Calculator, subscription pricing tiers, an FAQ accordion, and direct WhatsApp onboarding links.

## Technical Context

**Language/Version**: TypeScript 5+ (Strict mode), Next.js 16+ App Router, React 19.  
**Primary Dependencies**: Tailwind CSS v4 (`@tailwindcss/postcss`), `lucide-react`, Zod v4.  
**Storage**: Client-side reactive state (`useState`) + in-place `LanguageContext` (`localStorage`).  
**Testing**: Vitest (`npm test`), Playwright (`npm run test:e2e`), `npm run type-check`.  
**Target Platform**: Mobile-first Web (320px baseline to 4K displays).  
**Performance Goals**: First Contentful Paint < 1.0s; total compressed page payload < 450 KB; zero iframes.  
**Constraints**: Maximum 180 lines per file; 100% logical directional CSS (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`); minimum 44×44px touch targets; zero native browser dialogs.  
**Scale/Scope**: Fully responsive marketing homepage covering 3 business verticals.  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Compliance Status | Justification / Implementation Detail |
|---|---|---|
| **I. Locked Tech Stack** | PASSED | Next.js 16, React 19, Tailwind v4, Zod v4, zero heavy external UI libraries. |
| **II. Strict Folder Structure** | PASSED | Thin page at `src/app/page.tsx` delegating to `src/features/landing/components/` and `src/features/landing/services/`. |
| **III. Max 180 lines per file** | PASSED | Decomposed into 9 focused components (Navbar, Hero, PhoneSimulator, Solutions, Calculator, Pricing, FAQ, Footer, PageView). |
| **III. Prohibition on Native Dialogs** | PASSED | Zero `window.alert` / `confirm` / `prompt`. |
| **III. UI Primitives Reuse** | PASSED | Inspects and reuses `src/components/ui/` primitives (`Button`, `EmptyState`, etc.). |
| **IV. Mobile-First & RTL** | PASSED | 320px baseline; minimum 44×44px touch targets; 100% CSS logical properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`); in-place RTL/LTR via `LanguageContext`. |
| **V. Performance & Simplicity** | PASSED | Pure React/CSS smartphone simulator without heavy `<iframe>` overhead. Payload < 450KB. |

## Project Structure

### Documentation (this feature)

```text
specs/004-marketing-landing-page/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 data models & schemas
├── quickstart.md        # Phase 1 verification instructions
├── contracts/           # Phase 1 interface contracts
│   └── landing-contracts.ts
└── tasks.md             # Phase 2 task checklist
```

### Source Code Layout

```text
src/
├── app/
│   └── page.tsx                         # Thin server/client route delegating to LandingPageView (<50 lines)
├── features/
│   └── landing/
│       ├── types.ts                     # PricingPlan, FaqItem, BusinessSolution, CalculatorState (<70 lines)
│       ├── services/
│       │   └── landing-data.ts          # Static content, pricing plans, solutions, and ROI math (<130 lines)
│       └── components/
│           ├── landing-page-view.tsx    # Master container connecting all sections (<100 lines)
│           ├── landing-navbar.tsx       # Header navigation, logo, lang toggle, WhatsApp CTA (<90 lines)
│           ├── hero-section.tsx         # Headline, value propositions, and live demo badges (<120 lines)
│           ├── phone-simulator.tsx      # Interactive smartphone preview with live reactive cart (<160 lines)
│           ├── solutions-section.tsx    # Restaurant, Café, and Supermarket tailored cards (<140 lines)
│           ├── roi-calculator.tsx       # Commission savings interactive calculator (<150 lines)
│           ├── pricing-section.tsx      # Transparent subscription plans & WhatsApp actions (<140 lines)
│           ├── faq-section.tsx          # Accessible interactive accordion (<130 lines)
│           └── landing-footer.tsx       # Footer links and copyright notice (<80 lines)
tests/
├── unit/
│   └── roi-calculator.test.ts          # Unit tests verifying savings and turnover formulas
└── e2e/
    └── landing-page.spec.ts             # E2E test verifying hero, language switch, calculator, and links
```

## Complexity Tracking

*No constitutional violations; no extra complexity requiring justification.*
