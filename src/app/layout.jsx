import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Premium Reviews & Insights",
  description:
    "Discover top-tier affiliate reviews, informative blogs, and detailed product comparisons.",
  verification: {
    google: "hIzhTFyXemeU3LtPSqOK97z9U3xrkhQZ20uiPbazQ0U",
  },
};

export default function RootLayout({ children }) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col`}>
        {adClient && process.env.NODE_ENV === "production" && (
          <Script
            id="adsbygoogle"
            strategy="lazyOnload"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
          />
        )}
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
