import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Product from "../models/Product";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://elitereviews.in";

  await connectToDatabase();

  // Fetch all published posts
  const posts = await Post.find({ isPublished: { $ne: false } }).select("slug updatedAt");
  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Fetch all products
  const products = await Product.find().select("slug category updatedAt").lean();
  const productEntries = products.map((prod) => ({
    url: `${baseUrl}/reviews/${prod.slug}`,
    lastModified: prod.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Fetch only categories that have posts or products
  const categories = await Category.find().select("_id slug");
  const activeCategoryIds = new Set([
    ...posts.map(p => p.category?.toString()),
    ...products.map(p => p.category?.toString())
  ].filter(Boolean));

  const categoryEntries = categories
    .filter(cat => activeCategoryIds.has(cat._id.toString()))
    .map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  // Generate Programmatic "Versus" Permutations (Top combos)
  const versusEntries = [];
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
    for (let i = 0; i < Math.min(peers.length, 5); i++) {
      for (let j = i + 1; j < Math.min(peers.length, 5); j++) {
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
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...staticEntries, ...postEntries, ...categoryEntries, ...productEntries, ...versusEntries];
}
