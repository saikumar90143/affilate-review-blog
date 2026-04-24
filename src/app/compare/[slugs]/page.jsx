import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, X, ShieldCheck, Zap } from "lucide-react";
import GlowCard from "@/components/GlowCard";
import MagneticButton from "@/components/MagneticButton";
import TrustRadar from "@/components/TrustRadar";
import RevealText from "@/components/RevealText";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slugs } = await params;
  if (!slugs.includes("-vs-")) return {};
  
  const [slug1, slug2] = slugs.split("-vs-");
  await connectToDatabase();
  
  const [p1, p2] = await Promise.all([
    Product.findOne({ slug: slug1 }).select("title image").lean(),
    Product.findOne({ slug: slug2 }).select("title image").lean()
  ]);

  if (!p1 || !p2) return {};

  return {
    title: `${p1.title} vs ${p2.title} | Head-to-Head Comparison`,
    description: `Read our comprehensive breakdown comparing the ${p1.title} and the ${p2.title}. Discover which gear reigns supreme in our expert test.`,
    openGraph: {
      title: `${p1.title} VS ${p2.title}`,
      description: `Ultimate head-to-head tech showdown.`,
    }
  };
}

export default async function CompareVersusPage({ params }) {
  const { slugs } = await params;
  
  if (!slugs.includes("-vs-")) return notFound();
  
  const [slug1, slug2] = slugs.split("-vs-");
  
  await connectToDatabase();
  const [rawP1, rawP2] = await Promise.all([
    Product.findOne({ slug: slug1 }).lean(),
    Product.findOne({ slug: slug2 }).lean()
  ]);

  if (!rawP1 || !rawP2) return notFound();

  const p1 = JSON.parse(JSON.stringify(rawP1));
  const p2 = JSON.parse(JSON.stringify(rawP2));

  // Determine Winner automatically based on overall rating
  const p1Wins = p1.rating >= p2.rating;
  const winner = p1Wins ? p1 : p2;
  const runnerUp = p1Wins ? p2 : p1;

  // Aggregate all specs from both products for a combined matrix
  const allSpecKeys = Array.from(new Set([
    ...(p1.specs ? Object.keys(p1.specs) : []),
    ...(p2.specs ? Object.keys(p2.specs) : [])
  ]));

  return (
    <div className="py-20 bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-black mb-10 transition-transform hover:-translate-x-1 text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Intelligence Node
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <RevealText as="h1" className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase premium-gradient">
            {p1.title} <span className="text-gray-600 block text-2xl my-2">VS</span> {p2.title}
          </RevealText>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">We pit these two titans against each other in our labs. Here is the definitive breakdown of which one deserves your money.</p>
        </div>

        {/* Head-to-Head Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
           {/* Product 1 */}
           <GlowCard spotlightColor={p1Wins ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.1)"} className={`p-8 text-center flex flex-col items-center ${p1Wins ? 'border-green-500/30 bg-green-900/5' : ''}`}>
              {p1Wins && (
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 font-black tracking-widest uppercase text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Winner
                </div>
              )}
              <div className="relative w-full h-64 mb-8 bg-white/5 rounded-2xl p-4">
                <Image src={p1.image} alt={p1.title} fill className="object-contain" />
              </div>
              <h2 className="text-2xl font-black mb-2">{p1.title}</h2>
              <div className="text-4xl font-black text-white mb-6 flex items-center gap-2">
                {p1.rating} <span className="text-sm text-gray-500 font-normal">/ 5</span>
              </div>
              <MagneticButton href={`/reviews/${p1.slug}`} className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs mb-3">
                Read Full Review
              </MagneticButton>
              <a href={p1.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-400 hover:text-primary-300 font-bold border-b border-primary-500/30">Check Best Price &rarr;</a>
           </GlowCard>

           {/* Product 2 */}
           <GlowCard spotlightColor={!p1Wins ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.1)"} className={`p-8 text-center flex flex-col items-center ${!p1Wins ? 'border-green-500/30 bg-green-900/5' : ''}`}>
              {!p1Wins && (
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 font-black tracking-widest uppercase text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Winner
                </div>
              )}
              <div className="relative w-full h-64 mb-8 bg-white/5 rounded-2xl p-4">
                <Image src={p2.image} alt={p2.title} fill className="object-contain" />
              </div>
              <h2 className="text-2xl font-black mb-2">{p2.title}</h2>
              <div className="text-4xl font-black text-white mb-6 flex items-center gap-2">
                {p2.rating} <span className="text-sm text-gray-500 font-normal">/ 5</span>
              </div>
              <MagneticButton href={`/reviews/${p2.slug}`} className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs mb-3">
                Read Full Review
              </MagneticButton>
              <a href={p2.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-400 hover:text-primary-300 font-bold border-b border-primary-500/30">Check Best Price &rarr;</a>
           </GlowCard>
        </div>

        {/* Final Verdict Section */}
        <div className="bg-gradient-to-br from-primary-900/40 to-black border border-primary-500/20 rounded-[2rem] p-10 mb-20 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <ShieldCheck className="w-16 h-16 text-primary-500 mx-auto mb-6" />
            <RevealText as="h3" className="text-3xl font-black text-white mb-4">Elite Verdict</RevealText>
            <p className="text-lg text-gray-300 font-light max-w-3xl mx-auto leading-relaxed relative z-10">
              While the <span className="text-white font-bold">{runnerUp.title}</span> is a fantastic piece of engineering, the <span className="text-primary-400 font-bold">{winner.title}</span> edges it out in our expert testing due to its superior overall score of {winner.rating}/5. If you're deciding between the two, go with the {winner.title}.
            </p>
        </div>

        {/* Full Specifications Matrix */}
        {allSpecKeys.length > 0 && (
          <div className="mb-20">
            <RevealText as="h3" className="text-2xl font-black mb-8 flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-400" /> Deep Spec Matrix
            </RevealText>
            <div className="bg-black/50 border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-4 font-black text-xs uppercase tracking-widest text-gray-500 border-b border-white/5">Specification</th>
                    <th className="p-4 font-black text-xs uppercase tracking-widest text-primary-400 border-b border-white/5 w-2/5">{p1.title}</th>
                    <th className="p-4 font-black text-xs uppercase tracking-widest text-primary-400 border-b border-white/5 w-2/5">{p2.title}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allSpecKeys.map(key => (
                    <tr key={key} className="hover:bg-white/2 transition-colors">
                      <td className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500 bg-white/2">{key}</td>
                      <td className="p-4 text-sm text-gray-300">{p1.specs?.[key] || <span className="text-gray-600">-</span>}</td>
                      <td className="p-4 text-sm text-gray-300">{p2.specs?.[key] || <span className="text-gray-600">-</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
