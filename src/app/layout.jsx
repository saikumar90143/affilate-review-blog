import { Outfit } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const FloatingComparisonBar = dynamic(() => import("@/components/FloatingComparisonBar"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: false });
const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"), { ssr: false });
import MarqueeBanner from "@/components/MarqueeBanner";
import { ComparisonProvider } from "@/context/ComparisonContext";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-outfit'
});

export const metadata = {
  title: "Premium Reviews & Insights",
  description: "Discover top-tier affiliate reviews, informative blogs, and detailed product comparisons.",
  verification: {
    google: "hIzhTFyXemeU3LtPSqOK97z9U3xrkhQZ20uiPbazQ0U",
  },
};

export default function RootLayout({ children }) {
  // Check if we have AdSense configured
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col`}>
        {adClient && process.env.NODE_ENV === 'production' && (
          <Script
            id="adsbygoogle"
            strategy="lazyOnload"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
          />
        )}
        <ComparisonProvider>
          <MarqueeBanner messages={[
            "⚡ Flash Deal: Sony WH-1000XM6 price drop detected", 
            "🔥 Trending: Samsung Galaxy S24 Ultra ultimate breakdown", 
            "⭐ Elite Pick: Apple Watch Ultra 2 review updated"
          ]} />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingComparisonBar />
          <BackToTop />
          <ExitIntentPopup />
        </ComparisonProvider>
      </body>
    </html>
  );
}
