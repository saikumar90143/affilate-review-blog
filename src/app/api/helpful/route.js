import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { productId, vote } = await req.json();

    if (!productId || !["yes", "no"].includes(vote)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectToDatabase();

    const update = vote === "yes"
      ? { $inc: { "helpful.yes": 1 } }
      : { $inc: { "helpful.no": 1 } };

    const product = await Product.findByIdAndUpdate(productId, update, { new: true }).select("helpful");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ helpful: product.helpful });
  } catch (error) {
    console.error("[API Helpful] Error:", error);
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 });
  }
}
