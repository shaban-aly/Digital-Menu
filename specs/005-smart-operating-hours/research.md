# Research: Smart Operating Hours & Availability Engine

**Feature**: `005-smart-operating-hours`  
**Date**: 2026-11-08  

---

## 1. Operating Hours Algorithm & Overnight Shifts

### Challenge
Many hospitality businesses (especially grills, cafes, and late-night markets) open late in the afternoon (e.g. 17:00) and close past midnight (e.g. 02:00 AM or 03:30 AM). Standard naive comparison (`currentTime >= open && currentTime <= close`) breaks when `close < open`.

### Solution: Dual-Window Schedule Evaluation
For any given day $D$:
1. **Regular Shift (`open <= close`)**:
   - The store is open if $D$ is active and $\text{open} \le \text{now} < \text{close}$.
2. **Overnight Shift (`close < open`)**:
   - The shift begins on day $D$ and ends on day $D+1 \pmod 7$.
   - At current time `now` on calendar day $D$:
     - Store is open if day $D$ is active and $\text{now} \ge \text{open}$.
     - Store is also open if yesterday ($D-1 \pmod 7$) was an active overnight shift and $\text{now} < \text{close}_{\text{yesterday}}$.
3. **Manual Override (Emergency Pause)**:
   - If `is_manually_paused === true`, the evaluated status immediately resolves to `paused` with `canPlaceOrder = false`, overriding any schedule.

---

## 2. Next Opening Time Calculation

When the store is closed, customers need to know *when* it opens again:
- Iterate through the upcoming 7 days starting from current day.
- For today: check if there is an upcoming shift later today (`now < open`).
- For subsequent days: find the earliest active day and its `open_time`.
- Compute human-readable relative string:
  - Arabic: "اليوم الساعة 1:00 م", "غداً الساعة 11:00 ص", "يوم الأحد الساعة 10:00 ص".
  - English: "Today at 1:00 PM", "Tomorrow at 11:00 AM", "Sunday at 10:00 AM".

---

## 3. Pre-Order Flow Integration with WhatsApp Service

### Decision
When the store is closed but `allow_preorders === true`:
- The cart order button changes label to "إرسال طلب مسبق عبر واتساب / Send Pre-Order via WhatsApp".
- The WhatsApp generated message header includes:
  `🔔 [طلب مسبق لموعد الفتح: {الوقت}]`
- When `allow_preorders === false`:
  - The cart order button is disabled with an explanatory banner.

---

## 4. Component Decomposition (< 180 Lines per File)

To maintain strict compliance with Constitution v2.2.0:
1. `src/features/schedule/types.ts` (~50 lines): Schedule interfaces & Zod schemas.
2. `src/features/schedule/services/schedule-service.ts` (~120 lines): Pure evaluation math (`evaluateStoreStatus`, `computeNextOpening`).
3. `src/features/schedule/hooks/use-store-schedule.ts` (~60 lines): Reactive hook refreshing status every minute or on visibility change.
4. `src/features/schedule/components/store-status-badge.tsx` (~80 lines): Visual pill (Open/Closed/Paused) clickable to open schedule modal.
5. `src/features/schedule/components/schedule-modal.tsx` (~110 lines): 7-day schedule overview dialog using `Modal` primitive.
6. `src/features/schedule/components/closed-guard-banner.tsx` (~80 lines): Cart warning banner & pre-order disclaimer.
7. `src/features/admin/components/operating-hours-editor.tsx` (~150 lines): Admin 7-day timetable config with open/close time pickers & pause switch.
