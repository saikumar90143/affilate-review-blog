import AffiliateButton from "@/components/AffiliateButton";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import Image from "next/image";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectToDatabase();
  const product = await Product.findOne({ slug });
  
  if (!product) return {};

  return {
    title: `Review: ${product.title} | EliteReviews`,
    description: `Comprehensive review and specs for ${product.title}`,
  };
}

export default async function ProductReview({ params }) {
  const { slug } = await params;
  
  await connectToDatabase();
  const product = await Product.findOne({ slug });
  
  if (!product) {
    return notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: "5",
      worstRating: "0",
    }
  };

  return (
    <div className="py-16 bg-dark-bg min-h-screen">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="bg-white p-8 p-12 rounded-2xl border border-border overflow-hidden sticky top-24 shadow-2xl relative h-96 flex items-center justify-center">
             <Image src={product.image} alt={product.title} fill className="object-contain p-8" priority />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-extrabold mb-4">{product.title}</h1>
            <div className="flex items-center mb-6">
              <span className="text-yellow-500 font-bold text-xl mr-2">{product.rating}</span>
              <span className="text-gray-400">out of 5 stars</span>
            </div>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Based on our tests, the <strong>{product.title}</strong> remains a compelling choice. Check the detailed pros and cons breakdown below before making your purchase decision.
            </p>

            <AffiliateButton url={product.affiliateLink} text="Check Latest Price" className="w-full text-lg mb-10 shadow-xl" />

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="p-6 bg-green-900/10 rounded-xl border border-green-900/40">
                <h3 className="font-bold text-green-400 flex items-center mb-4"><Check className="mr-2 w-5 h-5" /> Pros</h3>
                <ul className="space-y-3 gap-2 flex flex-col">
                  {product.pros?.map((pro, i) => (
                     <li key={i} className="flex text-sm text-gray-300 items-start"><span className="mr-2 text-green-500 font-bold mt-0.5">&bull;</span><span>{pro}</span></li>
                  ))}
                  {(!product.pros || product.pros.length === 0) && <li className="text-sm text-gray-500 italic">No pros available.</li>}
                </ul>
              </div>
              <div className="p-6 bg-red-900/10 rounded-xl border border-red-900/40">
                <h3 className="font-bold text-red-400 flex items-center mb-4"><X className="mr-2 w-5 h-5" /> Cons</h3>
                <ul className="space-y-3 gap-2 flex flex-col">
                  {product.cons?.map((con, i) => (
                     <li key={i} className="flex text-sm text-gray-300 items-start"><span className="mr-2 text-red-500 font-bold mt-0.5">&bull;</span><span>{con}</span></li>
                  ))}
                  {(!product.cons || product.cons.length === 0) && <li className="text-sm text-gray-500 italic">No cons available.</li>}
                </ul>
              </div>
            </div>

            {/* Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="bg-dark-card rounded-xl border border-border overflow-hidden">
                <h3 className="font-bold text-xl p-4 border-b border-border bg-slate-800/50">Specifications</h3>
                <div className="divide-y divide-border">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex p-4 hover:bg-white/5 transition-colors">
                      <span className="w-1/3 font-semibold text-gray-400">{key}</span>
                      <span className="w-2/3">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
