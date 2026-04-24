"use client";

import { useState, useEffect } from "react";
import { X, Send, ShieldCheck, Zap } from "lucide-react";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup in this session
    const dismissed = sessionStorage.getItem("exit_popup_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleMouseOut = (e) => {
      // Trigger when mouse leaves the viewport
      if (e.clientY <= 0 && !isDismissed) {
        setIsVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseOut);
    return () => document.removeEventListener("mouseleave", handleMouseOut);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("exit_popup_dismissed", "true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(handleDismiss, 3000);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 transition-opacity animate-in fade-in duration-500">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-premium rounded-[3rem] border border-primary-500/20 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Glow Detail */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary-600/20 blur-[60px] pointer-events-none" />

        <button 
          onClick={handleDismiss}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-12 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-8 shadow-glow">
             <Zap className="w-8 h-8 text-primary-500 fill-primary-500/20" />
          </div>

          {!isSuccess ? (
            <>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-4">
                Claim Your <span className="premium-gradient">Free Tech Guide</span>
              </h3>
              <p className="text-gray-400 font-light leading-relaxed mb-6">
                Get instant access to our <strong className="text-white">2026 Ultimate Tech Buying Guide PDF</strong>. Discover which gear to buy, and the overpriced traps you should avoid.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter secure email address" 
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary-500 transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-glow hover:-translate-y-1 disabled:opacity-50"
                >
                  {isSubmitting ? "Generating PDF..." : "Send Me The Guide"}
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-primary-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">End-to-end encrypted • Zero Spam</span>
              </div>
            </>
          ) : (
            <div className="py-12 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
                  <ShieldCheck className="w-10 h-10 text-green-500" />
               </div>
               <h3 className="text-3xl font-black text-white tracking-tighter mb-4">You're In!</h3>
               <p className="text-gray-400 font-light mb-8">Your email has been verified. Download your 2026 Buying Guide below.</p>
               <a 
                 href="#" 
                 onClick={(e) => {
                   e.preventDefault();
                   alert("Downloading PDF...");
                   setTimeout(handleDismiss, 1000);
                 }}
                 className="inline-flex items-center justify-center w-full py-5 rounded-2xl bg-white hover:bg-gray-100 text-black font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1"
               >
                 Download PDF Now
               </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
