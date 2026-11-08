# Quickstart & Verification Guide: Smart Operating Hours

**Feature**: `005-smart-operating-hours`  
**Date**: 2026-11-08  

---

## 1. Automated Verification
Run all unit tests covering schedule evaluation, overnight shifts, and pre-orders:
```bash
npm test
```

Run TypeScript and ESLint checks:
```bash
npm run type-check
npm run lint
```

## 2. Manual Scenarios

### Scenario A: Customer Store Header Status
1. Navigate to `http://localhost:3000/menu/oriental-grill`.
2. Observe the real-time status badge in the header:
   - 🟢 "مفتوح الآن / Open Now" (if within operating hours).
   - 🔴 "مغلق حالياً / Closed - يفتح في [الوقت]" (if outside operating hours).
3. Tap the badge to open the 7-day schedule dialog and inspect daily hours.

### Scenario B: Cart Closed-Hour Guard & Pre-Ordering
1. In the admin dashboard at `http://localhost:3000/admin/oriental-grill`, set today to closed or enable "إيقاف مؤقت للطلبات (Rush Pause)".
2. Return to the customer menu at `/menu/oriental-grill`.
3. Add an item to the cart and open the cart drawer.
4. If `allow_preorders` is true:
   - Notice the "طلب مسبق لموعد الفتح" indicator.
   - Click "إرسال عبر واتساب" -> message is prefixed with `[طلب مسبق]`.
5. If `allow_preorders` is false:
   - Notice the disabled checkout button with warning banner.

### Scenario C: Admin Schedule Editor
1. In `http://localhost:3000/admin/oriental-grill`, go to the "إعدادات المتجر (Store Settings)" tab.
2. Edit daily open/close hours or toggle days off.
3. Save settings and verify instant reflection in customer view without full page reload.
