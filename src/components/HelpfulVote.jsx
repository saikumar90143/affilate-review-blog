"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";

export default function HelpfulVote({ productId, initialYes = 0, initialNo = 0 }) {
  const [voted, setVoted] = useState(null); // "yes" | "no"
  const [yes, setYes] = useState(initialYes);
  const [no, setNo]   = useState(initialNo);
  const [loading, setLoading] = useState(false);

  // Restore vote from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`helpful_${productId}`);
    if (stored) setVoted(stored);
  }, [productId]);

  const submit = async (vote) => {
    if (voted || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/helpful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, vote }),
      });
      if (res.ok) {
        const data = await res.json();
        setYes(data.helpful.yes);
        setNo(data.helpful.no);
        setVoted(vote);
        localStorage.setItem(`helpful_${productId}`, vote);
      }
    } catch (e) {
      console.error("Vote error:", e);
    } finally {
      setLoading(false);
    }
  };

  const total = yes + no;
  const pct = total > 0 ? Math.round((yes / total) * 100) : null;

  return (
    <div className="glass-premium rounded-3xl border border-white/5 p-8 my-12 text-center">
      {voted ? (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
          <p className="text-white font-black text-lg">Thanks for your feedback!</p>
          {pct !== null && (
            <p className="text-gray-400 text-sm">
              <span className="text-green-400 font-black">{pct}%</span> of readers found this helpful
              <span className="text-gray-600 ml-2">({total} votes)</span>
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm uppercase tracking-widest font-black mb-6">
            Was this review helpful?
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => submit("yes")}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/60 rounded-2xl text-green-400 font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <ThumbsUp className="w-5 h-5" />
              Yes {yes > 0 && <span className="text-green-300/60">({yes})</span>}
            </button>
            <button
              onClick={() => submit("no")}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 rounded-2xl text-red-400 font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <ThumbsDown className="w-5 h-5" />
              No {no > 0 && <span className="text-red-300/60">({no})</span>}
            </button>
          </div>
          {total > 0 && (
            <p className="text-gray-600 text-xs mt-6">
              {total} readers have voted
            </p>
          )}
        </>
      )}
    </div>
  );
}
