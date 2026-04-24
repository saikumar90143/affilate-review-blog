"use client";

import { useState } from "react";
import { Send, ShieldCheck, Zap } from "lucide-react";

export default function NewsletterForm({ source = "newsletter", className = "", inputClassName = "", buttonClassName = "" }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source })
      });
      
      if (res.ok) {
        setIsSuccess(true);
        setEmail("");
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center animate-in zoom-in-95 duration-500">
        <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-3" />
        <p className="text-white font-bold mb-1">Access Granted</p>
        <p className="text-xs text-gray-400">Check your inbox for the first field report.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-4 ${className || "flex-col md:flex-row"}`}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="reader@elite.com" 
        required
        className={`w-full px-6 py-4 rounded-xl md:rounded-2xl bg-black/40 border border-white/10 focus:outline-none focus:border-primary-500 transition-all text-white font-light placeholder:text-gray-700 ${inputClassName}`}
      />
      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`w-full px-6 py-4 md:px-10 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-xl md:rounded-[1.5rem] transition-all shadow-glow transform active:scale-95 text-sm md:text-base tracking-[0.1em] disabled:opacity-50 ${buttonClassName}`}
      >
        {isSubmitting ? "Securing..." : "Join Today"}
      </button>
    </form>
  );
}
