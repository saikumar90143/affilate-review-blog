import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ProductSchema } from "@/lib/validations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const mongoose = await connectToDatabase();
    
    // DEBUG LOG: This will show up in Vercel Logs
    console.log(`[GET /api/products] Connected to DB: "${mongoose.connection.name}"`);

    const filter = category ? { category } : {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (page > 0) {
      const skip = (page - 1) * limit;
      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('category', 'name slug')
          .lean(),
        Product.countDocuments(filter),
      ]);
      console.log(`[GET /api/products] Paginated fetch. Page: ${page}, Limit: ${limit}, Total: ${total}`);
      return NextResponse.json({
        products: JSON.parse(JSON.stringify(products)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .lean();

    console.log(`[GET /api/products] Successfully fetched ${products.length} products`);
    return NextResponse.json(JSON.parse(JSON.stringify(products)));
  } catch (error) {
    console.error("[GET /api/products] CRITICAL ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to fetch products", 
      message: error.message,
      dbName: (await connectToDatabase()).connection?.name || "unconnected"
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = ProductSchema.parse(body);

    await connectToDatabase();
    const product = await Product.create(validatedData);
    
    // Invalidate caches
    revalidatePath("/");
    revalidatePath("/comparison");
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json({ error: "Product slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
