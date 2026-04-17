import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

const AdSensePlaceholder = ({ position }) => (
  <div className="w-full bg-gray-900 border border-gray-800 rounded-xl py-8 my-8 flex flex-col items-center justify-center relative overflow-hidden group">
    <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10" />
    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-950 px-3 py-1 rounded-full border border-gray-800 relative z-10 mb-2">
      Advertisement
    </span>
    <p className="text-sm text-gray-600 relative z-10">[Google AdSense Space: {position}]</p>
  </div>
);

export default function AIBlogPostLayout({ blog, relatedPosts }) {
  return (
    <article className="pt-28 pb-16 bg-[#050508] min-h-screen relative overflow-x-hidden bg-premium-mesh">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 max-w-4xl mx-auto text-center reveal-up">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {blog.tags?.map((tag) => (
              <span key={tag} className="px-4 py-1.5 bg-primary-600 border border-primary-500/20 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-glow">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.1] drop-shadow-lg mb-8">
            {blog.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-8">
            {blog.summary}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase font-black tracking-widest text-gray-500">
            <span className="flex items-center gap-2 text-gray-300">
              <span className="w-2 h-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full animate-pulse" />
              Machine Intel
            </span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-700"></span>
            <time>{format(new Date(blog.createdAt), "MMMM d, yyyy")}</time>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 relative">
          <div className="flex-1 min-w-0 max-w-full">
            {blog.featuredImage && (
              <div className="w-full relative aspect-video bg-[#050508] rounded-[2.5rem] mb-16 border border-white/5 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] group reveal-up">
                <Image 
                  src={blog.featuredImage} 
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-80"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none" />
              </div>
            )}

          <AdSensePlaceholder position="After Intro" />

          <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-headings:font-bold 
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-800/50
            prose-h3:text-2xl prose-h3:mt-8 
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300 hover:prose-a:underline
            prose-ul:text-gray-300 prose-li:my-2
            prose-strong:text-white prose-strong:font-bold overflow-x-hidden"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <AdSensePlaceholder position="End of Article" />
          </div>

        <aside className="lg:w-80 shrink-0 space-y-8">
          <div className="sticky top-28 space-y-8">
            <AdSensePlaceholder position="Sidebar Display" />
            
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="bg-[#0b0b12] border border-white/5 shadow-2xl rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-[40px] pointer-events-none" />
                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-6 rounded-full bg-primary-500 shadow-glow" />
                  Related Intel
                </h3>
                <div className="space-y-6 relative z-10">
                  {relatedPosts.map((post) => (
                    <Link key={post._id.toString()} href={`/blog/${post.slug}`} className="group/item flex gap-5 items-center">
                      {post.featuredImage && (
                        <div className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-[#050508]">
                          <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-gray-200 group-hover/item:text-primary-400 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2">{format(new Date(post.createdAt), "MMM d, yyyy")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
        </div>
      </div>
    </article>
  );
}
