import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import { PostSchema } from "@/lib/validations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(req) {
  console.log("[GET /api/posts] Initiating request...");
  try {
    const { searchParams } = new URL(req.url);
    const page    = parseInt(searchParams.get("page")  || "1");
    const limit   = parseInt(searchParams.get("limit") || "10");
    const search  = searchParams.get("search") || "";
    const admin   = searchParams.get("admin") === "true";
    const skip    = (page - 1) * limit;

    await connectToDatabase();
    console.log("[GET /api/posts] Connected to DB");

    // Admins see all posts (including drafts); public sees only published
    const filter = admin ? {} : { isPublished: true };
    if (search) filter.title = { $regex: search, $options: "i" };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .select("-content")
        .lean(),
      Post.countDocuments(filter),
    ]);

    console.log(`[GET /api/posts] Successfully fetched ${posts.length} posts`);
    return NextResponse.json({ posts, totalPages: Math.ceil(total / limit), currentPage: page, total });
  } catch (error) {
    console.error("[GET /api/posts] CRITICAL ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch posts", details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Zod Validation securely parses incoming JSON
    const validatedData = PostSchema.parse(body);

    // Deep XSS protection: Sanitizing rich text content before hitting database
    // Dynamically require to avoid crashing GET load on some serverless environments
    const DOMPurify = (await import('isomorphic-dompurify')).default;
    validatedData.content = DOMPurify.sanitize(validatedData.content);

    await connectToDatabase();
    const post = await Post.create(validatedData);
    
    // Invalidate caches to show new post immediately
    revalidatePath("/");
    revalidatePath("/blog");
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return NextResponse.json({ error: messages.join(' | ') }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json({ error: "A post with this slug already exists." }, { status: 400 });
    }
    console.error('[POST /api/posts] Error:', error);
    return NextResponse.json({ error: "Failed to create post", details: error.message }, { status: 500 });
  }
}
