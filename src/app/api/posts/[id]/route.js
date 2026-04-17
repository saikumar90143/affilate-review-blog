import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import { PostSchema } from "@/lib/validations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import DOMPurify from "isomorphic-dompurify";
import { revalidatePath } from "next/cache";

// GET single post by id
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const post = await Post.findById(id).populate("category", "name slug");
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// PUT update post
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const validated = PostSchema.parse(body);
    validated.content = DOMPurify.sanitize(validated.content);

    await connectToDatabase();
    const post = await Post.findByIdAndUpdate(id, validated, { new: true }).populate("category");
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Clear caches
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    if (post.category) revalidatePath(`/category/${post.category.slug}`);

    return NextResponse.json(post);
  } catch (error) {
    if (error.name === "ZodError")
      return NextResponse.json({ error: error.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const post = await Post.findByIdAndDelete(id).populate("category");
    if (post) {
      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
      if (post.category) revalidatePath(`/category/${post.category.slug}`);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
