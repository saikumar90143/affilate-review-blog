import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import { Suspense } from "react";
import BlogClientContent from "./BlogClientContent";

export const metadata = {
  title: "Blog | EliteReviews",
  description: "Read our latest articles, guides, and tips.",
};

export const revalidate = 60; // ISR: Revalidate static data every 60 seconds

export default async function BlogPage() {
  await connectToDatabase();
  
  let posts = [];
  let categories = [];

  try {
    const fetchPosts = Post.find({ isPublished: { $ne: false } })
      .select('title slug excerpt featuredImage category createdAt')
      .sort({ createdAt: -1 })
      .populate('category')
      .lean()
      .catch(e => { console.error("[Blog] Posts fetch error:", e); return []; });
      
    const fetchCategories = Category.find({ for: "post" })
      .sort({ name: 1 })
      .lean()
      .catch(e => { console.error("[Blog] Categories fetch error:", e); return []; });

    [posts, categories] = await Promise.all([fetchPosts, fetchCategories]);
    posts = JSON.parse(JSON.stringify(posts));
    categories = JSON.parse(JSON.stringify(categories));
    console.log(`[Blog] Statically loaded ${posts.length} posts and ${categories.length} categories.`);
  } catch (error) {
    console.error("[Blog] Critical error fetching data:", error);
  }

  return (
    <Suspense fallback={
      <div className="py-24 bg-dark-bg min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">Loading Elite Insights…</div>
      </div>
    }>
      <BlogClientContent initialPosts={posts} categories={categories} />
    </Suspense>
  );
}
