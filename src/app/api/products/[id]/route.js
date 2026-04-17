import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ProductSchema } from "@/lib/validations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const product = await Product.findById(id).populate("category", "name slug");
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const validated = ProductSchema.parse(body);

    await connectToDatabase();
    const product = await Product.findByIdAndUpdate(id, validated, { new: true });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Invalidate caches
    revalidatePath("/");
    revalidatePath("/comparison");
    revalidatePath(`/reviews/${product.slug}`);

    return NextResponse.json(product);
  } catch (error) {
    if (error.name === "ZodError")
      return NextResponse.json({ error: error.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      // Invalidate caches
      revalidatePath("/");
      revalidatePath("/comparison");
      revalidatePath(`/reviews/${product.slug}`);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
