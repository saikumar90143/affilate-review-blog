"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Loader2 } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}&limit=20`);
        const data = await res.json();
        setResults(data.posts || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="py-24 bg-dark-bg min-h-screen bg-premium-mesh">
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
            {query ? `Showing results for "${query}"` : "Enter a search term above to begin Scanning."}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Scanning database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((post) => (
              <article key={post._id} className="group glass-premium rounded-[2.5rem] border border-white/5 hover:border-primary-500/30 overflow-hidden transition-all duration-500 flex flex-col hover:-translate-y-2">
                <Link href={`/blog/${post.slug}`} className="relative aspect-video w-full overflow-hidden block">
                  {post.featuredImage ? (
                    <Image 
                      src={post.featuredImage} 
                      alt={post.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-900" />
                  )}
                </Link>
                <div className="p-8">
                  <h2 className="text-2xl font-black mb-4 text-white group-hover:text-primary-400 transition-colors leading-tight line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-xs font-black uppercase tracking-widest text-primary-400 group-hover:text-white transition-colors">
                    Access Intel <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}

            {results.length === 0 && query && !loading && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 text-lg">No records found matching your query.</p>
                <Link href="/blog" className="text-primary-500 mt-4 inline-block font-bold">Return to all reports</Link>
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
