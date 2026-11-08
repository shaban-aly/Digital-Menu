import { useState } from "react";
import { OrderValidationErrors } from "../components/order-type-selector";
import { buildWhatsAppOrderUrl } from "../services/whatsapp-service";
import { useCart } from "./use-cart";
import { Locale } from "@/types";
import { StoreOperatingStatus } from "@/features/schedule/types";

interface UseCartCheckoutParams {
  restaurantName: string;
  restaurantPhone: string;
  locale: Locale;
  operatingStatus: StoreOperatingStatus;
  onSuccess: () => void;
}

export const useCartCheckout = ({
  restaurantName,
  restaurantPhone,
  locale,
  operatingStatus,
  onSuccess,
}: UseCartCheckoutParams) => {
  const {
    items,
    orderType,
    customerName,
    customerPhone,
    deliveryAddress,
    generalNote,
    itemsTotal,
    deliveryFee,
    totalPrice,
    clearCart,
  } = useCart();

  const [errors, setErrors] = useState<OrderValidationErrors>({});

  const submitOrder = () => {
    const errs: OrderValidationErrors = {};
    if (orderType === "takeaway" || orderType === "delivery") {
      if (!customerName.trim()) errs.name = true;
      if (!customerPhone.trim()) errs.phone = true;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) errs.address = true;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return false;
    }
    setErrors({});

    const preOrderOpeningText =
      locale === "ar"
        ? operatingStatus.nextOpeningDateTextAr
        : operatingStatus.nextOpeningDateTextEn;

    const url = buildWhatsAppOrderUrl({
      restaurantName,
      restaurantPhone,
      orderType,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: orderType === "delivery" ? deliveryAddress.trim() : "",
      generalNote: generalNote.trim(),
      items,
      itemsTotal,
      deliveryFee: orderType === "delivery" ? deliveryFee : 0,
      totalPrice,
      locale,
      isPreOrder: operatingStatus.isPreOrder,
      preOrderOpeningText,
    });

    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    onSuccess();
    return true;
  };

  return {
    errors,
    setErrors,
    submitOrder,
  };
};
