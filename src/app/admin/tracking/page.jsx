import connectToDatabase from "@/lib/mongodb";
import Click from "@/models/Click";
import Product from "@/models/Product";
import { BarChart, MousePointer, ExternalLink, ShieldCheck } from "lucide-react";
import Image from "next/image";

export const revalidate = 0; // Disable caching for the admin tracking board

export default async function TrackingDashboard() {
  await connectToDatabase();
  
  // Need to explicitly register Product schema in Mongoose if it wasn't already by another import
  const clicks = await Click.find().populate({ path: 'productId', model: Product }).sort({ createdAt: -1 }).lean();

  const totalClicks = clicks.length;
  
  // Aggregate by Post
  const postsMap = {};
  // Aggregate by Product
  const productsMap = {};
  
  clicks.forEach(click => {
    const pSlug = click.postSlug || "unknown";
    postsMap[pSlug] = (postsMap[pSlug] || 0) + 1;
    
    if (click.productId) {
      const prodId = click.productId._id.toString();
      if (!productsMap[prodId]) {
        productsMap[prodId] = {
          title: click.productId.title,
          image: click.productId.image,
          count: 0
        };
      }
      productsMap[prodId].count++;
    }
  });

  const topPosts = Object.entries(postsMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topProducts = Object.values(productsMap).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
          <BarChart className="w-6 h-6 text-blue-400" />
          Click Tracking Analytics
        </h1>
        <p className="text-gray-400 mt-2">See exactly which posts and products are converting your traffic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MousePointer className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Clicks Tracked</p>
          <div className="text-4xl font-black mt-2 text-white">{totalClicks}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 bg-gray-950/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Top Converting Products</h2>
          </div>
          <div className="divide-y divide-gray-800/50 max-h-[500px] overflow-y-auto">
            {topProducts.map((prod, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white p-1 relative flex-shrink-0">
                  {prod.image && <Image src={prod.image} alt={prod.title} fill className="object-cover rounded" sizes="40px" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">{prod.title}</p>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold whitespace-nowrap">
                  {prod.count} clicks
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="p-8 text-center text-gray-500">No clicks tracked yet.</p>}
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 bg-gray-950/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Top Traffic Drivers (Posts)</h2>
          </div>
          <div className="divide-y divide-gray-800/50 max-h-[500px] overflow-y-auto">
            {topPosts.map(([slug, count], idx) => (
              <div key={slug} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <p className="font-medium text-sm text-gray-300 truncate">/{slug}</p>
                </div>
                <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold whitespace-nowrap">
                  {count} clicks
                </div>
              </div>
            ))}
            {topPosts.length === 0 && <p className="p-8 text-center text-gray-500">No clicks tracked yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
