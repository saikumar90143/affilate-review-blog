import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Click from "@/models/Click";

export async function POST(req) {
  try {
    const { productId, postSlug, platform } = await req.json();
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const userAgent = req.headers.get("user-agent");
    const referrer = req.headers.get("referer");

    await Click.create({
      productId,
      postSlug,
      platform,
      userAgent,
      referrer
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
