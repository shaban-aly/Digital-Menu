# Quickstart & Validation Guide: Order Lifecycle & Tracking

**Feature**: `005-order-lifecycle-tracking`  
**Date**: 2026-11-08  
**Status**: Ready for Tasks  

---

## Validation Scenarios

### Scenario 1: Placing an Order & Confirmation Screen
1. Open `/menu/oriental-grill`.
2. Add items to cart.
3. Open Cart Drawer, choose "Takeaway", enter customer name "أحمد محمود" and phone `01012345678`.
4. Click "إرسال عبر واتساب / Send via WhatsApp".
5. Verify that WhatsApp opens with formatted text starting with `*طلب جديد #ORD-1001*`.
6. Verify browser automatically redirects to `/order/[orderId]`.
7. Verify the order page displays:
   - رقم الطلب: `#ORD-1001`
   - الحالة: "تم استلام الطلب"
   - التفاصيل: الأصناف، الأسعار، الإجمالي.

---

### Scenario 2: Merchant Managing Orders in Dashboard
1. Open `/admin/oriental-grill`.
2. Click the new tab **"الطلبات (Orders)"**.
3. Verify `#ORD-1001` appears at the top of the list with status `pending`.
4. Click the status button and select **"جاري التجهيز (Preparing)"**.
5. Switch to the customer tab `/order/[orderId]` and verify the stepper advances to "جاري التجهيز بالمطبخ" immediately.

---

### Scenario 3: Order History Modal
1. On `/menu/oriental-grill`, click "طلباتي السابقة / My Orders".
2. Verify `#ORD-1001` is listed with date and total.
3. Clicking on it opens its tracking page `/order/[orderId]`.
