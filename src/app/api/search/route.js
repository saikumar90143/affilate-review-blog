import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json({ posts: [], products: [] });
    }

    await connectToDatabase();

    const searchRegex = { $regex: query, $options: "i" };

    // Concurrent fetching for performance
    const [posts, products] = await Promise.all([
      Post.find({ 
        $or: [{ title: searchRegex }, { excerpt: searchRegex }],
        isPublished: { $ne: false } 
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("category", "name slug")
      .select("-content")
      .lean(),

      Product.find({ 
        $or: [{ title: searchRegex }, { description: searchRegex }]
      })
      .sort({ rating: -1 })
      .limit(10)
      .populate("category", "name slug")
      .lean(),
    ]);

    return NextResponse.json({ 
      posts: JSON.parse(JSON.stringify(posts)), 
      products: JSON.parse(JSON.stringify(products)) 
    });
  } catch (error) {
    console.error("[API Search] Error:", error);
    return NextResponse.json({ error: "Failed to perform intelligence search" }, { status: 500 });
  }
}
