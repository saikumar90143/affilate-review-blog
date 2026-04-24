"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  Zap,
  ShieldCheck,
  Star,
  Cpu,
  Dumbbell,
  Sprout,
  Wallet,
  Smartphone,
  Award,
  RefreshCcw,
  ExternalLink, TrendingUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ICON_MAP = {
  tech: Smartphone,
  fitness: Dumbbell,
  finance: Wallet,
  lifestyle: Sprout,
  pro: Award,
  default: Cpu
};

const ACCENT_MAP = {
  tech: "cyan",
  fitness: "green",
  finance: "orange",
  lifestyle: "rose",
  pro: "blue",
  default: "primary"
};

export default function GearMatchmaker({ categories, productsByCategory }) {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    category: null,
    priority: null
  });

  // Calculate the "Elite Pick" based on selections
  const elitePick = useMemo(() => {
    if (!selection.category || !selection.priority) return null;

    const categoryProducts = productsByCategory[selection.category._id] || [];
    if (categoryProducts.length === 0) return null;

    // Sorting Logic
    const sorted = [...categoryProducts].sort((a, b) => {
      if (selection.priority === 'performance') {
        return (b.scores?.performance || 0) - (a.scores?.performance || 0) || (b.rating - a.rating);
      }
      if (selection.priority === 'value') {
        return (b.scores?.value || 0) - (a.scores?.value || 0) || (b.rating - a.rating);
      }
      // Innovation / Latest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sorted[0];
  }, [selection, productsByCategory]);

  const handleCategorySelect = (cat) => {
    setSelection(prev => ({ ...prev, category: cat }));
    setStep(2);
  };

  const handlePrioritySelect = (priority) => {
    setSelection(prev => ({ ...prev, priority }));
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setSelection({ category: null, priority: null });
  };

  const getCategoryIcon = (name) => {
    const key = name.toLowerCase();
    if (key.includes('tech')) return ICON_MAP.tech;
    if (key.includes('fit')) return ICON_MAP.fitness;
    if (key.includes('pay') || key.includes('money') || key.includes('fin')) return ICON_MAP.finance;
    if (key.includes('home') || key.includes('life')) return ICON_MAP.lifestyle;
    if (key.includes('pro')) return ICON_MAP.pro;
    return ICON_MAP.default;
  };

  const getCategoryAccent = (name) => {
    const key = name.toLowerCase();
    if (key.includes('tech')) return ACCENT_MAP.tech;
    if (key.includes('fit')) return ACCENT_MAP.fitness;
    if (key.includes('pay') || key.includes('money') || key.includes('fin')) return ACCENT_MAP.finance;
    if (key.includes('home') || key.includes('life')) return ACCENT_MAP.lifestyle;
    if (key.includes('pro')) return ACCENT_MAP.pro;
    return ACCENT_MAP.default;
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto min-h-[500px] flex flex-col justify-center py-12">
      {/* Step Indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-3 mb-12">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? "bg-primary-500 shadow-glow" : "bg-white/10"
              }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full text-center"
          >
            <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">What is your <span className="premium-gradient">Domain?</span></h3>
            <p className="text-gray-500 mb-12 font-light">Select the field you wish to dominate today.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.name);
                const accent = getCategoryAccent(cat.name);
                return (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat)}
                    className={`group relative p-8 rounded-[2.5rem] bg-[#0d0d12] border border-white/5 hover:border-${accent}-500/50 transition-all duration-500 flex flex-col items-center justify-center gap-4 hover-lift overflow-hidden`}
                  >
                    <div className={`p-4 rounded-2xl glass group-hover:glow-${accent} transition-all`}>
                      <Icon className={`w-8 h-8 text-${accent}-400`} />
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest">{cat.name}</span>
                    <div className={`absolute inset-0 bg-gradient-to-br from-${accent}-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full text-center"
          >
            <button
              onClick={() => setStep(1)}
              className="mb-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-3 h-3" /> Go Back
            </button>
            <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">Identify your <span className="premium-gradient">Priority</span></h3>
            <p className="text-gray-500 mb-12 font-light italic">"{selection.category?.name}" intel request initiated. Strategy required.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  id: 'performance',
                  label: 'Peak Performance',
                  desc: 'Uncompromising power for professional grade requirements.',
                  icon: Zap,
                  accent: 'cyan'
                },
                {
                  id: 'value',
                  label: 'Maximum Value',
                  desc: 'Optimal efficiency and ROI for strategic investment.',
                  icon: Wallet,
                  accent: 'emerald'
                },
                {
                  id: 'innovation',
                  label: 'Latest Innovation',
                  desc: 'Edge-case technology and the newest field reports.',
                  icon: TrendingUp,
                  accent: 'purple'
                }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePrioritySelect(p.id)}
                  className={`group relative p-8 rounded-[2.5rem] bg-[#0d0d12] border border-white/5 hover:border-${p.accent}-500/50 transition-all duration-500 text-left hover-lift overflow-hidden`}
                >
                  <p.icon className={`w-10 h-10 text-${p.accent}-500 mb-6 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-black text-xl mb-2">{p.label}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{p.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full text-center"
          >
            <div className="mb-8 flex items-center justify-center gap-6">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-3 h-3" /> Adjust Specs
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-400 transition-colors"
              >
                <RefreshCcw className="w-3 h-3" /> New Search
              </button>
            </div>

            {elitePick ? (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter">Target <span className="premium-gradient">Acquired.</span></h3>

                <div className="relative glass-premium rounded-[3rem] border border-primary-500/30 overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(59,130,246,0.15)] group">
                  {/* Image Side */}
                  <div className="w-full md:w-2/5 aspect-square relative bg-white p-12">
                    <Image
                      src={elitePick.image}
                      alt={elitePick.title}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                        {selection.priority.toUpperCase()} SCORE: {
                          selection.priority === 'performance' ? elitePick.scores?.performance :
                            selection.priority === 'value' ? elitePick.scores?.value : '95%'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 p-10 md:p-14 text-left flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />

                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(elitePick.rating) ? "fill-current" : "opacity-30"}`} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-500">{elitePick.rating}/5 Professional Grade</span>
                    </div>

                    <h4 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">
                      {elitePick.title}
                    </h4>

                    <div className="space-y-4 mb-8">
                      {elitePick.pros?.slice(0, 3).map((pro, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                          <ShieldCheck className="w-4 h-4 text-primary-500" />
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Link
                        href={`/reviews/${elitePick.slug}`}
                        className="flex-1 bg-white text-black font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl text-center hover:bg-primary-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2"
                      >
                        Read Full Report <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href={elitePick.affiliateLink || elitePick.links?.[0]?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary-600 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl text-center hover:bg-primary-500 transition-all shadow-glow flex items-center justify-center gap-2"
                      >
                        Store Access <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <Zap className="w-8 h-8 text-gray-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Intel Pipeline Empty</h3>
                <p className="text-gray-500 max-w-sm mx-auto font-light leading-relaxed">
                  Our experts are currently field-testing gear for this specific requirement. Check back in 24-48 hours.
                </p>
                <button
                  onClick={reset}
                  className="mt-10 px-8 py-4 rounded-xl border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Try another configuration
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
