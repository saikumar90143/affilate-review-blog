"use client";

import { useState } from "react";
import { Bell, BellRing, Mail } from "lucide-react";

export default function PriceDropButton({ productId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId })
      });
      
      if (res.ok) {
        setStatus("success");
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        setStatus("idle");
        alert("Verification failed. Please try again.");
      }
    } catch (e) {
      setStatus("idle");
    }
  };

  if (!isOpen && status !== "success") {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-primary-400 transition-colors tracking-widest"
      >
        <Bell className="w-3 h-3" />
        Too expensive? Alert me on price drop
      </button>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full mt-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-green-500 tracking-widest bg-green-500/10 py-2 rounded-xl">
        <BellRing className="w-4 h-4 animate-bounce" />
        Alert Armed. Monitoring Prices.
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-[#050508] border border-primary-500/20 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-2 mb-3 text-white text-sm font-bold">
         <BellRing className="w-4 h-4 text-primary-400" /> Notify me when price drops
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Secure email" 
            required
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 text-white"
          />
        </div>
        <button 
          type="submit"
          disabled={status === "loading"}
          className="bg-primary-600 hover:bg-primary-500 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 shrink-0"
        >
          {status === "loading" ? "Setting Tripwire..." : "Set Alert"}
        </button>
      </form>
    </div>
  );
}
