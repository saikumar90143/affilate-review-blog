"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Loader2, Star } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [data, setData] = useState({ posts: [], products: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const hasAnyResults = data.posts.length > 0 || data.products.length > 0;

  return (
    <div className="py-24 bg-dark-bg min-h-screen bg-premium-mesh overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Intelligence <span className="premium-gradient">Search</span>
          </h1>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = formData.get("q");
              if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
            }}
            className="relative flex items-center group mb-8"
          >
            <Search className="absolute left-6 w-6 h-6 text-primary-500 group-focus-within:text-white transition-colors" />
            <input 
              name="q"
              type="text" 
              defaultValue={query}
              placeholder="Query intelligence archives..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-xl text-white focus:outline-none focus:border-primary-500 transition-all shadow-inner"
            />
          </form>
          <p className="text-gray-400 text-lg font-light">
            {query ? `Scanning results for "${query}"` : "Enter a search term above to begin Scanning."}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Scanning database...</p>
          </div>
        ) : (
          <div className="space-y-24">
            {/* Products Section */}
            {data.products.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                   <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Elite Gear</h2>
                   <div className="flex-1 h-px bg-white/5"></div>
                   <span className="text-[10px] font-black text-primary-500 border border-primary-500/30 px-3 py-1 rounded-full uppercase">{data.products.length} Found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.products.map((prod) => (
                    <Link key={prod._id} href={`/reviews/${prod.slug}`} className="group glass-premium rounded-3xl border border-white/5 hover:border-primary-500/30 p-6 transition-all hover:-translate-y-2">
                       <div className="relative aspect-square w-full bg-white rounded-2xl p-4 mb-6 mb-4 overflow-hidden">
                          <Image 
                            src={prod.image} 
                            alt={prod.title} 
                            fill 
                            className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                          />
                       </div>
                       <h3 className="text-sm font-black text-white mb-2 line-clamp-1">{prod.title}</h3>
                       <div className="flex items-center gap-2 mb-4">
                          <div className="flex text-yellow-500">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-3 h-3 ${i < Math.floor(prod.rating) ? 'fill-current' : 'text-gray-600'}`} />
                             ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold">{prod.rating} Intel Score</span>
                       </div>
                       <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
                          View Specs <ArrowRight className="w-3 h-3" />
                       </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Posts Section */}
            {data.posts.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                   <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Expert Reports</h2>
                   <div className="flex-1 h-px bg-white/5"></div>
                   <span className="text-[10px] font-black text-cyan-500 border border-cyan-500/30 px-3 py-1 rounded-full uppercase">{data.posts.length} Found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.posts.map((post) => (
                    <article key={post._id} className="group glass-premium rounded-[2.5rem] border border-white/5 hover:border-primary-500/30 overflow-hidden transition-all duration-500 flex flex-col hover:-translate-y-2">
                      <Link href={`/blog/${post.slug}`} className="relative aspect-video w-full overflow-hidden block">
                        {post.featuredImage ? (
                          <Image 
                            src={post.featuredImage} 
                            alt={post.title} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-900" />
                        )}
                      </Link>
                      <div className="p-8">
                        <h3 className="text-xl font-black mb-4 text-white group-hover:text-primary-400 transition-colors leading-tight line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-400 text-xs mb-8 leading-relaxed line-clamp-2">{post.excerpt}</p>
                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-primary-400 group-hover:text-white transition-colors">
                          Access Intel <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {!hasAnyResults && query && !loading && (
              <div className="py-20 text-center glass-premium rounded-[3rem] border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                   <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">No Intelligence Records Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8 font-light leading-relaxed">
                   Our scanners could not find any gear or reports matching your query. Verify the target and try again.
                </p>
                <Link href="/blog" className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary-500 hover:text-white transition-all shadow-xl">
                   Return to Archives
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading Search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
