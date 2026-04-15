import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Post from "@/models/Post";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AffiliateButton from "@/components/AffiliateButton";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | EliteReviews`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  await connectToDatabase();
  
  const category = await Category.findOne({ slug });
  if (!category) return notFound();

  const [posts, products] = await Promise.all([
    Post.find({ category: category._id, isPublished: true }).sort({ createdAt: -1 }),
    Product.find({ category: category._id }).sort({ rating: -1 })
  ]);

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

        {/* Top Products in this Category */}
        {products.length > 0 && (
          <div className="mb-20">
             <h2 className="text-2xl font-bold mb-8">Top {category.name} Picks</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {products.map(prod => (
                 <div key={prod._id.toString()} className="bg-dark-card rounded-2xl overflow-hidden border border-border">
                    <div className="relative h-48 bg-white p-4">
                      <Image src={prod.image} alt={prod.title} fill className="object-contain" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{prod.title}</h3>
                        <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded font-bold">{prod.rating}/5</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {prod.links && prod.links.length > 0 ? (
                          prod.links.map((link, lidx) => (
                            <AffiliateButton 
                              key={lidx} 
                              url={link.url} 
                              platform={link.platform} 
                              className="text-xs py-2 px-3"
                            />
                          ))
                        ) : (
                          <AffiliateButton url={prod.affiliateLink} text="View Details" className="w-full text-xs py-2" />
                        )}
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Latest Articles in this Category */}
        {posts.length > 0 && (
           <div>
             <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {posts.map(post => (
                 <div key={post._id.toString()} className="bg-dark-card border border-border rounded-2xl overflow-hidden group">
                   <div className="relative h-48 w-full bg-gray-800">
                     {post.featuredImage && (
                       <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                     )}
                   </div>
                   <div className="p-6">
                     <h3 className="font-bold text-lg mb-2 group-hover:text-primary-400"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                     <p className="text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {posts.length === 0 && products.length === 0 && (
          <div className="text-center text-gray-500 py-12">
             No content found in this category right now. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
