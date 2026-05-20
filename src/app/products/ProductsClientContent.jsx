"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import AffiliateButton from "@/components/AffiliateButton";

export default function ProductsClientContent({ initialProducts, categories }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  // Client-side filtering for zero-latency loading
  const filteredProducts = activeCategory
    ? initialProducts.filter(p => p.category?.slug === activeCategory)
    : initialProducts;

  const activeTabStyle = "px-5 py-2.5 rounded-full border border-primary-500 bg-primary-600/10 text-primary-400 text-xs uppercase tracking-[0.2em] font-black whitespace-nowrap shadow-[0_0_15px_rgba(59,130,246,0.15)]";
  const inactiveTabStyle = "px-5 py-2.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-semibold whitespace-nowrap text-gray-400";

  return (
    <div className="py-24 bg-dark-bg min-h-screen relative overflow-hidden bg-premium-mesh">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <span className="text-primary-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 block">
            Lab Tested
          </span>
          <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter text-white">
            Elite Products
          </h1>
          <p className="text-gray-400 text-sm md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Every product reviewed by experts. No fluff, no filler — only the best gear makes the cut.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          {["Expert Tested", "Unbiased Reviews", "Real-World Testing"].map(badge => (
            <div key={badge} className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
              {badge}
            </div>
          ))}
        </div>

        {/* Category filter tabs with soft navigation and scroll={false} */}
        {categories.length > 0 && (
          <div className="flex justify-start md:justify-center gap-2 md:gap-3 mb-10 md:mb-16 overflow-x-auto pb-4 px-2 md:px-0 snap-x">
            <Link href="/products" scroll={false} className={!activeCategory ? activeTabStyle : inactiveTabStyle}>
              All Products
            </Link>
            {categories.map(cat => (
              <Link
                key={cat._id.toString()}
                href={`/products?category=${cat.slug}`}
                scroll={false}
                className={activeCategory === cat.slug ? activeTabStyle : inactiveTabStyle}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id.toString()}
                className="group relative bg-[#0d0d14] rounded-[2rem] border border-white/5 hover:border-primary-500/30 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] flex flex-col"
              >
                {/* Rating badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-black text-white">{product.rating}</span>
                </div>

                {/* Category badge */}
                {product.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary-600/20 text-primary-400 border border-primary-500/20">
                      {product.category.name}
                    </span>
                  </div>
                )}

                {/* Image */}
                <Link href={`/reviews/${product.slug}`} className="relative aspect-square w-full bg-white overflow-hidden block p-6 shrink-0">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0d0d14] to-transparent" />
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-base font-black text-white leading-tight mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                    <Link href={`/reviews/${product.slug}`}>{product.title}</Link>
                  </h2>

                  {/* Pros preview */}
                  {product.pros?.length > 0 && (
                    <p className="text-xs text-green-400 font-semibold mb-4 line-clamp-1">
                      ✓ {product.pros[0]}
                    </p>
                  )}

                  <div className="mt-auto space-y-2">
                    {product.links?.length > 0 ? (
                      product.links.slice(0, 1).map((link, i) => (
                        <AffiliateButton
                          key={i}
                          url={link.url}
                          platform={link.platform}
                          productId={product._id.toString()}
                          className="w-full py-3 text-xs font-black rounded-xl"
                        />
                      ))
                    ) : (
                      <AffiliateButton
                        url={product.affiliateLink}
                        text="Check Price"
                        productId={product._id.toString()}
                        className="w-full py-3 text-xs font-black rounded-xl"
                      />
                    )}
                    <Link
                      href={`/reviews/${product.slug}`}
                      className="w-full py-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-[10px] font-black text-gray-500 flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
                    >
                      Read Review <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compare CTA */}
        {initialProducts.length > 1 && (
          <div className="mt-20 text-center">
            <p className="text-gray-500 text-sm mb-4">Want to compare products side by side?</p>
            <Link
              href="/comparison"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-premium border border-white/10 hover:border-primary-500/30 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/5"
            >
              Open Comparison Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
