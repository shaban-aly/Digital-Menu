"use client";

import React from "react";
import { LandingNavbar } from "./landing-navbar";
import { HeroSection } from "./hero-section";
import { PhoneSimulator } from "./phone-simulator";
import { SolutionsSection } from "./solutions-section";
import { RoiCalculator } from "./roi-calculator";
import { PricingSection } from "./pricing-section";
import { FaqSection } from "./faq-section";
import { LandingFooter } from "./landing-footer";

export const LandingPageView: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-brand-500 selection:text-white">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <PhoneSimulator />
        <SolutionsSection />
        <RoiCalculator />
        <PricingSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
};
