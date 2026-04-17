import AffiliateButton from "@/components/AffiliateButton";
import StandaloneProductCard from "@/components/StandaloneProductCard";
import TrustBanner from "@/components/TrustBanner";
import AuthorBox from "@/components/AuthorBox";
import TableOfContents from "@/components/TableOfContents";
import ShareBar from "@/components/ShareBar";
import AdSlot from "@/components/AdSlot";
import ProgressBar from "@/components/ProgressBar";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Product from "@/models/Product";
import Settings from "@/models/Settings";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import AIBlogPostLayout from "@/components/AIBlogPostLayout";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

function calculateReadingTime(content) {
  if (!content) return "1 min read";
  const textContent = content.replace(/<[^>]*>?/gm, "");
  const words = textContent.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectToDatabase();
  const post = await Post.findOne({ slug }).select('metaTitle metaDescription title excerpt');
  
  if (!post) {
    const blog = await Blog.findOne({ slug, status: 'published' });
    if (blog) {
      return {
        title: blog.metaTitle || `${blog.title} | EliteReviews`,
        description: blog.metaDescription || blog.summary,
      };
    }
    return {};
  }

  return {
    title: post.metaTitle || `${post.title} | EliteReviews`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  await connectToDatabase();
  
  let [post, settings] = await Promise.all([
    Post.findOne({ slug, isPublished: true }).populate('category').lean(),
    Settings.findOne().lean()
  ]);
  
  if (!post) {
    const blog = await Blog.findOne({ slug, status: "published" }).lean();
    if (!blog) return notFound();
    
    const relatedBlogs = await Blog.find({ _id: { $ne: blog._id }, status: "published" })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
      
    // Render the new AI layout
    return <AIBlogPostLayout blog={blog} relatedPosts={relatedBlogs} />;
  }

  // Sanitize for Client Components
  post = JSON.parse(JSON.stringify(post));
  settings = JSON.parse(JSON.stringify(settings));

  // Fetch related posts from the same category
  const relatedContent = await Post.find({ 
    category: post.category?._id, 
    _id: { $ne: post._id },
    isPublished: true 
  }).limit(3);

  // Fetch some related products randomly or by category to simulate embedded products if we want
  const relatedProducts = await Product.find({ category: post.category?._id }).limit(2);

  const mainEntityOfPage = {
    "@type": "WebPage",
    "@id": `http://localhost:3000/blog/${post.slug}`,
  };

  const blogPostLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage,
    headline: post.title,
    datePublished: new Date(post.createdAt).toISOString(),
    author: [{
      '@type': 'Person',
      name: settings?.authorName || "Admin",
    }],
    description: post.excerpt,
    image: post.featuredImage
  };

  // Add Product specific LD also
  const productLds = relatedProducts.map(prod => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": prod.title,
    "image": [prod.image],
    "description": prod.title,
    "brand": {
      "@type": "Brand",
      "name": "EliteReviews Choice"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": prod.rating || 4.5,
      "reviewCount": 1
    },
    "offers": {
      "@type": "Offer",
      "url": prod.links?.[0]?.url || prod.affiliateLink,
      "priceCurrency": "USD",
      "price": "0.00", // We don't track real price yet, but schema loves values
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  }));

  const allLds = [blogPostLd, ...productLds];

  // Helper to inject IDs into headings for TOC
  const injectHeadingIds = (html) => {
    return html.replace(/<(h[23])>(.*?)<\/\1>/g, (match, tag, text) => {
      const id = text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
      return `<${tag} id="${id}">${text}</${tag}>`;
    });
  };

  return (
    <article className="pt-28 pb-16 bg-dark-bg min-h-screen relative overflow-x-hidden bg-premium-mesh">
      <ProgressBar />
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />

      {allLds.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 max-w-4xl mx-auto text-center reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-primary-400 shadow-glow">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
            {post.category?.name || "Editorial"}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter leading-[1.1] text-white drop-shadow-lg">{post.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
             <span className="text-gray-300">By {settings?.authorName || "Expert"}</span>
             <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-700"></span>
             <span>{new Date(post.createdAt || new Date()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
             <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-700"></span>
             <span className="text-primary-500">{calculateReadingTime(post.content)}</span>
          </div>
          <div className="flex justify-center mt-10">
            <ShareBar title={post.title} />
          </div>
        </div>

        {/* Global Trust Signal */}
        <div className="max-w-4xl mx-auto mb-16 reveal-up">
          <TrustBanner />
        </div>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 relative">
          {/* Main Content Column */}
          <div className="flex-1 min-w-0 max-w-full">
            {post.featuredImage && (
               <div className="w-full relative aspect-video bg-[#050508] rounded-[2.5rem] mb-16 border border-white/5 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] group reveal-up">
                  <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-80" priority />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-dark-bg to-transparent pointer-events-none" />
               </div>
            )}
        
            <div className="max-w-4xl mx-auto w-full">
              {await (async () => {
                let content = injectHeadingIds(post.content);
                
                const shortcodeRegex = /\[product slug="([^"]+)"\]/g;
                const parts = content.split(/(\[product slug="[^"]+"\])/g);
                
                const renderedParts = await Promise.all(parts.map(async (part, index) => {
                  const match = part.match(/\[product slug="([^"]+)"\]/);
                  
                  if (match) {
                    const slug = match[1];
                    let product = await Product.findOne({ slug }).lean();
                    if (product) product = JSON.parse(JSON.stringify(product));
                    // Simple logic: First product found gets a "Premium Choice" badge
                    const badge = index === 1 ? "Top Pick" : (product?.rating >= 4.8 ? "Premium" : null);
                    return (
                      <StandaloneProductCard 
                        key={index} 
                        product={product} 
                        postSlug={post.slug} 
                        badge={badge}
                      />
                    );
                  }
                  
                  return (
                    <div 
                      key={index}
                      className="prose-elite mb-8 w-full"
                      dangerouslySetInnerHTML={{ __html: part }}
                    />
                  );
                }));
                return renderedParts;
              })()}

              {/* Mobile TOC (redundant if shown at top, but for best fit we show it inside content flow for mobile) */}
              <div className="lg:hidden mt-12 mb-8">
                 <TableOfContents htmlContent={post.content} />
              </div>

              {/* Author Bio Section */}
              <div className="mt-16">
                 <AuthorBox author={settings} />
              </div>

              {/* RELATED CONTENT SECTION (Mobile Only - Desktop uses Sidebar) */}
              {relatedContent.length > 0 && (
                <div className="mt-20 pt-10 border-t border-white/10 lg:hidden">
                   <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                     <span className="w-1.5 h-6 bg-primary-500 rounded-full shadow-glow"></span>
                     You might also like
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                     {relatedContent.map(rc => (
                       <Link key={rc._id.toString()} href={`/blog/${rc.slug}`} className="group block glass p-3 rounded-3xl border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1">
                          <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-800">
                             {rc.featuredImage && (
                               <Image src={rc.featuredImage} alt={rc.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                             )}
                          </div>
                          <h4 className="font-bold text-gray-200 group-hover:text-primary-400 transition-colors line-clamp-2 px-2 pb-2">{rc.title}</h4>
                       </Link>
                     ))}
                   </div>
                </div>
              )}

              {/* Affiliate Product Injections automatically attached at the end based on category */}
              {relatedProducts.length > 0 && (
                <div className="mt-16 p-8 lg:p-10 glass-premium rounded-[2.5rem] border border-primary-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <h3 className="text-2xl font-black mb-8 relative z-10">Featured Equipment</h3>
                  <div className="flex flex-col gap-5 relative z-10">
                    {relatedProducts.map((prod) => (
                      <div key={prod._id.toString()} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary-500/30 transition-colors">
                        <div className="flex items-center w-full sm:w-auto">
                          <div className="w-20 h-20 bg-white rounded-xl p-2 mr-5 relative shrink-0">
                             <Image src={prod.image} fill alt={prod.title} className="object-contain" />
                          </div>
                          <span className="font-bold text-lg">{prod.title}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-5 sm:mt-0 w-full sm:w-auto justify-end">
                          {/* New Multi-Link Support */}
                          {prod.links && prod.links.length > 0 ? (
                            prod.links.map((link, lidx) => (
                              <AffiliateButton 
                                key={lidx} 
                                url={link.url} 
                                platform={link.platform} 
                                productId={prod._id.toString()}
                                postSlug={post.slug}
                              />
                            ))
                          ) : (
                            /* Fallback for legacy data */
                            <AffiliateButton 
                              url={prod.affiliateLink} 
                              productId={prod._id.toString()}
                              postSlug={post.slug}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:w-[320px] xl:w-[360px] hidden lg:block shrink-0 reveal-fade" style={{ animationDelay: '300ms' }}>
            <div className="sticky top-28 space-y-8">
              <TableOfContents htmlContent={post.content} />
              
              {/* Premium Newsletter CTA Widget */}
              <div className="bg-[#0b0b12] rounded-[2rem] p-8 border border-primary-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary-500/30 transition-colors duration-700" />
                <h4 className="font-black text-2xl text-white mb-3 relative z-10 leading-tight">Elite Inner Circle</h4>
                <p className="text-sm text-gray-400 mb-8 relative z-10 leading-relaxed font-light">Join 50k+ enthusiasts receiving our weekly unfiltered gear analysis.</p>
                <form className="relative z-10 flex flex-col gap-4">
                  <input type="email" placeholder="Email Address" required className="w-full bg-[#050508] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors shadow-inner" />
                  <button type="button" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black text-[11px] uppercase tracking-widest py-4 rounded-xl transition-all shadow-glow hover:-translate-y-1">
                    Secure Access
                  </button>
                </form>
              </div>

              {/* Sidebar Related Reads */}
              {relatedContent.length > 0 && (
                <div className="bg-[#0b0b12] border border-white/5 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
                   <h4 className="text-[11px] font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
                     <span className="w-1.5 h-6 bg-primary-500 rounded-full shadow-glow"></span>
                     Trending Intel
                   </h4>
                   <div className="space-y-6">
                     {relatedContent.map(rc => (
                       <Link key={rc._id.toString()} href={`/blog/${rc.slug}`} className="group/item flex gap-4 items-center">
                          {rc.featuredImage && (
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-[#050508]">
                               <Image src={rc.featuredImage} alt={rc.title} fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-bold text-sm text-gray-300 group-hover/item:text-primary-400 transition-colors line-clamp-2 leading-snug">{rc.title}</h5>
                          </div>
                       </Link>
                     ))}
                   </div>
                </div>
              )}

              <AdSlot responsive={true} />
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
