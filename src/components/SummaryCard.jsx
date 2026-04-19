import { CheckCircle2, ChevronRight } from "lucide-react";

export default function SummaryCard({ title, items = [], bottomLine = "" }) {
  if (!items.length && !bottomLine) return null;

  return (
    <div className="my-12 relative overflow-hidden group">
      {/* Premium Border Gradient */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500/50 via-primary-600/30 to-primary-500/50 rounded-[2.5rem] opacity-50 blur-[1px]"></div>
      
      <div className="relative bg-[#0d0d14] rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Key Intelligence List */}
          <div className="flex-1">
            <h4 className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-white mb-8">
              <span className="w-1.5 h-6 bg-primary-500 rounded-full shadow-glow"></span>
              Strategic <span className="premium-gradient">Takeaways</span>
            </h4>
            
            <ul className="space-y-5">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 group/item">
                  <div className="mt-1 bg-primary-600/20 p-1 rounded-md group-hover/item:bg-primary-600/40 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-primary-400" />
                  </div>
                  <span className="text-gray-300 text-sm leading-relaxed font-light">{item}</span>
                </li>
              ))}
              {items.length === 0 && (
                <p className="text-gray-500 text-sm italic">Scanning for key data points...</p>
              )}
            </ul>
          </div>

          {/* Bottom Line / Verdict */}
          {bottomLine && (
            <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-white/5 pt-10 md:pt-0 md:pl-10 flex flex-col justify-center">
              <div className="bg-primary-600/10 rounded-2xl p-6 border border-primary-500/20 relative group-hover:border-primary-500/40 transition-all duration-700">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-glow">
                  The Bottom Line
                </div>
                <p className="text-white text-base font-bold leading-relaxed mb-4 italic">
                  "{bottomLine}"
                </p>
                <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-widest">
                  EliteReviews Verdict <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-600/10 blur-[50px] rounded-full pointer-events-none -mr-10 -mb-10 opacity-50"></div>
      </div>
    </div>
  );
}
