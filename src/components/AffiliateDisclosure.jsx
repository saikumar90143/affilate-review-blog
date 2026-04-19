import { Info } from "lucide-react";

export default function AffiliateDisclosure() {
  return (
    <div className="w-full bg-primary-600/5 border border-primary-500/10 rounded-2xl p-4 sm:p-5 flex gap-4 items-start reveal-fade shadow-sm mb-12">
      <div className="bg-primary-600/20 p-2 rounded-xl shrink-0">
        <Info className="w-5 h-5 text-primary-400" />
      </div>
      <div className="space-y-1">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-primary-400">Trust & Transparency</h5>
        <p className="text-gray-400 text-xs leading-relaxed font-light italic">
          EliteReviews is reader-supported. We may earn a commission from qualifying purchases made through our affiliate links at no extra cost to you. Our editorial integrity remains our top priority.
        </p>
      </div>
    </div>
  );
}
