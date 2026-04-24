"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function WatchlistButton({ product }) {
  const [saved, setSaved] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setSaved(watchlist.some((p) => p._id === product._id));
  }, [product._id]);

  const toggle = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    let updated;
    if (saved) {
      updated = watchlist.filter((p) => p._id !== product._id);
    } else {
      updated = [
        ...watchlist,
        {
          _id: product._id,
          title: product.title,
          slug: product.slug,
          image: product.image,
          rating: product.rating,
        },
      ];
    }
    localStorage.setItem("watchlist", JSON.stringify(updated));
    setSaved(!saved);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 600);
  };

  return (
    <button
      onClick={toggle}
      title={saved ? "Remove from Watchlist" : "Save to Watchlist"}
      className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
        animate ? "scale-110" : "scale-100"
      } ${
        saved
          ? "bg-primary-500/20 border-primary-500/50 text-primary-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
          : "bg-white/5 border-white/10 text-gray-400 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-400"
      }`}
    >
      {saved ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
