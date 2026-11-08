<!--
## Sync Impact Report
- Version change: 2.0.0 → 2.1.0
- Modified principles:
  - I. Locked Technology Stack (Explicit version locking: Next.js 16+, React 19, Tailwind CSS v4, Zod v4, @supabase/ssr, ESLint v9)
- Added sections: (none)
- Removed sections: (none)
- Follow-up TODOs: (none)
-->
# Digital Menu Constitution

## Core Principles

### I. Locked Technology Stack

The following technology stack is mandatory for the entire project.
No substitutions, alternative frameworks, or heavy UI library additions
are permitted without explicit written approval.

- **Framework**: Next.js 16+ App Router (Turbopack, async `params`/`searchParams`)
  with React 19 and TypeScript (`strict: true`).
- **Styling**: Tailwind CSS v4 only (`@tailwindcss/postcss` with CSS-first
  `@theme` configuration in `globals.css`). Installing heavy UI component
  libraries (e.g., Material UI, Ant Design, Chakra UI) is prohibited
  without explicit approval.
- **Database & Backend**: Supabase (PostgreSQL) using `@supabase/supabase-js`
  and `@supabase/ssr`. All menu-item images MUST be stored and served in
  WebP or AVIF format, compressed.
- **Hosting**: Vercel.
- **Validation**: Zod v4+ for all runtime input validation and schema
  definitions.
- **Linting & Testing**: ESLint v9 (Flat Config `eslint.config.mjs`) and
  Vitest v5+.
- **Internationalization**: All user-facing strings MUST be
  externalizable from the first feature; hard-coded display text is
  prohibited.

### II. Strict Folder Structure

All application code MUST reside inside `src/`. Creating application
source files outside `src/` (except root-level configuration files) is
prohibited. The following directory layout is mandatory:

- `src/app/` — Route handlers and layouts only. Route files MUST be
  thin: no complex business logic, no direct database calls. They
  delegate to feature services and render feature components.
- `src/features/<feature-name>/` — Feature-sliced architecture. Each
  feature (e.g., `menu`, `cart`, `categories`, `admin`) MUST contain:
  - `components/` — UI components scoped to this feature.
  - `hooks/` — Custom React hooks scoped to this feature.
  - `services/` — Data fetching, mutations, and business logic.
  - `types.ts` — TypeScript types and interfaces for this feature.
- `src/components/ui/` — Shared, reusable UI primitives only (buttons,
  cards, modals, inputs). Feature-specific components MUST NOT reside
  here.
- `src/lib/` — Database client configuration (Supabase), shared utility
  functions, and third-party service wrappers.
- `src/types/` — Project-wide shared TypeScript types and interfaces.

### III. Code & Component Rules

- **File size limit**: No single component file may exceed 180 lines.
  If a component grows beyond this limit, it MUST be decomposed into
  smaller sub-components.
- **Separation of concerns**: Data fetching and business logic MUST
  reside in `services/` or `hooks/`. UI components MUST be
  presentational only — they receive data via props or hooks and
  render it.
- **Naming conventions**:
  - Files and directories: `kebab-case`
    (e.g., `menu-item-card.tsx`, `use-menu-items.ts`).
  - React components and TypeScript types/interfaces: `PascalCase`
    (e.g., `MenuItemCard`, `MenuItem`).
  - Functions and variables: `camelCase`
    (e.g., `getMenuItems`, `itemCount`).
- **Type safety**: Using `any` or `@ts-ignore` is strictly prohibited
  with zero exceptions. All runtime inputs (API payloads, form data,
  URL parameters) MUST be validated with Zod schemas.
- **Code hygiene**: Dead code, unused imports, and commented-out code
  MUST be removed before merge. Linting and formatting (ESLint +
  Prettier or equivalent) MUST pass in CI.

### IV. Mobile-First & RTL

- **Mobile-first design**: All layouts MUST be designed for mobile
  viewports first (320 px baseline) and progressively enhanced for
  larger screens. Every interactive element (button, link, input) MUST
  have a minimum touch target of 44 × 44 px. Navigation and menu
  browsing MUST be achievable with one-handed use.
- **Bidirectional language support**: The application MUST fully support
  Arabic (RTL) and English (LTR) from the first feature.
- **Logical properties only**: Using physical directional CSS properties
  (`left`, `right`, `ml-`, `mr-`, `pl-`, `pr-`) for margins, padding,
  and text alignment is prohibited. All directional styling MUST use
  CSS logical properties via Tailwind utilities: `ms-`, `me-`, `ps-`,
  `pe-`, `text-start`, `text-end`, `start-`, `end-`.

### V. Performance & Simplicity

- **Page weight**: Initial page payload MUST remain below 500 KB
  (compressed). Menu-item images below the fold MUST use lazy loading
  (`loading="lazy"` or Intersection Observer).
- **Image optimization**: All images MUST use modern formats
  (WebP/AVIF) with responsive `srcset` and appropriate sizing.
- **YAGNI**: Do not build any feature, database table, API endpoint,
  or abstraction that is not explicitly required by the current
  `spec.md`. Speculative code is prohibited.
- **Dependency minimalism**: Every new npm dependency MUST solve a
  problem that cannot be addressed with a reasonable amount of
  application code. Each addition MUST be justified.
- **Graceful degradation**: The application SHOULD degrade gracefully
  when JavaScript is slow to load or network requests fail.

## Development Workflow

- **Branching**: One branch per feature or fix; direct pushes to the
  main branch are prohibited.
- **Testing**: Every user-facing feature MUST include at least one
  integration or end-to-end test covering its happy path. Unit tests
  are required for non-trivial utility functions and data
  transformations.
- **Code Review**: All changes MUST be reviewed before merge.
- **Commit Messages**: Follow Conventional Commits format
  (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- **CI Gate**: Lint, type-check, and test suites MUST pass before a
  branch can be merged.

## Governance

This constitution is the highest-authority document for the Digital Menu
project. All design decisions, code reviews, and architectural choices
MUST be evaluated against these principles.

- **Amendments**: Any change to this constitution MUST be documented
  with a version bump, a Sync Impact Report, and a clear rationale.
  Principle removals or redefinitions require a MAJOR version bump.
- **Versioning**: This document follows semantic versioning
  (MAJOR.MINOR.PATCH).
- **Compliance**: Every pull request and code review MUST verify that
  the change does not violate a constitutional principle. If a
  principle must be relaxed for a specific case, the exception MUST be
  documented inline with a rationale.
- **Guidance**: For day-to-day development guidance that does not rise
  to constitutional level, use supplementary documentation rather than
  amending this file.

**Version**: 2.1.0 | **Ratified**: 2026-11-08 | **Last Amended**: 2026-11-08
