"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [selectedIds, setSelectedIds] = useState([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("comparison_ids");
    if (saved) setSelectedIds(JSON.parse(saved));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("comparison_ids", JSON.stringify(selectedIds));
  }, [selectedIds]);

  const toggleProduct = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : (prev.length < 4 ? [...prev, id] : prev) // Limit to 4 for UX
    );
  };

  const clearSection = () => setSelectedIds([]);

  return (
    <ComparisonContext.Provider value={{ selectedIds, toggleProduct, clearSection }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) throw new Error("useComparison must be used within a ComparisonProvider");
  return context;
}
