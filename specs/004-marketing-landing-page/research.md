# Research: Marketing Landing Page & Platform Portal

**Feature**: `004-marketing-landing-page`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Interactive Mobile Phone Simulator Architecture

### Problem / Context
Visitors need to experience how the digital menu feels in the hands of their customers without having to leave the landing page. Traditional approaches use embedded `<iframe>` tags pointing to live URLs, which creates heavy network overhead, iframe sandbox issues, and sluggish mobile loading.

### Technical Decision
Build a pure CSS/React Phone Simulator (`PhoneSimulator`) using Tailwind CSS v4 styling:
- **Phone Frame**: An outer container styled like a modern smartphone with rounded corners (`rounded-[40px]`), subtle borders (`border-4 border-slate-800`), speaker notch/island, and soft drop shadow.
- **Embedded Content**: Directly renders interactive preview components using client state, with quick tabs: "مطعم مشويات", "كافيه", "سوبرماركت".
- **Interactivity**: Visitors can tap items to increment quantities, and watch the bottom floating cart bar update with the live subtotal.
- **Zero Iframes**: 100% native React components, zero iframe latency, lightweight bundle impact (<15KB).

---

## 2. Commission Savings & ROI Calculator Engine

### Problem / Context
Restaurant owners frequently complain about paying 15% to 25% cut on every order to aggregator platforms (e.g., Talabat, Elmenus, HungerStation). A dynamic calculator provides immediate financial justification for subscribing to a flat-fee digital menu platform.

### Technical Decision
- Standard MENA aggregator commission rate default: 18% (with a toggle/slider between 12% and 25%).
- Inputs:
  1. `monthlyOrders`: Number of monthly online/delivery orders (default: 400 orders).
  2. `averageBasket`: Average order ticket size in EGP (default: 220 EGP).
- Formula:
  $$\text{Aggregator Lost Fees} = \text{monthlyOrders} \times \text{averageBasket} \times \frac{\text{commissionRate}}{100}$$
  $$\text{Estimated Annual Savings} = \text{Aggregator Lost Fees} \times 12$$
- For instance, with 400 orders at 220 EGP:
  - Monthly turnover: 88,000 EGP.
  - Aggregator takes at 18%: **15,840 EGP every single month**!
  - With Digital Menu: Merchant keeps that money, paying only a tiny flat subscription.

---

## 3. High-Conversion WhatsApp Onboarding Links

### Problem / Context
In Egypt and the Arab world, direct WhatsApp communication converts up to 5x higher than traditional SaaS email sign-up forms.

### Technical Decision
Each CTA (Hero, Pricing Tier, ROI Calculator) creates an instant `wa.me` deep link with encoded Arabic/English context:
- Hero: `"مرحباً، أود تجربة منصة المنيو الرقمي لنشاطي التجاري."`
- Starter Plan: `"مرحباً، أود الاشتراك في باقة البداية (Starter) للمنيو الرقمي."`
- Pro Plan: `"مرحباً، أود الاشتراك في باقة النمو (Pro) للمنيو الرقمي."`
- Calculator: `"مرحباً، قمت بحساب توفير العمولات لنشاطي وأود بدء تشغيل المتجر فوراً."`

---

## 4. Logical Component Decomposition (Constitution v2.2.0)

### Problem / Context
A comprehensive landing page can easily grow to 600+ lines if placed in a single file. The project constitution strictly caps any component file at 180 lines.

### Technical Decision
Decompose into 9 cleanly separated, single-responsibility components under `src/features/landing/components/`:
1. `landing-page-view.tsx`: Root layout connecting sections (<100 lines).
2. `landing-navbar.tsx`: Header navigation, language toggle, and WhatsApp contact button (<90 lines).
3. `hero-section.tsx`: Headline, value props, primary CTAs, and pilot model badges (<120 lines).
4. `phone-simulator.tsx`: Interactive smartphone preview with live reactive cart (<160 lines).
5. `solutions-section.tsx`: Tailored feature cards for Restaurants, Cafes, and Supermarkets (<140 lines).
6. `roi-calculator.tsx`: Interactive sliders and real-time commission savings display (<150 lines).
7. `pricing-section.tsx`: Subscription tier cards with feature lists and direct WhatsApp links (<140 lines).
8. `faq-section.tsx`: Accessible interactive accordion answering common objections (<130 lines).
9. `landing-footer.tsx`: Copyright, brand summary, and quick links (<80 lines).
