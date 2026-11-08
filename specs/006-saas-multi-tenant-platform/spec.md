# Feature Specification: SaaS Multi-Tenant Platform

**Feature**: `006-saas-multi-tenant-platform`  
**Status**: Ready for Planning & Parallel Execution  
**Target Release**: v1.0 Production SaaS  
**Dependencies**: `001-customer-menu-view`, `002-cart-whatsapp-ordering`, `004-marketing-landing-page`, `005-smart-operating-hours`  

---

## 1. Executive Summary & Architecture Overview

This specification transitions the Digital Menu solution from a localized single-tenant showcase into a complete, commercial, production-ready **SaaS Multi-Tenant Platform**.

### Core Architecture Pillars:
1. **Routing Clarity**:
   - `/dashboard` (`src/app/dashboard/` & `src/features/dashboard/`): Merchant / Business Owner management portal.
   - `/admin` (`src/app/admin/` & `src/features/admin/`): Super Admin / Platform Owner central oversight console.
   - `/menu/[slug]`: Customer-facing digital menu with live ordering, untouched and high-speed.
   - `/login`, `/register`, `/onboarding`: Tenant access and business setup flows.
2. **Subscription Tiers & Quota Engine**:
   - **All operational features** (cart, dine-in, takeaway, home delivery via WhatsApp, QR tent card generation, operating hours) are available in **ALL plans**.
   - Differentiation is strictly by capacity quotas and multi-store support:
     * **Free Plan (`free`)**: 0 EGP. Max 7 categories, max 50 products per store. Single store.
     * **Pro Plan (`pro`)**: 250 EGP/month or 2,500 EGP/year (toggleable). Max 50 categories, max 500 products per store. Dedicated single business per account. Subscriptions initiated via pre-filled WhatsApp deep link to platform owner, architected for future payment gateway drop-in.
     * **Enterprise Plan (`enterprise`)**: Custom pricing. Unlimited categories, products, branches, and custom branding. Inquiries routed to WhatsApp.
3. **Database Foundation**:
   - Full PostgreSQL / Supabase migration schemas (`profiles`, `stores`, `subscriptions`, `categories`, `products`) with Row Level Security (RLS).
   - Dual-mode data repository (`StoreRepository`) with client-side mock/localStorage fallback if Supabase credentials are not present in `.env.local`.

---

## 2. User Stories

### User Story 1 (P1 - Route Refactoring & Separation of Concerns)
**As a** system user (merchant or platform owner),  
**I want** dedicated routes for merchant operations (`/dashboard`) and platform oversight (`/admin`),  
**So that** merchant tasks are cleanly segregated from platform administration.

#### Acceptance Scenarios
1. **Given** a merchant visiting `/dashboard`,  
   **When** they view their store,  
   **Then** they access the merchant portal for their specific business.
2. **Given** an authorized platform administrator visiting `/admin`,  
   **When** they open the route,  
   **Then** they access the Super Admin control panel showing global platform analytics and cross-store management.
3. **Given** a customer visiting `/menu/[slug]`,  
   **When** they view the store,  
   **Then** the customer ordering experience operates with 100% fidelity without route change.
4. **Given** a user visiting `/menu`,  
   **When** navigated without slug,  
   **Then** they are redirected automatically to `/`.

---

### User Story 2 (P1 - Auth & Merchant Onboarding)
**As a** prospective merchant,  
**I want to** register an account, log in, and register my business in a seamless 3-minute onboarding flow,  
**So that** my digital menu is instantly live at `/menu/[slug]` with initial defaults.

#### Acceptance Scenarios
1. **Given** a new visitor at `/register`,  
   **When** they enter their name, email, and password,  
   **Then** their account is created and they are forwarded to `/onboarding`.
2. **Given** an authenticated user on `/onboarding`,  
   **When** they fill the business creation form (Type: restaurant/cafe/supermarket/store, Business Name AR & EN, unique Slug, WhatsApp Phone, Delivery Fee, and Initial Plan selection),  
   **Then** slug uniqueness is validated; selecting `free` activates the menu immediately and redirects to `/dashboard`, while selecting `pro` generates a pre-filled WhatsApp activation message to platform management.
3. **Given** an authenticated user who completed onboarding,  
   **When** they visit `/dashboard`,  
   **Then** they directly manage their single registered business without clutter or account ambiguity.

---

### User Story 3 (P1 - Subscription Plans & Quota Enforcement Engine)
**As a** platform owner and merchant,  
**I want** strict quota enforcement based on subscription tiers,  
**So that** free users are politely restricted at their limits (7 categories / 50 products) with an instant upgrade CTA, and pro users receive their 10x capacity (50 categories / 500 products).

#### Acceptance Scenarios
1. **Given** a store on the Free tier with 7 categories,  
   **When** the merchant attempts to add an 8th category,  
   **Then** the operation is blocked with a clear dialog: "لقد وصلت للحد الأقصى للخطة المجانية (7 أقسام). قم بالترقية لخطة Pro لإضافة حتى 50 قسماً"، providing an "اشترك في Pro عبر واتساب" button.
2. **Given** a store on the Free tier with 50 products,  
   **When** the merchant attempts to add a 51st product,  
   **Then** the creation is blocked with an informative upgrade prompt.
3. **Given** a merchant viewing `/dashboard/subscription` or pricing cards,  
   **When** they toggle between "شهري (Monthly)" and "سنوي (Annual)",  
   **Then** Pro plan pricing reflects 250 EGP/mo vs 2,500 EGP/yr (showing 2 months free badge), and clicking "اشترك الآن" opens WhatsApp with account details pre-populated.

---

### User Story 4 (P2 - Enhanced Merchant Dashboard)
**As a** merchant in `/dashboard`,  
**I want to** see visual quota progress meters and manage my products, categories, hours, and QR cards,  
**So that** I maintain full control over my catalog and know exactly when I approach quota limits.

#### Acceptance Scenarios
1. **Given** a merchant on `/dashboard`,  
   **When** viewing the dashboard overview,  
   **Then** quota usage bars display:
     - `الأقسام: X / 7` (أو 50) مع نسبة مئوية وشريط تقدم ملون.
     - `المنتجات: Y / 50` (أو 500) مع نسبة مئوية.
     - شارة الخطة الحالية (`مجانية / Free` أو `Pro` أو `Enterprise`).
2. **Given** a merchant updating an item,  
   **When** editing prices, availability, or supermarket units,  
   **Then** changes persist and sync to the customer menu at `/menu/[slug]`.

---

### User Story 5 (P2 - Super Admin Platform Oversight Panel)
**As a** platform owner in `/admin`,  
**I want to** monitor platform growth, view all registered stores, change store tiers with 1 click, and toggle store activation,  
**So that** I administer tenant subscriptions and support requests efficiently.

#### Acceptance Scenarios
1. **Given** the platform owner at `/admin`,  
   **When** loading the page,  
   **Then** KPI summary cards show: Total Stores, Active Stores, Plan Distribution (Free vs Pro vs Enterprise), and Total Catalog Products.
2. **Given** the stores management table,  
   **When** searching by store name or filtering by plan,  
   **Then** matching stores appear with instant action buttons:
     - Change tier dropdown (`free`, `pro_monthly`, `pro_yearly`, `enterprise`).
     - Toggle store status (Active / Suspended).
     - Direct link to customer menu and merchant dashboard.
3. **Given** the platform owner updates the platform contact WhatsApp or default pricing in `/admin/settings`,  
   **Then** the new details propagate to all pricing buttons across the platform.

---

### User Story 6 (P2 - Cloud Supabase Database Schema & Hybrid Repository)
**As a** developer or DevOps engineer,  
**I want** complete PostgreSQL migration scripts and a dual-mode data repository,  
**So that** the platform can run local-first without API keys, and connect to cloud Supabase by adding `.env.local` variables.

#### Acceptance Scenarios
1. **Given** the `supabase/migrations/20261108_saas_schema.sql` migration file,  
   **When** run in Supabase SQL editor,  
   **Then** tables `profiles`, `stores`, `subscriptions`, `categories`, and `products` are created with foreign keys, indexes, and RLS policies.
2. **Given** no Supabase environment variables configured,  
   **When** running the application,  
   **Then** `StoreRepository` falls back to `LocalStorageStoreRepository` with 0 console errors and 0 build failures.
3. **Given** valid Supabase keys configured,  
   **When** mutations occur,  
   **Then** queries execute directly against the Supabase REST/PostgREST client.

---

## 3. Strict Quality & Constitutional Boundaries

- **File Size Limit**: Strictly <= 180 lines per component or service file.
- **Zero Native Browser Dialogs**: Strictly forbidden (`window.confirm`, `window.alert`, `window.prompt`).
- **Shared UI Primitives**: Review and reuse `src/components/ui/` (`Modal`, `ConfirmDialog`, `Button`).
- **Logical Directional CSS**: 100% logical properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`).
- **Strict TypeScript**: 0 `any`, 0 `@ts-ignore`.
