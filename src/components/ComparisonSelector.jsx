"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Search, ArrowRight, SlidersHorizontal } from "lucide-react";

export default function ComparisonSelector({ allProducts, categories = [] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const productCatId = p.category?._id?.toString() || p.category?.toString() || p.category;
      const matchesCat = categoryFilter === "all" || productCatId === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [allProducts, search, categoryFilter]);

  const toggle = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      router.push(`/comparison?ids=${selectedIds.join(",")}`);
    }
  };

  return (
    <div>
      {/* Selection Counter & Action */}
      <div className={`sticky top-24 z-30 mb-8 transition-all duration-300 ${selectedIds.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="glass border border-primary-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-xl shadow-2xl">
          <p className="text-white font-bold text-sm sm:text-base">
            <span className="text-primary-400 text-xl sm:text-2xl font-black mr-2">{selectedIds.length}</span>
            {selectedIds.length === 1 ? "product selected" : "products selected"}
            <span className="text-gray-500 text-xs sm:text-sm ml-2">(select at least 2)</span>
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={() => setSelectedIds([])} className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
              Clear all
            </button>
            <button
              onClick={handleCompare}
              disabled={selectedIds.length < 2}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
            >
              Compare Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-dark-card border border-border rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-primary-500 transition-colors text-sm"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-dark-card border border-border rounded-xl pl-11 pr-8 py-3 text-white outline-none focus:border-primary-500 transition-colors appearance-none text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-16 border border-border rounded-2xl glass">
          No products found. Try adjusting your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => {
            const isSelected = selectedIds.includes(p._id.toString());
            const isMaxed = selectedIds.length >= 4 && !isSelected;
            return (
              <button
                key={p._id.toString()}
                onClick={() => !isMaxed && toggle(p._id.toString())}
                disabled={isMaxed}
                className={`relative group text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary-500 bg-primary-500/10 shadow-glow"
                    : isMaxed
                    ? "border-border opacity-40 cursor-not-allowed"
                    : "border-border hover:border-primary-500/50 bg-dark-card hover:-translate-y-1"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-md z-10">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="relative w-full aspect-square bg-white rounded-xl mb-3 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs font-bold text-white line-clamp-2 mb-1 leading-snug">{p.title}</p>
                <p className="text-xs text-yellow-500 font-black">⭐ {p.rating}/5</p>
              </button>
            );
          })}
        </div>
      )}

      {selectedIds.length >= 2 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleCompare}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 px-12 rounded-2xl transition-all text-lg shadow-glow hover:scale-105 active:scale-95"
          >
            Compare {selectedIds.length} Products <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
