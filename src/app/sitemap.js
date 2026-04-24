import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Product from "../models/Product";

export default async function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  await connectToDatabase();

  // Fetch all published posts
  const posts = await Post.find({ isPublished: { $ne: false } }).select("slug updatedAt");
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

  // Fetch all products
  const products = await Product.find().select("slug category updatedAt").lean();
  const productEntries = products.map((prod) => ({
    url: `${baseUrl}/reviews/${prod.slug}`,
    lastModified: prod.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Generate Programmatic "Versus" Permutations (Top 20 combos to save sitemap bloat)
  const versusEntries = [];

  // Group products by category to only compare peers
  const groupedProducts = products.reduce((acc, current) => {
    const catId = current.category?.toString();
    if (catId) {
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(current);
    }
    return acc;
  }, {});

  for (const catId of Object.keys(groupedProducts)) {
    const peers = groupedProducts[catId];
    // Generate unique pairs
    for (let i = 0; i < peers.length; i++) {
      for (let j = i + 1; j < peers.length; j++) {
        // We only need A vs B, not B vs A (Canonical)
        versusEntries.push({
          url: `${baseUrl}/compare/${peers[i].slug}-vs-${peers[j].slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  // Static routes
  const staticEntries = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "always", priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/comparison`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  return [...staticEntries, ...postEntries, ...categoryEntries, ...productEntries, ...versusEntries];
}
