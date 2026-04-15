"use client";

import { useComparison } from "@/context/ComparisonContext";
import { ArrowRight, X, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function FloatingComparisonBar() {
  const { selectedIds, clearSection, toggleProduct } = useComparison();

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="glass shadow-2xl rounded-2xl border border-primary-500/50 p-4 bg-dark-card/90 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
             <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white text-sm sm:text-base">{selectedIds.length} Products Selected</p>
            <p className="text-gray-400 text-xs sm:block hidden">Compare up to 4 models side-by-side</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={clearSection}
            className="text-gray-400 hover:text-white text-sm font-medium px-3 py-1 transition-colors"
          >
            Clear
          </button>
          
          <Link 
            href={`/comparison?ids=${selectedIds.join(",")}`}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Compare <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
