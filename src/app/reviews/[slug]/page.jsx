import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import { Check, X, Star, Award, TrendingUp, Zap, Layers, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const FaqSection = dynamic(() => import("@/components/FaqSection"));
const TrustRadar = dynamic(() => import("@/components/TrustRadar"));
const StickyBuyBar = dynamic(() => import("@/components/StickyBuyBar"));
const HelpfulVote = dynamic(() => import("@/components/HelpfulVote"));
const CommunityReview = dynamic(() => import("@/components/CommunityReview"));
const MagneticButton = dynamic(() => import("@/components/MagneticButton"));
const RevealText = dynamic(() => import("@/components/RevealText"));
const GlowCard = dynamic(() => import("@/components/GlowCard"));
const WatchlistButton = dynamic(() => import("@/components/WatchlistButton"));

export const revalidate = 3600;

// Badge config
const BADGES = {
  editor_choice: { label: "Editor's Choice", icon: Award, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", glow: "rgba(234, 179, 8, 0.15)" },
  best_value: { label: "Best Value", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", glow: "rgba(34, 197, 94, 0.15)" },
  top_rated: { label: "Top Rated", icon: Star, color: "text-primary-400", bg: "bg-primary-500/10 border-primary-500/30", glow: "rgba(59, 130, 246, 0.15)" },
  budget_pick: { label: "Budget Pick", icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30", glow: "rgba(6, 182, 212, 0.15)" },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectToDatabase();
  const product = await Product.findOne({ slug }).lean();
  if (!product) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elitereviews.in';
  const url = `${siteUrl}/reviews/${slug}`;

  return {
    title: `Review: ${product.title} | EliteReviews`,
    description: product.description || `Comprehensive review and expert analysis for ${product.title}. Rated ${product.rating}/5.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${product.title} — Expert Review`,
      description: `Rated ${product.rating}/5 stars by our experts.`,
      images: [product.image],
    },
  };
}

export async function generateStaticParams() {
  await connectToDatabase();
  const products = await Product.find().select('slug').lean();
  return products.map((prod) => ({
    slug: prod.slug,
  }));
}

export default async function ProductReview({ params }) {
  const { slug } = await params;

  await connectToDatabase();
  const rawProduct = await Product.findOne({ slug }).populate("category").lean();
  if (!rawProduct) return notFound();

  const product = JSON.parse(JSON.stringify(rawProduct));

  // Fetch related products from the same category
  const rawRelated = await Product.find({
    category: rawProduct.category,
    _id: { $ne: rawProduct._id },
  }).sort({ rating: -1 }).limit(4).lean();
  const related = JSON.parse(JSON.stringify(rawRelated));

  // Enriched JSON-LD product schema with nested Review and Pros/Cons notes for Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image,
    description: product.description || `Expert review of ${product.title}`,
    brand: { "@type": "Brand", name: "EliteReviews" },
    sku: product._id?.toString() || slug,
    mpn: product._id?.toString() || slug,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      bestRating: "5",
      worstRating: "0",
      reviewCount: (product.helpful?.yes || 0) + (product.helpful?.no || 0) + 1,
    },
    review: {
      "@type": "Review",
      "reviewBody": product.description || `Expert review and testing of ${product.title}.`,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": product.rating,
        "bestRating": "5",
        "worstRating": "0"
      },
      "author": {
        "@type": "Person",
        "name": "EliteReviews Gear Experts"
      },
      "publisher": {
        "@type": "Organization",
        "name": "EliteReviews"
      },
      "positiveNotes": product.pros && product.pros.length > 0 ? {
        "@type": "ItemList",
        "itemListElement": product.pros.map((pro, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": pro
        }))
      } : undefined,
      "negativeNotes": product.cons && product.cons.length > 0 ? {
        "@type": "ItemList",
        "itemListElement": product.cons.map((con, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": con
        }))
      } : undefined
    },
    offers: product.affiliateLink
      ? {
        "@type": "Offer",
        url: product.affiliateLink,
        price: product.price ? product.price.toString() : "99.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition"
      }
      : undefined,
  };

  const badge = product.badge ? BADGES[product.badge] : null;

  return (
    <div className="py-20 bg-dark-bg min-h-screen bg-premium-mesh overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 mb-10 w-full max-w-5xl mx-auto">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-white transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-400">{product.title}</span>
        </nav>

        {/* BENTO BOX GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[minmax(180px,_auto)] mb-20 max-w-7xl mx-auto">

          {/* Bento Box 1: Product Image (Spans 2 columns, 2 rows) */}
          <GlowCard spotlightColor={badge ? badge.glow : "rgba(59, 130, 246, 0.15)"} className="md:col-span-2 xl:col-span-2 md:row-span-2 p-8 flex items-center justify-center group bg-white/2">
            {badge && (
              <div className={`absolute top-6 left-6 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${badge.bg} ${badge.color}`}>
                <badge.icon className="w-3 h-3" />
                {badge.label}
              </div>
            )}
            <div className="relative w-full h-[300px] md:h-full min-h-[300px]">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                priority
                fetchPriority="high"
              />
            </div>
          </GlowCard>

          {/* Bento Box 2: Title, Description, & CTA (Spans across mapping) */}
          <GlowCard className="md:col-span-2 lg:col-span-1 xl:col-span-2 p-8 flex flex-col justify-center bg-[#0d0d14]">
            <RevealText as="h1" className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tighter leading-none premium-gradient">
              {product.title}
            </RevealText>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-600"}`} />
                ))}
              </div>
              <span className="text-white font-black text-xl">{product.rating}</span>
            </div>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light mb-8 max-w-lg">
              {product.description || `Based on our in-depth tests, the ${product.title} remains a compelling choice. Review the expert breakdown below before making your purchase decision.`}
            </p>

            <div className="flex items-center gap-3 mt-auto w-full">
              <MagneticButton
                href={product.links?.[0]?.url || product.affiliateLink}
                target="_blank"
                className="px-8 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-colors shadow-glow text-center flex-1 w-full"
              >
                Check Best Price
              </MagneticButton>
              <div className="shrink-0">
                <WatchlistButton product={product} />
              </div>
            </div>
          </GlowCard>

          {/* Bento Box 3: Trust Radar Visualized */}
          <GlowCard className="md:col-span-1 lg:col-span-1 xl:col-span-1 p-6 flex flex-col items-center justify-center bg-black/50">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary-500 w-full text-center mb-0">Intel Map</h3>
            <div className="scale-75 origin-top -mt-4 -mb-10 pointer-events-none">
              <TrustRadar scores={product.scores} />
            </div>
          </GlowCard>

          {/* Bento Box 4: Score Metrics Grid */}
          <GlowCard className="md:col-span-1 lg:col-span-2 xl:col-span-1 p-6 bg-white/2">
            <div className="grid grid-cols-2 gap-3 w-full h-full">
              {[
                { label: "Performance", val: product.scores?.performance, color: "#60a5fa" },
                { label: "Value", val: product.scores?.value, color: "#34d399" },
                { label: "Build Quality", val: product.scores?.build, color: "#a78bfa" },
                { label: "Features", val: product.scores?.features, color: "#f59e0b" },
              ].map((s) => (
                <div key={s.label} className="bg-black/40 rounded-2xl border border-white/5 p-4 flex flex-col justify-center text-center group hover:border-white/20 transition-colors">
                  <div className="text-xl sm:text-2xl font-black mb-1 transition-transform group-hover:scale-110" style={{ color: s.color }}>{s.val}%</div>
                  <div className="text-[8px] text-gray-500 uppercase tracking-widest font-black leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Bento Box 5: Pros */}
          <GlowCard className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2 p-8 bg-green-900/10 border-green-500/20">
            <h3 className="font-black text-green-400 flex items-center gap-2 mb-6 text-sm uppercase tracking-widest">
              <Check className="w-5 h-5 bg-green-500/20 rounded-full p-0.5" /> What We Love
            </h3>
            <ul className="space-y-4">
              {product.pros?.map((pro, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <span className="leading-relaxed">{pro}</span>
                </li>
              ))}
              {(!product.pros || product.pros.length === 0) && (
                <li className="text-sm text-gray-500 italic">No pros listed.</li>
              )}
            </ul>
          </GlowCard>

          {/* Bento Box 6: Cons */}
          <GlowCard className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 p-8 bg-red-900/10 border-red-500/20">
            <h3 className="font-black text-red-400 flex items-center gap-2 mb-6 text-sm uppercase tracking-widest">
              <AlertTriangle className="w-5 h-5 bg-red-500/20 rounded-full p-0.5" /> Watch Out For
            </h3>
            <ul className="space-y-4">
              {product.cons?.map((con, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                  <span className="leading-relaxed">{con}</span>
                </li>
              ))}
              {(!product.cons || product.cons.length === 0) && (
                <li className="text-sm text-gray-500 italic">No cons listed.</li>
              )}
            </ul>
          </GlowCard>

          {/* Bento Box 7: Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <GlowCard className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 p-0 bg-[#0a0a0f] overflow-hidden hidden md:block">
              <div className="flex items-center gap-3 p-6 border-b border-white/5 bg-white/2">
                <Layers className="w-5 h-5 text-primary-500" />
                <h3 className="font-black text-sm uppercase tracking-widest text-white">Full Specifications Engine</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px bg-white/5">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="bg-[#0a0a0f] p-6 hover:bg-white/2 transition-colors">
                    <div className="font-black text-[10px] text-primary-500 uppercase tracking-widest mb-2">{key}</div>
                    <div className="text-sm text-gray-300 leading-snug">{value}</div>
                  </div>
                ))}
              </div>
            </GlowCard>
          )}
        </div>

        {/* Existing Sections Below the Bento Fold */}
        <div className="max-w-4xl mx-auto">
          {/* FAQ Section with Reveal Typography */}
          <RevealText as="h2" className="text-3xl font-black mb-4">Frequently Asked Questions</RevealText>
          <FaqSection faqs={product.faqs} productTitle={product.title} />

          {/* Helpful Vote */}
          <HelpfulVote
            productId={product._id}
            initialYes={product.helpful?.yes || 0}
            initialNo={product.helpful?.no || 0}
          />

          {/* User Generated Content (Community Reviews) */}
          <CommunityReview productId={product._id} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-32 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-black tracking-tighter text-white">Related Gear</h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((rel) => (
                <GlowCard key={rel._id} spotlightColor="rgba(255,255,255,0.1)">
                  <Link
                    href={`/reviews/${rel.slug}`}
                    className="group block p-6 h-full transition-all"
                  >
                    <div className="relative aspect-square w-full bg-white rounded-2xl mb-6 overflow-hidden">
                      <Image
                        src={rel.image}
                        alt={rel.title}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-sm font-black text-white line-clamp-2 leading-snug mb-3 group-hover:text-primary-400 transition-colors">{rel.title}</h3>
                    <div className="flex items-center gap-1.5 text-yellow-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[11px] font-black">{rel.rating}</span>
                    </div>
                  </Link>
                </GlowCard>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Buy Bar */}
      <StickyBuyBar product={product} />
    </div>
  );
}
