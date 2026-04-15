import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";

export default async function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  await connectToDatabase();

  // Fetch all published posts
  const posts = await Post.find({ isPublished: true }).select("slug updatedAt");
  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Fetch all categories
  const categories = await Category.find().select("slug");
  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Static routes
  const staticEntries = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "always", priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/comparison`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  return [...staticEntries, ...postEntries, ...categoryEntries];
}
