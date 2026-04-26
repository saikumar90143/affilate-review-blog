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
  title: "EliteReviews | Premium Gear Insights & Technical Analysis",
  description:
    "Explore in-depth technical reviews, professional product comparisons, and laboratory-tested gear insights.",
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon.png', sizes: '144x144', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
