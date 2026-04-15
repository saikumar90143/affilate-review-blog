import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Link from "next/link";
import Image from "next/image";

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

  const activeTabStyle = "px-6 py-2.5 rounded-full border border-primary-500 bg-primary-600/10 text-primary-400 transition-colors text-sm font-black whitespace-nowrap shadow-[0_0_15px_rgba(59,130,246,0.15)]";
  const inactiveTabStyle = "px-6 py-2.5 rounded-full border border-white/5 glass hover:bg-white/10 hover:text-white transition-colors text-sm font-medium whitespace-nowrap text-gray-400";

  // Split out the featured post if viewing all
  const featuredPost = !activeCategory && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="py-20 bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter premium-gradient">Elite Insights</h1>
           <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">Expert analysis, deep dives, and the latest trends to inform your next big move.</p>
        </div>
        
        <div className="flex justify-center gap-3 mb-16 overflow-x-auto pb-4 custom-scrollbar">
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
          <div className="mb-16 reveal-up">
            <Link href={`/blog/${featuredPost.slug}`} className="group block relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <div className="relative aspect-[4/3] sm:aspect-[21/9] max-h-[600px] w-full bg-gray-900 overflow-hidden">
                 {featuredPost.featuredImage && (
                   <Image src={featuredPost.featuredImage} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100" priority />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
               </div>
               
               <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end">
                  <div className="max-w-3xl">
                     <div className="flex items-center gap-4 mb-4">
                       <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-glow">{featuredPost.category?.name || 'Featured'}</span>
                       <span className="text-gray-300 text-sm font-medium">{calculateReadingTime(featuredPost.content)}</span>
                     </div>
                     <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-primary-400 transition-colors drop-shadow-lg">{featuredPost.title}</h2>
                     <p className="text-gray-300 text-base md:text-lg line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow-md hidden sm:block">{featuredPost.excerpt}</p>
                  </div>
               </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <article key={post._id.toString()} className="bg-dark-card border border-white/5 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-white/10 hover:-translate-y-1 transition-all flex flex-col group duration-300">
              <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] w-full bg-gray-800 overflow-hidden block">
                {post.featuredImage && (
                  <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="p-8 flex-1 flex flex-col relative z-10 glass">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-primary-500">{post.category?.name || 'General'}</span>
                  <span className="text-xs text-gray-500 font-medium">{calculateReadingTime(post.content)}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white text-gray-100 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blog/${post.slug}`} className="focus:outline-none before:absolute before:inset-0">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                <div className="mt-auto flex items-center justify-between text-sm">
                  <span className="text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="text-primary-500 font-semibold group-hover:translate-x-1 transition-transform">Read &rarr;</span>
                </div>
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <div className="col-span-1 md:col-span-3 pb-20 pt-10 text-center flex flex-col items-center justify-center">
               <p className="text-gray-400 font-medium tracking-wide">No posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
