import AffiliateButton from "@/components/AffiliateButton";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { Check, X } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Compare Top Products | EliteReviews",
  description: "Detailed comparison tables for the best affiliate products.",
};

export const revalidate = 60;

export default async function ComparisonPage({ searchParams }) {
  await connectToDatabase();

  const { ids } = await searchParams;
  let products = [];
  
  if (ids) {
    const idList = ids.split(',').filter(id => id.length === 24); // MongoDB ID length
    const rawProducts = await Product.find({ _id: { $in: idList } }).lean();
    products = JSON.parse(JSON.stringify(rawProducts));

    // Handle single-product "comparison" by automatically adding category rivals
    if (products.length === 1) {
      const mainProduct = products[0];
      const rawRivals = await Product.find({ 
        category: mainProduct.category,
        _id: { $ne: mainProduct._id } 
      })
      .sort({ rating: -1 })
      .limit(2)
      .lean();
      
      const rivals = JSON.parse(JSON.stringify(rawRivals));
      products = [...products, ...rivals];
    }
  } else {
    // Default fallback: Top rated products across all categories
    const rawProducts = await Product.find({ rating: { $gte: 4 } }).sort({ rating: -1 }).limit(4).lean();
    products = JSON.parse(JSON.stringify(rawProducts));
  }

  return (
    <div className="py-16 bg-dark-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-4 text-center">Compare The Best Products</h1>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">We've tested the top tier affiliate choices. Here is how they stack up against each other side by side.</p>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-12 border border-border rounded-2xl glass">
            No highly-rated products found to compare yet. Add some to the database via Admin!
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar mask-edge-right rounded-2xl border border-border shadow-2xl relative">
            <table className="w-full text-left border-separate border-spacing-0 overflow-hidden glass min-w-[700px] table-fixed">
              <thead>
                <tr className="bg-dark-card border-b border-border">
                  <th className="p-4 md:p-6 font-bold text-gray-400 w-32 md:w-48 sticky left-0 z-20 bg-[#0d0d12] border-r border-border/50">Intelligence Logic</th>
                  {products.map((p, i) => (
                    <th key={p._id.toString()} className="p-4 md:p-6 font-bold text-center align-top">
                      <div className="relative w-16 h-16 md:w-28 md:h-28 mb-4 bg-white rounded-xl md:rounded-2xl flex items-center justify-center p-2 mx-auto shadow-glow group-hover:scale-105 transition-transform">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="150px"
                          className="object-contain"
                        />
                      </div>
                      <div className="text-xs md:text-sm mb-2 truncate px-1" title={p.title}>{p.title}</div>
                      {i === 0 && <span className="text-[10px] bg-primary-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest block w-fit mx-auto font-black">Elite Pick</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 md:p-6 font-bold text-gray-500 sticky left-0 z-20 bg-[#0d0d12] border-r border-border/50 text-[10px] md:text-xs uppercase tracking-widest">Global Rating</td>
                  {products.map((p) => <td key={p._id.toString()} className="p-4 md:p-6 text-center font-black text-yellow-500 text-sm md:text-lg">{p.rating} / 5</td>)}
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 md:p-6 font-bold text-gray-500 sticky left-0 z-20 bg-[#0d0d12] border-r border-border/50 text-[10px] md:text-xs uppercase tracking-widest">Elite Strength</td>
                  {products.map((p) => <td key={p._id.toString()} className="p-4 md:p-6 text-center text-[10px] md:text-sm font-bold text-green-400">{p.pros?.[0] || 'N/A'}</td>)}
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 md:p-6 font-bold text-gray-500 sticky left-0 z-20 bg-[#0d0d12] border-r border-border/50 text-[10px] md:text-xs uppercase tracking-widest">Key Limitation</td>
                  {products.map((p) => <td key={p._id.toString()} className="p-4 md:p-6 text-center text-[10px] md:text-sm font-bold text-red-400">{p.cons?.[0] || 'N/A'}</td>)}
                </tr>
                <tr className="bg-dark-card/50">
                  <td className="p-4 md:p-6 sticky left-0 z-20 bg-[#0d0d12] border-r border-border/50"></td>
                  {products.map((p) => (
                    <td key={p._id.toString()} className="p-4 md:p-6 text-center">
                      <div className="flex flex-col gap-2">
                        {p.links && p.links.length > 0 ? (
                          p.links.map((link, lidx) => (
                            <AffiliateButton
                              key={lidx}
                              url={link.url}
                              platform={link.platform}
                              productId={p._id.toString()}
                              className="w-full py-2 text-xs"
                            />
                          ))
                        ) : (
                          <AffiliateButton
                            url={p.affiliateLink}
                            text="Check Price"
                            productId={p._id.toString()}
                            className="w-full py-2 text-xs"
                          />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
