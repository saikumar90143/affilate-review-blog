import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Click from "@/models/Click";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");
  const productId = searchParams.get("productId");
  const postSlug = searchParams.get("postSlug");
  const platform = searchParams.get("platform");

  if (!targetUrl) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Optional: Track in background if DB is connected properly without blocking the redirect
  if (productId) {
    try {
      // Not awaiting to speed up redirect. In Vercel serverless this might get killed, but ok for now.
      connectToDatabase().then(() => {
        Click.create({
          productId,
          postSlug: postSlug || "unknown",
          platform: platform || "Auto",
          userAgent: req.headers.get("user-agent"),
          referrer: req.headers.get("referer"),
        }).catch(() => {});
      });
    } catch(e) {}
  }

  const country = req.headers.get("x-vercel-ip-country") || "US";
  let finalUrl = targetUrl;

  try {
    const urlObj = new URL(targetUrl);
    
    // Geo-Routing Amazon domains based on IP Country
    if (urlObj.hostname.includes("amazon.com")) {
      const regionMap = {
        'GB': 'amazon.co.uk',
        'UK': 'amazon.co.uk',
        'CA': 'amazon.ca',
        'AU': 'amazon.com.au',
        'DE': 'amazon.de',
        'FR': 'amazon.fr',
      };
      
      if (regionMap[country]) {
        urlObj.hostname = regionMap[country];
        finalUrl = urlObj.toString();
      }
    }
  } catch (error) {
    console.warn("Invalid URL passed to /api/go:", targetUrl);
  }

  // Redirect as a temporary redirect (307)
  return NextResponse.redirect(finalUrl, 307);
}
