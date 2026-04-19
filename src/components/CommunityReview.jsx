"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";

export default function CommunityReview({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0 });
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, text, username })
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setText("");
        setUsername("");
        fetchReviews(); // refresh
      }
    } catch(e) {
      alert("Failed to submit review.");
    }
  };

  if (loading) return <div className="animate-pulse h-20 bg-white/5 rounded-xl mt-6"></div>;

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-400" />
            Community Reviews
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(stats.average) ? 'fill-current' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-sm font-bold">{stats.average} out of 5</span>
            <span className="text-xs text-gray-400">({stats.total} ratings)</span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold transition-colors shadow-glow"
        >
          {showForm ? "Cancel" : "Add Review"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-black/40 p-5 rounded-2xl border border-primary-500/30">
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tap to Rate</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'
                  }`} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Your Name (Optional)" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#050508] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <textarea 
            placeholder="Share your experience..." 
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-[#050508] border border-white/10 rounded-lg px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:border-primary-500 mb-4"
          />
          <button type="submit" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors">
            <Send className="w-4 h-4" />
            Submit Verification
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No community reviews yet. Be the first!</p>
        ) : (
          reviews.map(r => (
            <div key={r._id.toString()} className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">{r.username}</span>
                  {r.isVerified && <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Verified</span>}
                </div>
                <span className="text-xs text-gray-500">{format(new Date(r.createdAt), "MMM d, yyyy")}</span>
              </div>
              <div className="flex text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-gray-600'}`} />)}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-light">{r.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
