import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

export const metadata = {
  title: "Blog | EliteReviews",
  description: "Read our latest articles, guides, and tips.",
};

export const revalidate = 60;

function calculateReadingTime(content) {
  if (!content) return "1 min read";
  const textContent = content.replace(/<[^>]*>?/gm, ""); // strip HTML
  const words = textContent.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default async function BlogList({ searchParams }) {
  await connectToDatabase();
  
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams?.category;

  let postFilter = { isPublished: true };

  if (activeCategory) {
    const categoryDoc = await Category.findOne({ slug: activeCategory });
    if (categoryDoc) {
      postFilter.category = categoryDoc._id;
    }
  }
  
  const [posts, categories] = await Promise.all([
    Post.find(postFilter).sort({ createdAt: -1 }).populate('category').lean(),
    Category.find({}).sort({ name: 1 })
  ]);

  const activeTabStyle = "px-6 py-2.5 rounded-full border border-primary-500 bg-primary-600/10 text-primary-400 transition-colors text-xs uppercase tracking-[0.2em] font-black whitespace-nowrap shadow-[0_0_15px_rgba(59,130,246,0.15)]";
  const inactiveTabStyle = "px-6 py-2.5 rounded-full border border-white/5 glass hover:bg-white/10 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-semibold whitespace-nowrap text-gray-400";

  // Split out the featured post if viewing all
  const featuredPost = !activeCategory && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="py-24 bg-dark-bg min-h-screen relative overflow-hidden bg-premium-mesh">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-20">
           <span className="text-primary-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block">Editorial</span>
           <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter text-white">Elite Insights</h1>
           <p className="text-gray-400 text-sm md:text-xl max-w-2xl mx-auto font-light leading-relaxed">Expert analysis, deep dives, and the latest tech intel to keep you ahead of the curve.</p>
        </div>
        
        <div className="flex justify-start md:justify-center gap-2 md:gap-3 mb-10 md:mb-16 overflow-x-auto pb-4 custom-scrollbar px-2 md:px-0 snap-x">
          <Link href="/blog" scroll={false} className={!activeCategory ? activeTabStyle : inactiveTabStyle}>
            All Reports
          </Link>
          {categories.map((cat) => (
            <Link key={cat._id.toString()} href={`/blog?category=${cat.slug}`} scroll={false} className={activeCategory === cat.slug ? activeTabStyle : inactiveTabStyle}>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Featured Post Hero */}
        {featuredPost && (
          <div className="mb-24 reveal-up">
            <Link href={`/blog/${featuredPost.slug}`} className="group block relative rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_30px_80px_-15px_rgba(59,130,246,0.25)] transition-all duration-700 hover:-translate-y-2">
               <div className="relative aspect-[4/3] sm:aspect-[21/9] max-h-[650px] w-full bg-[#050508] overflow-hidden">
                 {featuredPost.featuredImage && (
                   <Image src={featuredPost.featuredImage} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-60 group-hover:opacity-80" priority />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-[#0b0b12]/60 to-transparent" />
                 <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b12]/80 via-transparent to-transparent" />
               </div>
               
               <div className="absolute inset-0 p-8 sm:p-16 flex flex-col justify-end z-10">
                  <div className="max-w-4xl">
                     <div className="flex flex-wrap items-center gap-4 mb-6">
                       <span className="px-4 py-1.5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2">
                         <Star className="w-3 h-3 fill-white" /> Featured Edition
                       </span>
                       <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-300 border border-white/10">
                         {featuredPost.category?.name || 'General'}
                       </span>
                       <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{calculateReadingTime(featuredPost.content)}</span>
                     </div>
                     <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] group-hover:text-primary-400 transition-colors tracking-tighter drop-shadow-2xl">
                       {featuredPost.title}
                     </h2>
                     <p className="text-gray-300 text-lg md:text-xl line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow-md hidden sm:block max-w-3xl font-light">
                       {featuredPost.excerpt}
                     </p>
                  </div>
               </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <article key={post._id.toString()} className="group relative bg-[#0d0d14] rounded-[2.5rem] border border-white/5 hover:border-primary-500/30 overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] transition-all duration-500 flex flex-col hover:-translate-y-2">
              <Link href={`/blog/${post.slug}`} className="relative aspect-[16/11] w-full overflow-hidden block shrink-0">
                <div className="absolute top-5 right-5 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                  {post.category?.name || 'General'}
                </div>
                {post.featuredImage ? (
                  <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                ) : (
                  <div className="absolute inset-0 bg-[#050508]" />
                )}
                {/* Embedded gradient overlay to blend perfectly into the card body */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d0d14] to-transparent" />
                <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />
              </Link>
              
              <div className="px-8 pb-8 flex-1 flex flex-col relative z-10">
                <div className="flex items-center gap-3 mb-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                   <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                   <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                   <span>{calculateReadingTime(post.content)}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-white group-hover:text-primary-400 transition-colors leading-tight line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="focus:outline-none before:absolute before:inset-0">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3 font-light flex-1">{post.excerpt}</p>
                
                <div className="mt-auto">
                   <span className="inline-flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-white/5 group-hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-none group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      Read Report <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                   </span>
                </div>
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <div className="col-span-1 md:col-span-3 pb-20 pt-10 text-center flex flex-col items-center justify-center">
               <p className="text-gray-400 font-medium tracking-wide">No proprietary intel found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
