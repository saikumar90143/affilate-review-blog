import { ShieldCheck, Info } from "lucide-react";

export default function TrustBanner() {
  return (
    <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-4 mb-8 flex items-start gap-4">
      <div className="bg-primary-500 p-2 rounded-xl shrink-0">
        <ShieldCheck className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2">
           <h4 className="text-sm font-bold text-white uppercase tracking-wider">Editorial Integrity</h4>
           <div className="group relative">
             <Info className="w-3.5 h-3.5 text-gray-500 cursor-help" />
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 border border-gray-700 rounded-xl text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
               Our reviews are independent and based on real-world testing. We may earn a commission if you shop through our links, but this never influences our rankings.
             </div>
           </div>
        </div>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          This post has been verified for accuracy. Every product featured is hand-selected and rigorously evaluated by our expert team.
        </p>
      </div>
    </div>
  );
}
