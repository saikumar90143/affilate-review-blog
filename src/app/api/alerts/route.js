import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PriceAlert from "@/models/PriceAlert";

export async function POST(req) {
  try {
    const { email, productId } = await req.json();

    if (!email || !productId || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await connectToDatabase();
    
    await PriceAlert.findOneAndUpdate(
      { email, productId },
      { $setOnInsert: { email, productId, isNotified: false } },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
