import React from "react";
import { LandingPageView } from "@/features/landing/components/landing-page-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المنيو الرقمي | منصة الطلب المباشر بدون عمولات للمطاعم والكافيهات والسوبرماركت",
  description:
    "استقبل طلبات زبائنك مباشرة على واتساب بدون عمولات مبيعات. نظام منيو رقمي سريع للمطاعم والكافيهات ومحلات البقالة في العالم العربي.",
};

export default function HomePage() {
  return <LandingPageView />;
}
