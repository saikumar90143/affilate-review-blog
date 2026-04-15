"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Zap, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-bg bg-premium-mesh relative overflow-hidden">
      {/* Animated Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/2 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="relative w-full max-w-md reveal-up">
        {/* Elite Login Card */}
        <div className="glass-premium rounded-[2.5rem] p-10 md:p-12 border-white/10 shadow-premium backdrop-blur-3xl overflow-hidden group">
          
          {/* Subtle logo shine */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>

          {/* Logo / brand */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#050505] border border-white/10 mb-6 shadow-glow group-hover:rotate-12 transition-transform duration-500">
               <Zap className="w-8 h-8 text-primary-500 fill-primary-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Welcome Back</h1>
            <div className="flex items-center justify-center gap-1.5 opacity-50">
               <ShieldCheck className="w-3.5 h-3.5" />
               <p className="text-[10px] font-black uppercase tracking-widest">Secure Admin Portal</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 text-xs font-bold animate-in fade-in slide-in-from-top-2">
              <span className="shrink-0 mt-0.5">✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Email Authority</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input w-full"
                placeholder="admin@elitereviews.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Secret Key</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input w-full pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-black py-4 rounded-2xl transition-all mt-4 shadow-glow transform active:scale-95"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin text-primary-600" /> Authenticating…</>
              ) : (
                <>Sign In to Vault <Zap className="w-4 h-4 text-primary-600 fill-primary-600" /></>
              )}
            </button>
          </form>

          <footer className="text-center mt-10">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
              Admin Access Only. Monitored for Security.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
