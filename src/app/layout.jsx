import { Outfit } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingComparisonBar from "@/components/FloatingComparisonBar";
import { ComparisonProvider } from "@/context/ComparisonContext";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-outfit'
});

export const metadata = {
  title: "Premium Reviews & Insights",
  description: "Discover top-tier affiliate reviews, informative blogs, and detailed product comparisons.",
};

export default function RootLayout({ children }) {
  // Check if we have AdSense configured
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col`}>
        {adClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
        <ComparisonProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingComparisonBar />
        </ComparisonProvider>
      </body>
    </html>
  );
}
