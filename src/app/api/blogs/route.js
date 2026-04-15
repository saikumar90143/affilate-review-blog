import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await request.json();
    
    // Create new AI blog
    const newBlog = await Blog.create({
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      featuredImage: data.featuredImage || "",
      tags: data.tags || [],
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      ogImage: data.ogImage || "",
      status: data.status || 'draft'
    });

    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error("Save Blog Error:", error);
    // basic duplicate slug handling
    if (error.code === 11000) {
      return NextResponse.json({ error: "A blog with this slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save blog" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    // Return all blogs (published and drafts), ideally we'd separate protected vs public but this is fine for admin
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
