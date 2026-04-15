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
    <article className="py-16 bg-dark-bg min-h-screen relative">
      <ProgressBar />
      {allLds.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-4xl mx-auto text-center">
          <span className="text-primary-500 font-bold uppercase tracking-widest text-sm bg-primary-500/10 px-4 py-1.5 rounded-full">{post.category?.name || "General"}</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-6 mb-8 tracking-tighter leading-tight drop-shadow-lg">{post.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 font-medium">
             <span>By {settings?.authorName || "Expert"}</span>
             <span className="hidden sm:inline">•</span>
             <span>{new Date(post.createdAt || new Date()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
             <span className="hidden sm:inline">•</span>
             <span>{calculateReadingTime(post.content)}</span>
          </div>
          <div className="flex justify-center mt-8">
            <ShareBar title={post.title} />
          </div>
        </div>

        {/* Global Trust Signal */}
        <div className="max-w-4xl mx-auto mb-10">
          <TrustBanner />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 relative">
          {/* Main Content Column */}
          <div className="flex-1 min-w-0">
            {post.featuredImage && (
               <div className="w-full relative aspect-video bg-gray-900 rounded-[2rem] mb-12 border border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                  <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" priority />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
               </div>
            )}
        
            <div className="max-w-4xl mx-auto">
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

              {/* RELATED CONTENT SECTION */}
              {relatedContent.length > 0 && (
                <div className="mt-20 pt-10 border-t border-white/10">
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
          <aside className="lg:w-72 xl:w-80 hidden lg:block shrink-0 reveal-fade" style={{ animationDelay: '300ms' }}>
            <div className="sticky top-24 space-y-8">
              <TableOfContents htmlContent={post.content} />
              <AdSlot />
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
