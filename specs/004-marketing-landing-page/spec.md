# Feature Specification: Marketing Landing Page & Platform Portal

**Feature Branch**: `004-marketing-landing-page`  
**Created**: 2026-11-08  
**Status**: Ready for Planning  
**Input**: User request: "ابداء بصفحة الهبوط" — Transform the root URL `/` into a comprehensive, high-conversion Marketing Landing Page showcasing the unified digital menu platform, live pilot models, commission savings calculator, and merchant onboarding.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - High-Impact Hero & Live Pilot Models Showcase (Priority: P1) 🎯 MVP

As a visiting restaurant, café, or supermarket owner, I want to understand what the Digital Menu platform does within 5 seconds of opening the homepage and test live pilot menus for my specific business type, so that I immediately see its practical value for my operations.

**Why this priority**: First impressions dictate conversion. Merchants need to see that the platform solves their exact business model (grill restaurant, specialty cafe, or grocery supermarket) with zero commission and instant WhatsApp ordering.

**Independent Test**: Navigate to `http://localhost:3000/`. Verify that the page displays a high-converting Hero headline, clear value metrics (0% commission, instant setup, works offline), bilingual RTL/LTR toggle, and 3 one-click interactive pilot demo cards linking to `/menu/oriental-grill`, `/menu/specialty-cafe`, and `/menu/fresh-market`.

**Acceptance Scenarios**:
1. **Given** a visitor lands on `/`, **When** the hero renders, **Then** they see a clear bilingual headline, sub-headline, primary CTA button ("ابدأ تجربتك المجانية / Start Free Trial"), and secondary CTA ("استعرض النماذج الحية / View Live Demos").
2. **Given** the pilot showcase cards, **When** the visitor clicks any business model (Restaurant, Café, Supermarket), **Then** they navigate directly to that live menu view without broken links or loading delays.
3. **Given** a visitor clicks the language toggle in the header, **Then** all landing page sections, badges, and pricing cards flip smoothly between Arabic (RTL) and English (LTR) in-place without URL changes.

---

### User Story 2 - Interactive Live Mobile Phone Simulator (Priority: P1)

As a merchant browsing the landing page on desktop or mobile, I want to interact with an embedded interactive smartphone simulator right on the page, so that I can experience the customer menu and cart in action without having to leave the landing page.

**Why this priority**: "Showing is better than telling." Letting merchants click categories, add an item, and watch the floating cart update live inside a phone mockup builds trust and drives conversion.

**Independent Test**: On the landing page, interact with the Phone Simulator component: switch between "مطعم", "كافيه", and "سوبرماركت", click an item card to see quantity stepper increment, and verify the floating cart bar reacts inside the mockup.

**Acceptance Scenarios**:
1. **Given** the interactive phone simulator, **When** the visitor selects a business tab (e.g. Café), **Then** the simulator screen smoothly switches to display café products (cups, pastries) with real mock data.
2. **Given** the simulator screen, **When** the visitor taps (+) on a sample item, **Then** the item quantity increments and the simulated bottom cart bar displays the updated total in EGP (ج.م).

---

### User Story 3 - Tailored Solutions by Business Type (Priority: P2)

As a business owner, I want to read dedicated solution highlights tailored to my specific industry (Restaurant vs. Café vs. Supermarket), so that I understand how the platform addresses my unique operational pain points.

**Why this priority**: A supermarket owner does not care about dine-in tables, while a café owner cares deeply about cup sizes and fast takeaway. Differentiating solutions demonstrates deep industry understanding.

**Independent Test**: Scroll to the "حلول مخصصة لكل نشاط / Tailored Solutions" section, verify 3 distinct feature cards explaining how the platform serves:
1. **Restaurants**: High-resolution imagery, dine-in & takeaway, detailed WhatsApp orders.
2. **Cafés**: Drink sizes, pastry units, peak-hour queue reduction.
3. **Supermarkets**: Weight/volume units (kg, liter), delivery & takeaway only, offline cart resilience.

**Acceptance Scenarios**:
1. **Given** the solutions section, **When** viewed on mobile or desktop, **Then** each business card highlights industry-specific benefits with clear iconography and logical RTL/LTR alignment.

---

### User Story 4 - Interactive Commission Savings & ROI Calculator (Priority: P2)

As a merchant paying heavy commissions (15% to 25%) to aggregator apps (like Talabat or Elmenus), I want to calculate how much money I save by switching to direct WhatsApp ordering with Digital Menu, so that I can justify the subscription investment.

**Why this priority**: Financial ROI is the single strongest sales argument for restaurant owners. Showing them they can save 10,000+ EGP every month makes adopting the platform a no-brainer.

**Independent Test**: Use the savings slider/inputs: enter 300 orders/month with 250 EGP average order value; verify the calculator dynamically calculates and displays the monthly commission saved (~11,250 to 18,750 EGP).

**Acceptance Scenarios**:
1. **Given** the ROI calculator, **When** the user adjusts the monthly orders slider (50 to 2000 orders) or order value input (50 to 1000 EGP), **Then** the estimated annual and monthly savings update dynamically in real time without lagging.
2. **Given** the calculated savings, **When** the user clicks "وفر أرباحك الآن / Save Your Profit Now", **Then** a pre-filled WhatsApp conversation opens to claim the offer.

---

### User Story 5 - Transparent Pricing & WhatsApp Onboarding CTA (Priority: P3)

As an interested merchant, I want to review transparent pricing plans (Starter, Pro, Enterprise) and an FAQ accordion, and immediately contact sales or start onboarding via WhatsApp, so that I can subscribe without friction.

**Why this priority**: Closes the sales funnel. Clear pricing eliminates guesswork, while direct WhatsApp contact matches regional MENA business preferences.

**Independent Test**: Click "اشترك الآن / Subscribe" on any pricing card; verify a WhatsApp link opens (`https://wa.me/201012345678?text=...`) with a courteous, pre-filled inquiry message tailored to the selected plan.

**Acceptance Scenarios**:
1. **Given** the pricing section, **When** displayed, **Then** 3 distinct tiers are presented with monthly/annual pricing in EGP, feature checklists, and prominent CTA buttons.
2. **Given** the FAQ section, **When** a question is clicked, **Then** the answer expands smoothly while preserving accessibility and touch targets (minimum 44×44px).

---

## Edge Cases

- **Mobile Viewport (320px width)**: Ensure the Phone Simulator degrades gracefully into a compact carousel or static interactive preview on small screens without horizontal scrolling.
- **Offline / Slow Network**: Hero content and interactive elements load instantly using lightweight SVGs and CSS rather than heavy external video/GIF assets.
- **Calculator Extremes**: Sliders and inputs strictly bound to valid ranges (orders: 10 - 5,000; average basket: 20 - 2,000 EGP) to prevent negative or NaN values.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Root route `/` MUST render the full Marketing Landing Page, replacing the temporary test portal while maintaining quick links to all 3 pilot menus.
- **FR-002**: Landing page MUST support in-place Arabic (RTL) and English (LTR) language switching via existing `LanguageContext`.
- **FR-003**: System MUST provide an interactive Mobile Phone Simulator allowing visitors to test sample menu browsing and cart updates on the landing page.
- **FR-004**: System MUST provide a dynamic Commission Savings Calculator with real-time reactive calculations in EGP (`ج.م`).
- **FR-005**: All CTA onboarding buttons MUST generate formatted WhatsApp chat links (`wa.me`) targeting the platform sales number with pre-filled inquiries.
- **FR-006**: System MUST provide an FAQ accordion answering key merchant questions regarding hardware, delivery, and setup.
- **FR-007**: All component files MUST reside in `src/features/landing/components/` and strictly adhere to Constitution v2.2.0: max 180 lines per file, zero native dialogs, and 100% logical directional CSS.

### Key Entities

- **PricingPlan**: `{ id: string; name_ar: string; name_en: string; priceMonthly: number; badge?: string; features_ar: string[]; features_en: string[]; isPopular?: boolean }`.
- **FaqItem**: `{ id: string; question_ar: string; question_en: string; answer_ar: string; answer_en: string }`.
- **CalculatorInputs**: `{ monthlyOrders: number; averageBasket: number; aggregatorCommissionRate: number }`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Initial landing page loads in under 1.2 seconds on 4G mobile connections with total payload under 450 KB.
- **SC-002**: 100% of interactive elements (demo links, sliders, accordion toggles, language switchers) satisfy minimum 44×44px touch targets.
- **SC-003**: 100% of text and layout direction switches seamlessly between RTL and LTR without full page reload.
- **SC-004**: Zero files exceeding the 180-line limit; strict TypeScript and ESLint compliance with zero errors.

---

## Assumptions

- Platform sales WhatsApp number uses placeholder `201012345678` (configurable via environment or props).
- Mock data from existing stores (`oriental-grill`, `specialty-cafe`, `fresh-market`) is directly reused to power the live demos and interactive simulator.
- Landing page does not require a database connection during this testing phase.
