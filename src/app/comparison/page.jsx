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
    products = await Product.find({ _id: { $in: idList } });
  } else {
    // Default fallback: Top rated products
    products = await Product.find({ rating: { $gte: 4 } }).sort({ rating: -1 }).limit(4);
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
          <div className="overflow-x-auto rounded-2xl border border-border shadow-2xl">
            <table className="w-full text-left border-collapse overflow-hidden glass min-w-[800px]">
              <thead>
                <tr className="bg-dark-card border-b border-border">
                  <th className="p-4 font-bold text-gray-300 w-1/5">Feature</th>
                  {products.map((p, i) => (
                    <th key={p._id.toString()} className="p-4 font-bold text-center w-1/5">
                      <div className="relative w-full h-24 mb-4 bg-white rounded flex items-center justify-center p-2">
                        <Image src={p.image} alt={p.title} fill className="object-contain" />
                      </div>
                      <div className="text-lg mb-2 truncate" title={p.title}>{p.title}</div>
                      {i === 0 && <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full uppercase tracking-wider block w-24 mx-auto">Top Pick</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-semibold text-gray-400">Rating</td>
                  {products.map((p) => <td key={p._id.toString()} className="p-4 text-center font-bold text-yellow-500">{p.rating} / 5</td>)}
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-semibold text-gray-400">Top Pro</td>
                  {products.map((p) => <td key={p._id.toString()} className="p-4 text-center text-sm text-green-400">{p.pros?.[0] || 'N/A'}</td>)}
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-semibold text-gray-400">Main Con</td>
                  {products.map((p) => <td key={p._id.toString()} className="p-4 text-center text-sm text-red-400">{p.cons?.[0] || 'N/A'}</td>)}
                </tr>
                <tr className="bg-dark-card/50">
                  <td className="p-4"></td>
                  {products.map((p) => (
                    <td key={p._id.toString()} className="p-4 text-center">
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
