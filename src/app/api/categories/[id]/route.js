import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import { CategorySchema } from "@/lib/validations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const cat = await Category.findById(id);
    if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(cat);
  } catch {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const validated = CategorySchema.parse(body);

    await connectToDatabase();
    const cat = await Category.findByIdAndUpdate(id, validated, { new: true });
    if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Invalidate caches
    revalidatePath("/blog");
    revalidatePath(`/category/${cat.slug}`);

    return NextResponse.json(cat);
  } catch (error) {
    if (error.name === "ZodError")
      return NextResponse.json({ error: error.errors }, { status: 400 });
    if (error.code === 11000)
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    const cat = await Category.findByIdAndDelete(id);
    if (cat) {
      // Invalidate caches
      revalidatePath("/blog");
      revalidatePath(`/category/${cat.slug}`);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
