import { FileText, ShoppingBag, FolderTree, TrendingUp, PlusCircle } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard | EliteReviews" };

export default async function AdminDashboard() {
  let stats = { posts: 0, products: 0, categories: 0, published: 0 };
  let recentPosts = [];
  let recentProducts = [];

  try {
    await connectToDatabase();
    const [posts, products, categories, published] = await Promise.all([
      Post.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
      Post.countDocuments({ isPublished: true }),
    ]);
    recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5).populate("category", "name");
    recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    stats = { posts, products, categories, published };
  } catch (e) {}

  const statCards = [
    { label: "Total Posts", value: stats.posts, icon: FileText, color: "blue" },
    { label: "Published Posts", value: stats.published, icon: TrendingUp, color: "green" },
    { label: "Total Products", value: stats.products, icon: ShoppingBag, color: "purple" },
    { label: "Categories", value: stats.categories, icon: FolderTree, color: "yellow" },
  ];

  const colorMap = {
    blue:   { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20" },
    green:  { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/20" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/posts" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
            <PlusCircle className="w-4 h-4" /> New Post
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
            <PlusCircle className="w-4 h-4" /> New Product
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div key={label} className={`bg-gray-800 border ${c.border} p-6 rounded-2xl flex items-center justify-between`}>
              <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-4xl font-extrabold mt-1">{value}</p>
              </div>
              <div className={`${c.bg} ${c.text} p-3 rounded-xl`}>
                <Icon className="w-7 h-7" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-700">
            <h2 className="font-bold text-lg">Recent Posts</h2>
            <Link href="/admin/posts" className="text-blue-400 text-sm hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-700">
            {recentPosts.length === 0 ? (
              <p className="p-5 text-gray-400 text-sm">No posts yet. <Link href="/admin/posts" className="text-blue-400 underline">Create one!</Link></p>
            ) : recentPosts.map(post => (
              <div key={post._id.toString()} className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium truncate pr-4">{post.title}</p>
                  <p className="text-xs text-gray-400">{post.category?.name} &bull; {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`shrink-0 text-xs px-2 py-1 rounded font-bold ${post.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {post.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-700">
            <h2 className="font-bold text-lg">Recent Products</h2>
            <Link href="/admin/products" className="text-green-400 text-sm hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-700">
            {recentProducts.length === 0 ? (
              <p className="p-5 text-gray-400 text-sm">No products yet. <Link href="/admin/products" className="text-green-400 underline">Add one!</Link></p>
            ) : recentProducts.map(prod => (
              <div key={prod._id.toString()} className="p-4 flex items-center justify-between">
                <p className="font-medium truncate pr-4">{prod.title}</p>
                <span className="shrink-0 text-xs text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded">{prod.rating}/5 ★</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
