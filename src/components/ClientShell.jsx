"use client";

import dynamic from "next/dynamic";
import { ComparisonProvider } from "@/context/ComparisonContext";
import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";

// Defer heavy client-only components — they are NOT needed for first paint
const FloatingComparisonBar = dynamic(
  () => import("@/components/FloatingComparisonBar"),
  { ssr: false }
);
const BackToTop = dynamic(
  () => import("@/components/BackToTop"),
  { ssr: false }
);
const ExitIntentPopup = dynamic(
  () => import("@/components/ExitIntentPopup"),
  { ssr: false }
);
export default function ClientShell({ children }) {
  return (
    <ComparisonProvider>
      <MarqueeBanner
        messages={[
          "⚡ Flash Deal: Sony WH-1000XM6 price drop detected",
          "🔥 Trending: Samsung Galaxy S24 Ultra ultimate breakdown",
          "⭐ Elite Pick: Apple Watch Ultra 2 review updated",
        ]}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingComparisonBar />
      <BackToTop />
      <ExitIntentPopup />
    </ComparisonProvider>
  );
}
