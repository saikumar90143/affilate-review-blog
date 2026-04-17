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
  console.log("[POST /api/posts] Incoming request...");
  try {
    const session = await getServerSession(authOptions);
    console.log("[POST /api/posts] Session found:", !!session, session?.user?.email);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("[POST /api/posts] Body received (slug):", body.slug);
    
    // Zod Validation securely parses incoming JSON
    const validatedData = PostSchema.parse(body);
    console.log("[POST /api/posts] Validation passed");

    // Temporarily disabling DOMPurify (which uses heavy JSDOM) to isolate Vercel 500 crash
    // const DOMPurify = (await import('isomorphic-dompurify')).default;
    // validatedData.content = DOMPurify.sanitize(validatedData.content);

    await connectToDatabase();
    console.log("[POST /api/posts] Connected to DB. Saving...");

    // Remove _id and __v if present in validatedData to prevent Mongoose errors or duplicates
    const { _id, __v, createdAt, updatedAt, ...saveData } = validatedData;
    
    let post;
    const { searchParams } = new URL(req.url); // Not used here but keep logic clean
    const isEdit = _id ? true : false;

    if (isEdit) {
       post = await Post.findByIdAndUpdate(_id, saveData, { new: true }).lean();
       console.log("[POST /api/posts] Updated post:", post?._id);
    } else {
       post = await Post.create(saveData);
       console.log("[POST /api/posts] Created post:", post?._id);
    }
    
    // Invalidate caches to show new post immediately
    revalidatePath("/");
    revalidatePath("/blog");
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('[POST /api/posts] CRITICAL ERROR:', error);
    if (error.name === 'ZodError') {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return NextResponse.json({ error: messages.join(' | ') }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json({ error: "A post with this slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ 
      error: "Failed to create/update post", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
