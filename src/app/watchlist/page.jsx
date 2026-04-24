"use client";

import { useState, useEffect } from "react";
import { Bookmark, Trash2, Star, ArrowRight, PackageOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WatchlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setItems(data);
  }, []);

  const remove = (id) => {
    const updated = items.filter((p) => p._id !== id);
    setItems(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <div className="py-24 min-h-screen bg-dark-bg bg-premium-mesh">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-14">
          <div className="p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20">
            <Bookmark className="w-7 h-7 text-primary-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Gear Watchlist</h1>
            <p className="text-gray-500 text-sm mt-1">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32 glass-premium rounded-[3rem] border border-white/5">
            <PackageOpen className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white mb-4">Watchlist is Empty</h2>
            <p className="text-gray-500 mb-10 max-w-xs mx-auto font-light leading-relaxed">
              Save gear from any review page to track and compare your shortlist.
            </p>
            <Link
              href="/products"
              className="px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-glow"
            >
              Browse Elite Gear
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="group glass-premium rounded-3xl border border-white/5 hover:border-primary-500/20 p-5 transition-all hover:-translate-y-2 relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => remove(item._id)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-all z-10"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link href={`/reviews/${item.slug}`}>
                  <div className="relative aspect-square w-full bg-white rounded-2xl mb-4 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm font-black text-white line-clamp-2 leading-snug mb-3">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-yellow-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-black">{item.rating}</span>
                    </div>
                    <span className="text-[10px] font-black text-primary-400 flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
