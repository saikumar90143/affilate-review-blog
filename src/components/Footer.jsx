import { Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] border-t border-white/5 py-24 pb-12 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary-600/5 blur-[120px] rounded-full translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary-600 p-1.5 rounded-lg shadow-glow">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter premium-gradient">EliteReviews</h2>
            </div>
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-sm mb-8">
              Meticulously testing thousands of products to find the elite few that truly deserve your domain.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl w-fit">
              <ShieldCheck className="w-4 h-4 text-primary-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Industry Verified Standards</span>
            </div>
          </div>

          {/* Practical Links */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-white mb-8">Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">Home</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">About Us</Link></li>
              <li><Link href="/blog" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">Lab Reports</Link></li>
              <li><Link href="/comparison" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">Comparison Studio</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">Contact</Link></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-white mb-8">Disclosure</h4>
            <p className="text-gray-500 text-xs leading-relaxed font-light italic">
              Our reviews are independent and based on real-world testing. We may earn a commission if you shop through our links, but this never influences our rankings or objectivity. Built for the elite consumer.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} EliteReviews. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
            <Link href="/terms" className="hover:text-primary-500 transition-colors cursor-pointer">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-primary-500 transition-colors cursor-pointer">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
