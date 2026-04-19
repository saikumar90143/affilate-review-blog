import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import PriceAlert from "@/models/PriceAlert";
import { sendPriceAlertEmail } from "@/lib/email";

// Secure endpoint (if triggered manually, needs secret. Vercel cron injects standard headers we could check)
export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  // Local testing bypass, or verify Vercel Cron header in prod: req.headers.get('x-vercel-cron')
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    
    // Fetch products needing sync (e.g. ones with Amazon links)
    const products = await Product.find({ "links.platform": "Amazon" });

    let updatedCount = 0;

    // Iterate and sync
    for (const product of products) {
      // Simulate API hit to Rainforest API or similar scraper
      // const res = await fetch(`https://api.rainforestapi.com/request?api_key=XYZ&type=product&url=${product.links[0].url}`);
      // const data = await res.json();
      // const newPrice = data.product.buybox_winner.price.value;

      // Mock fluctuation for demo purposes
      const currentPrice = product.price || 199.99;
      // Fluctuate randomly between -5% and +5%
      const fluctuation = currentPrice * (Math.random() * 0.1 - 0.05);
      const newPrice = Math.max(10, currentPrice - 5); // FORCE A DROP FOR DEMO TEST
      
      const priceDropped = newPrice < currentPrice;
      
      product.price = parseFloat(newPrice.toFixed(2));
      await product.save();

      // If price dropped, notify watchers
      if (priceDropped) {
        const alerts = await PriceAlert.find({ productId: product._id, isNotified: false });
        for (const alert of alerts) {
          await sendPriceAlertEmail(alert.email, product.title, product.price);
          alert.isNotified = true;
          await alert.save();
        }
      }

      updatedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Synced ${updatedCount} products automatically.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
