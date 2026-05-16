import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Post from "@/models/Post";
import Product from "@/models/Product";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AffiliateButton from "@/components/AffiliateButton";
import { ArrowLeft } from "lucide-react";
import NativeAdCard from "@/components/NativeAdCard";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectToDatabase();
  const category = await Category.findOne({ slug }).select('name description').lean();
  
  const title = category ? `${category.name} | EliteReviews` : `${slug.charAt(0).toUpperCase() + slug.slice(1)} | EliteReviews`;
  const description = category?.description || `Browse the best products and expert articles in the ${category?.name || slug} category on EliteReviews.`;
  
  return {
    title,
    description,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  await connectToDatabase();

  const rawCategory = await Category.findOne({ slug }).lean();
  if (!rawCategory) return notFound();
  const category = JSON.parse(JSON.stringify(rawCategory));

  const [rawPosts, rawProducts] = await Promise.all([
    Post.find({ category: category._id, isPublished: true }).sort({ createdAt: -1 }).lean(),
    Product.find({ category: category._id }).sort({ isSponsored: -1, rating: -1 }).lean()
  ]);

  const posts = JSON.parse(JSON.stringify(rawPosts));
  const products = JSON.parse(JSON.stringify(rawProducts));

  return (
    <div className="py-16 bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link href="/" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-black mb-10 transition-transform hover:-translate-x-1 text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4 premium-gradient">{category.name}</h1>
          <p className="text-gray-400">{category.description || `Browse the best products and articles in ${category.name}.`}</p>
        </div>

        {/* Top Picks Listicle */}
        {products.length > 0 && (
          <div className="mb-20 max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl font-black mb-10 border-b border-white/10 pb-4">The Top {products.length} {category.name} of {new Date().getFullYear()}</h2>
            {products.map((prod, index) => (
              <React.Fragment key={prod._id.toString()}>
                <div className="scroll-mt-24" id={`rank-${index + 1}`}>
                  <div className="flex items-center gap-4 mb-4">
                    {prod.isSponsored ? (
                      <div className="px-4 h-12 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(234,179,8,0.2)] shrink-0 tracking-widest uppercase">
                        ✨ Featured Partner
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center font-black text-2xl shadow-glow shrink-0">
                        #{index + 1}
                      </div>
                    )}
                    <h3 className="text-2xl sm:text-3xl font-black">{prod.title}</h3>
                  </div>

                  <div className="bg-dark-card rounded-3xl overflow-hidden border border-border flex flex-col md:flex-row group">
                    <div className="relative w-full md:w-1/3 bg-white p-8 min-h-[250px] shrink-0 border-b md:border-b-0 md:border-r border-border">
                      <Image
                        src={prod.image}
                        alt={prod.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8 flex flex-col justify-between w-full">
                      <div>
                        {prod.badge && (
                          <div className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-400 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-yellow-500/20">
                            {prod.badge.replace("_", " ")}
                          </div>
                        )}
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                          {prod.description || `The ${prod.title} earned the #${index + 1} spot on our list due to its exceptional performance and value in the ${category.name} space.`}
                        </p>

                        {/* Highlights Snippet */}
                        {prod.scores && (
                          <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="p-2 bg-white/5 rounded-lg text-center border border-white/5">
                              <span className="block text-primary-400 font-black">{prod.scores.performance || 90}%</span>
                              <span className="text-[9px] uppercase tracking-wider text-gray-500">Performance</span>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg text-center border border-white/5">
                              <span className="block text-green-400 font-black">{prod.scores.value || 90}%</span>
                              <span className="text-[9px] uppercase tracking-wider text-gray-500">Value</span>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg text-center border border-white/5">
                              <span className="block text-purple-400 font-black">{prod.scores.build || 90}%</span>
                              <span className="text-[9px] uppercase tracking-wider text-gray-500">Build</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/reviews/${prod.slug}`} className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-center text-xs uppercase tracking-wider transition-colors border border-white/10">
                          Read Review
                        </Link>
                        <a href={prod.affiliateLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-center text-xs uppercase tracking-wider shadow-glow transition-colors">
                          Check Price
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Inject Native Ad after 2nd product */}
                  {index === 1 && (
                    <div className="py-8">
                      <NativeAdCard />
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Existing Latest Insights */}
        {
          posts.length > 0 && (
            <div className="max-w-4xl mx-auto border-t border-white/10 pt-16">
              <h2 className="text-2xl font-bold mb-8">Latest {category.name} Insights</h2>
              <div className="space-y-6">
                {posts.map(post => (
                  <Link href={`/blog/${post.slug}`} key={post._id.toString()} className="block bg-dark-card rounded-xl p-6 border border-border hover:border-primary-500/30 transition-colors group">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary-400 transition-colors">{post.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )
        }

        {
          posts.length === 0 && products.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No content found in this category right now. Check back later!
            </div>
          )
        }
      </div>
    </div>
  );
}
