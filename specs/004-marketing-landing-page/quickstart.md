# Quickstart Validation: Marketing Landing Page & Platform Portal

**Feature**: `004-marketing-landing-page`  
**Date**: 2026-11-08  
**Status**: Ready for Implementation  

---

## Prerequisites
1. Local development server running at `http://localhost:3000`.
2. Existing pilot mock stores operational: `oriental-grill`, `specialty-cafe`, `fresh-market`.

---

## 1. Quick Verification Scenarios

### Scenario 1: Homepage Hero & Language Switch
1. Navigate to: `http://localhost:3000/`.
2. **Expectation**:
   - Hero displays compelling title: "المنيو الرقمي الذكي - نظام الطلب المباشر بدون عمولات".
   - Navigation bar displays logo, language switch button, and WhatsApp CTA.
   - 3 pilot model cards appear with quick links to live demo menus.
3. Click "English":
   - Layout flips smoothly to LTR with English headlines without URL change.

### Scenario 2: Interactive Mobile Phone Simulator
1. In the simulator section, click "كافيه ومخبوزات (Café)".
2. **Expectation**:
   - Simulator screen updates with café items (Specialty Coffee, Croissant).
3. Click (+) on an item inside the simulator:
   - Floating cart bar inside the mockup reacts immediately, showing item count and total EGP price.

### Scenario 3: Commission Savings & ROI Calculator
1. Scroll to the "احسب توفيرك (Calculate Savings)" section.
2. Drag Monthly Orders slider to `500` orders and Average Basket to `200` EGP.
3. **Expectation**:
   - Monthly turnover shows `100,000 ج.م`.
   - Monthly commission saved displays `18,000 ج.م / شهر`.
   - Annual savings displays `216,000 ج.م / سنة`.
4. Click "وفر أرباحك الآن عبر واتساب":
   - Opens `https://wa.me/201012345678` with a pre-filled message mentioning the calculated savings.

### Scenario 4: Pricing & FAQ Accordion
1. Scroll to the "باقات الاشتراك (Pricing Plans)" section.
2. Review 3 tiers: Starter, Pro, Enterprise with features and monthly prices.
3. In FAQ, click on "هل أحتاج جهاز كاشير إضافي؟":
   - Accordion expands smoothly revealing the answer.

---

## 2. Automated Validation Commands

```bash
# TypeScript strict check
npm run type-check

# ESLint clean check
npm run lint

# Unit tests
npm test

# Production build check
npm run build
```
