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
    <main className="min-h-screen bg-gray-950 pb-20">
      <div className="pt-32 pb-16 px-4 border-b border-gray-900">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {blog.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {blog.title}
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {blog.summary}
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 pt-4">
            <span className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
              By AI Editor
            </span>
            <span>•</span>
            <time>{format(new Date(blog.createdAt), "MMMM d, yyyy")}</time>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        <article className="lg:col-span-8">
          {blog.featuredImage && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-blue-900/20 border border-gray-800">
              <Image 
                src={blog.featuredImage} 
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <AdSensePlaceholder position="After Intro" />

          <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-headings:font-bold 
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-800/50
            prose-h3:text-2xl prose-h3:mt-8 
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
            prose-ul:text-gray-300 prose-li:my-2
            prose-strong:text-white prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <AdSensePlaceholder position="End of Article" />
        </article>

        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            <AdSensePlaceholder position="Sidebar Display" />
            
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Related Reads
                </h3>
                <div className="space-y-6">
                  {relatedPosts.map((post) => (
                    <Link key={post._id.toString()} href={`/blog/${post.slug}`} className="group flex gap-4">
                      {post.featuredImage && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-800">
                          <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-2">{format(new Date(post.createdAt), "MMM d, yyyy")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
