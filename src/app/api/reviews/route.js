import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).limit(10).lean();
    
    // Calculate stats
    const total = await Review.countDocuments({ productId });
    const aggregate = reviews.length > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
      : 0;

    return NextResponse.json({ 
      reviews, 
      stats: { total, average: aggregate.toFixed(1) } 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { productId, username, rating, text } = await req.json();
    
    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await connectToDatabase();
    
    const newReview = await Review.create({
      productId,
      username: username || "Anonymous Buyer",
      rating,
      text
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
  }
}
