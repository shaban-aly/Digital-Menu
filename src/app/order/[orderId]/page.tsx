import React from "react";
import { OrderTrackingView } from "@/features/orders/components/order-tracking-view";

interface OrderTrackingPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { orderId } = await params;
  return <OrderTrackingView orderId={orderId} />;
}
