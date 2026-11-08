# Feature Specification: Smart Operating Hours & Availability Engine

**Feature**: `005-smart-operating-hours`  
**Status**: Ready for Planning  
**Target Release**: v1.0 Production  
**Dependencies**: `001-customer-menu-view`, `002-cart-whatsapp-ordering`, `003-merchant-admin-dashboard`  

---

## 1. Executive Summary & User Value

In real-world food and grocery operations, restaurants, specialty cafes, and supermarkets operate on strict daily shifts, overnight hours (e.g., 6:00 PM to 3:00 AM), prayer breaks, and scheduled days off. Receiving unfulfillable customer orders during closed hours creates friction, customer dissatisfaction, and merchant overhead on WhatsApp.

The **Smart Operating Hours & Availability Engine** empowers merchants to define recurring weekly operating shifts and configure closed-hour order handling policies (strict block vs. explicit pre-ordering), while giving customers instant, unambiguous visual status badges (🟢 Open Now, 🔴 Closed, 🟡 On Break) across both the menu and checkout flows. Merchants also gain a one-tap manual emergency override to pause incoming orders during sudden kitchen rushes without modifying their recurring schedule.

---

## 2. User Stories

### User Story 1 (P1 - Customer Real-Time Status Visibility) 🎯 MVP
**As a** customer visiting a digital menu at `/menu/[slug]`,  
**I want to** immediately see if the store is currently open, closed, or taking a temporary break, along with its next opening time,  
**So that** I know right away whether I can place an order for immediate fulfillment.

#### Acceptance Scenarios
1. **Given** a store whose current time falls within its active operating shift,  
   **When** a customer opens the menu,  
   **Then** a prominent green badge "🟢 مفتوح الآن / Open Now" is displayed in the store header, and normal checkout is enabled.
2. **Given** a store whose current time falls outside operating hours,  
   **When** a customer opens the menu,  
   **Then** a red status badge "🔴 مغلق حالياً / Closed" is displayed in the header with the next opening time (e.g., "يفتح اليوم الساعة 1:00 م" / "Opens today at 1:00 PM").
3. **Given** a store with multiple shifts or a scheduled break (e.g. Friday prayer break),  
   **When** the current time falls within the break window,  
   **Then** an amber badge "🟡 استراحة مؤقتة / On Break" is displayed with the resume time.

---

### User Story 2 (P1 - Graceful Closed-Hours Checkout & Pre-Order Guard) 🎯 MVP
**As a** customer who adds items to my cart while the store is closed,  
**I want** clear guidance on how my order will be handled according to store policy,  
**So that** I do not expect immediate delivery when the store is not operating.

#### Acceptance Scenarios
1. **Given** a store configured with `allow_preorders: false`,  
   **When** a customer opens the cart drawer during closed hours,  
   **Then** the "إرسال عبر واتساب / Send via WhatsApp" button is disabled and replaced by a clear warning banner: "المتجر مغلق حالياً، لا نستقبل طلبات في هذا الوقت".
2. **Given** a store configured with `allow_preorders: true`,  
   **When** a customer views the cart drawer during closed hours,  
   **Then** an informative banner indicates "طلب مسبق لموعد الفتح / Pre-order for Next Opening", and the WhatsApp message is automatically prefixed with `[طلب مسبق لموعد الفتح: {الوقت}]` so the merchant recognizes it immediately.
3. **Given** a customer already had items in their cart before the store closed,  
   **When** the store closes while the customer is browsing,  
   **Then** the cart items remain intact (not erased), but the checkout action reacts instantly to the new closed status.

---

### User Story 3 (P2 - Merchant Weekly Schedule Configuration)
**As a** merchant in `/admin/[slug]`,  
**I want to** configure my store's weekly schedule (active days, open time, close time, and support for shifts crossing midnight),  
**So that** the system automatically governs store open/closed states without manual intervention each day.

#### Acceptance Scenarios
1. **Given** the merchant is on the "إعدادات المتجر / Store Settings" tab in `/admin/[slug]`,  
   **When** they navigate to the "مواعيد العمل / Operating Hours" section,  
   **Then** they see a 7-day schedule editor where each day can be toggled Active/Off and configured with Open/Close times (HH:MM).
2. **Given** a merchant sets overnight hours (e.g. 17:00 to 03:00 next morning),  
   **When** a customer visits the store at 01:30 AM,  
   **Then** the system correctly evaluates the store as Open.
3. **Given** the merchant saves schedule changes,  
   **When** the data is saved,  
   **Then** the store repository persists the updated schedule and broadcasts an update event so customer menus update immediately.

---

### User Story 4 (P2 - Emergency One-Tap Rush Pause)
**As a** merchant experiencing an unexpected kitchen overload or emergency,  
**I want to** immediately toggle a "تعليق الطلبات مؤقتاً / Temporary Pause" switch from my admin panel,  
**So that** incoming orders halt instantly without needing to change my recurring weekly timetable.

#### Acceptance Scenarios
1. **Given** an open store experiencing sudden congestion,  
   **When** the merchant turns on "إيقاف مؤقت للطلبات / Temporary Rush Pause" with an optional note (e.g. "إيقاف لمدة ساعة لضغط الطلبات"),  
   **Then** the customer menu instantly flips to "🟡 معلق مؤقتاً / Temporarily Paused", displaying the merchant's custom note.
2. **Given** a paused store,  
   **When** the merchant toggles the pause off,  
   **Then** the store returns immediately to its regular scheduled status.

---

### User Story 5 (P3 - Bilingual Presentation & Weekly Schedule Modal)
**As a** customer,  
**I want to** click on the operating hours badge in the header to view the full 7-day schedule modal in Arabic or English,  
**So that** I know the exact schedule of the restaurant, cafe, or supermarket for the entire week.

#### Acceptance Scenarios
1. **Given** a customer on `/menu/[slug]`,  
   **When** they tap the operating status badge,  
   **Then** an accessible dialog modal opens displaying the store's full weekly schedule formatted in the current language.
2. **Given** the customer switches language between Arabic and English,  
   **When** viewing the schedule or status badge,  
   **Then** all day names (الأحد, الإثنين... / Sunday, Monday...), time formats (12-hour AM/PM and ص/م), and badges adapt cleanly with zero layout flicker.

---

## 3. Edge Cases & Constraints

1. **Overnight Shifts (Crossing Midnight)**:
   - Example: Open at 18:00, Close at 02:00. The schedule engine must evaluate that 01:00 belongs to the previous calendar day's shift and is legally open.
2. **Closed Days (Full Day Off)**:
   - If a supermarket or cafe is closed all day Sunday, next opening computation must jump to Monday's opening hour.
3. **Time Zone Alignment**:
   - All schedules are evaluated in store local time (defaulting to Egypt standard time `Africa/Cairo` / local device clock) with robust time-string comparison (`HH:mm`).
4. **Offline Resilience**:
   - If the customer has an intermittent network drop, schedule evaluation runs 100% client-side from the store data model without requiring roundtrip server pings.
5. **No Native Dialogs**:
   - Any confirmation (e.g. resetting schedule to default) must use the project's custom `ConfirmDialog`.

---

## 4. Success Criteria

1. **Accuracy**: 100% of tested time intervals (normal daytime, overnight past midnight, off-days, and manual overrides) correctly evaluate store open/closed status.
2. **Zero Inconvenience**: 0 unfulfillable immediate orders sent to merchants during closed hours when `allow_preorders: false`.
3. **Clarity**: Next opening time displayed to the customer within 1 click or glance during closed hours.
4. **Performance**: Schedule evaluation executes synchronously in `< 5ms` with zero UI lag.
5. **Strict Quality**: 100% compliance with Constitution v2.2.0 (max 180 lines/component, 100% logical directional CSS, 0 `any` / `@ts-ignore`).
