import { ArrowRight, Star, TrendingUp, Cpu, RefreshCcw, Sprout, Wallet, ShieldCheck, Users, Zap, Award, BarChart3, Globe, Smartphone } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Click from "@/models/Click";
import Image from "next/image";
import Link from "next/link";
import AffiliateButton from "@/components/AffiliateButton";
import TrustBanner from "@/components/TrustBanner";
import dynamic from "next/dynamic";

// Code-split heavy client components into separate lazy chunks
const AdSlot = dynamic(() => import("@/components/AdSlot"));
const NewsletterForm = dynamic(() => import("@/components/NewsletterForm"));
const PriceSlider = dynamic(() => import("@/components/PriceSlider"));
const ServicesSection = dynamic(() => import("@/components/ServicesSection"));

export const revalidate = 60;

import { getPlaceholder } from "@/lib/placeholders";

const getValidImage = (src) => src || getPlaceholder(800, 600);

export default async function Home() {
  let latestPosts = [];
  let topProducts = [];
  let allCategories = [];
  let productsByCategory = {};
  let stats = { posts: 0, products: 0, clicks: 0 };
  let spotlightProduct = null;
  let pricedProducts = [];
  let dbError = false;

  try {
    await connectToDatabase();
    console.log("[Home] Connected to database");

    // Use individual try-catch blocks or localized error handling to prevent one failure from hiding all posts
    const fetchPosts = Post.find({ isPublished: { $ne: false } }).sort({ createdAt: -1 }).limit(6).populate('category').lean()
      .catch(e => { console.error("[Home] Posts fetch error:", e); return []; });

    const fetchProducts = Product.find({ rating: { $gte: 4.8 } }).sort({ rating: -1 }).limit(4).lean()
      .catch(e => { console.error("[Home] Products fetch error:", e); return []; });

    const fetchCategories = Category.find().lean()
      .catch(e => { console.error("[Home] Categories fetch error:", e); return []; });

    const fetchTotalPosts = Post.countDocuments({ isPublished: { $ne: false } })
      .catch(e => { console.error("[Home] Count posts error:", e); return 0; });

    const fetchTotalProducts = Product.countDocuments()
      .catch(e => { console.error("[Home] Count products error:", e); return 0; });

    const fetchTotalClicks = Click.countDocuments()
      .catch(e => { console.error("[Home] Count clicks error:", e); return 0; });

    let [posts, products, categories, totalPosts, totalProducts, totalClicks] = await Promise.all([
      fetchPosts, fetchProducts, fetchCategories, fetchTotalPosts, fetchTotalProducts, fetchTotalClicks
    ]);

    posts = JSON.parse(JSON.stringify(posts));
    products = JSON.parse(JSON.stringify(products));
    categories = JSON.parse(JSON.stringify(categories));

    console.log(`[Home] Successfully fetched ${posts.length} posts and ${products.length} products`);

    stats = { posts: totalPosts, products: totalProducts, clicks: totalClicks };
    spotlightProduct = products[0] || null;
    latestPosts = posts;
    topProducts = products;

    // Filter categories for the Matchmaker (Product categories)
    const productCategories = categories.filter(c =>
      (Array.isArray(c.for) && c.for.includes('product')) ||
      c.for === 'product' ||
      !c.for
    );
    allCategories = productCategories;

    // Grouping products for the Matchmaker
    const allProducts = await Product.find().lean();
    productsByCategory = allProducts.reduce((acc, prod) => {
      const catId = prod.category.toString();
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(JSON.parse(JSON.stringify(prod)));
      return acc;
    }, {});

    allCategories = JSON.parse(JSON.stringify(allCategories));
    pricedProducts = allProducts.filter(p => p.price > 0).map(p => JSON.parse(JSON.stringify(p)));
  } catch (error) {
    console.error("[Home] Critical Database Error:", error);
    dbError = true;
  }

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white overflow-hidden">

      {/* Hero Section v3 - Editorial Style */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Asset */}
        <div className="absolute inset-0 z-0 animate-pulse duration-[8s] opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary-600/10 rounded-full blur-[130px] -mr-[450px] -mt-[450px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[130px] -ml-[350px] -mb-[350px] pointer-events-none"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 text-center lg:text-left reveal-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.25em] mb-8 shadow-glow">
              📰 Tech Reviews & Articles
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              Honest Product Reviews & <br />
              <span className="premium-gradient">In-Depth Tech Articles</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8 mx-auto lg:mx-0">
              We test the latest hardware and tech gadgets to bring you completely unbiased reviews, comparisons, and helpful articles to guide your buying decisions.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/blog" className="px-8 py-4 rounded-2xl bg-white text-black text-sm font-black transition-all hover:bg-gray-200 hover:scale-105 shadow-[0_10px_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2">
                View Articles <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/products" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-black transition-all hover:bg-white/10 hover:scale-105 flex items-center justify-center gap-2">
                Compare Products
              </Link>
            </div>
            
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-white/5 text-center lg:text-left max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-3xl font-black text-white">{stats.posts || 12}+</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1">Articles</p>
              </div>
              <div>
                <p className="text-3xl font-black text-cyan-400">50K+</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1">Weekly Readers</p>
              </div>
              <div>
                <p className="text-3xl font-black text-primary-400">{stats.products || 8}+</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1">Reviewed Products</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Featured Cover Story */}
          <div className="lg:col-span-6 reveal-fade relative">
            <div className="absolute -inset-10 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            {latestPosts[0] ? (
              <div className="relative group max-w-xl mx-auto lg:mx-0">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative bg-[#0d0d15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={getValidImage(latestPosts[0].featuredImage)}
                      alt={latestPosts[0].title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      quality={85}
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d15] via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600 border border-primary-500/20 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-glow">
                      Featured Cover Story
                    </span>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                      <span className="text-primary-400">{latestPosts[0].category?.name || "Editorial"}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                      <span>{new Date(latestPosts[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-black mb-4 leading-tight text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                      {latestPosts[0].title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-2 mb-6">
                      {latestPosts[0].summary || latestPosts[0].excerpt}
                    </p>
                    
                    <Link href={`/blog/${latestPosts[0].slug}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary-400 group-hover:text-white transition-colors">
                      Read Cover Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative bg-[#0d0d15] border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[350px] max-w-xl mx-auto lg:mx-0">
                <p className="text-gray-400">Welcome to EliteReviews. No articles have been published yet.</p>
                <Link href="/blog" className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                  Visit Article Archives
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Editorial Banner */}
      <section className="bg-gradient-to-r from-primary-900/10 via-dark-bg to-cyan-900/10 border-y border-white/5 py-8 px-4 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 shrink-0 text-center md:text-left">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Uncompromising Laboratory Testing Standards</span>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-base">🧪</span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Independent Testing Labs</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-base">🔬</span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Data-Driven Ratings</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-base">🛡️</span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">100% Sponsor-Free Reviews</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block h-10 w-px bg-white/10"></div>

          <div className="text-center md:text-right">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">No Bias. No Brand Deals. Just Facts.</h3>
            <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Built for the demanding tech enthusiast.</p>
          </div>
        </div>
      </section>

      {/* Price Navigation Feature */}
      <PriceSlider products={pricedProducts} />

      {/* Magazine Blog Feed - High Fidelity */}
      <section className="py-20 md:py-32 px-4 bg-[#07070a]/60 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-16 md:mb-20 reveal-up">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Latest Gear & Tech Intel</h2>
            <div className="flex-1 h-px bg-white/10"></div>
            <Link href="/blog" className="text-xs font-black uppercase tracking-widest text-primary-400 hover:text-white transition-colors shrink-0">
              View All Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            {/* Left Column: Big Featured (2nd latest post) */}
            {latestPosts[1] ? (
              <div className="lg:col-span-7 reveal-up">
                <Link href={`/blog/${latestPosts[1].slug}`} className="group block h-full">
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden border border-white/10 mb-6 md:mb-8 shadow-2xl">
                    <Image
                      src={getValidImage(latestPosts[1].featuredImage)}
                      alt={latestPosts[1].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      quality={80}
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/95 via-dark-bg/25 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                      <span className="px-3 py-1 bg-cyan-600 border border-cyan-500/20 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-xl">Recent Release</span>
                      <h3 className="text-2xl md:text-3xl font-black mt-4 leading-tight group-hover:text-primary-400 transition-colors line-clamp-2">{latestPosts[1].title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
                    <span className="text-primary-400">{latestPosts[1].category?.name}</span>
                    <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                    <span>{new Date(latestPosts[1].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </Link>
              </div>
            ) : latestPosts[0] ? (
              <div className="lg:col-span-7 reveal-up">
                <Link href={`/blog/${latestPosts[0].slug}`} className="group block h-full">
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden border border-white/10 mb-6 md:mb-8 shadow-2xl">
                    <Image
                      src={getValidImage(latestPosts[0].featuredImage)}
                      alt={latestPosts[0].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      quality={80}
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/95 via-dark-bg/25 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                      <span className="px-3 py-1 bg-cyan-600 border border-cyan-500/20 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-xl">Recent Release</span>
                      <h3 className="text-2xl md:text-3xl font-black mt-4 leading-tight group-hover:text-primary-400 transition-colors line-clamp-2">{latestPosts[0].title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
                    <span className="text-primary-400">{latestPosts[0].category?.name}</span>
                    <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                    <span>{new Date(latestPosts[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="lg:col-span-7 bg-[#0b0b12] rounded-3xl border border-white/5 p-12 text-center flex items-center justify-center min-h-[300px]">
                <p className="text-gray-500">Stay tuned for upcoming editorial reports!</p>
              </div>
            )}

            {/* Right Column: Mini Feed of rest of the posts */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4 md:gap-6">
              {latestPosts.length > 2 ? (
                latestPosts.slice(2, 5).map((post, i) => (
                  <Link
                    key={post._id.toString()}
                    href={`/blog/${post.slug}`}
                    className="group bg-[#0b0b12] rounded-2xl border border-white/5 p-3 flex gap-4 items-center hover:border-primary-500/30 overflow-hidden hover:shadow-[0_10px_40px_rgba(59,130,246,0.08)] transition-all duration-500 hover:-translate-y-0.5 relative animate-fade-in"
                    style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#050508] shrink-0 border border-white/5 z-10">
                      <Image src={getValidImage(post.featuredImage)} alt={post.title} fill sizes="80px" quality={70} className="object-cover transition-transform group-hover:scale-105 duration-500" />
                    </div>
                    <div className="flex-1 py-1 relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-primary-400 font-black text-[8px] uppercase tracking-[0.2em]">{post.category?.name}</span>
                      </div>
                      <h4 className="text-sm md:text-base font-black leading-snug group-hover:text-white text-gray-200 transition-colors line-clamp-2">{post.title}</h4>
                      <div className="flex items-center gap-1 mt-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>Read Intel Report</span>
                        <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 group-hover:text-primary-400 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : latestPosts.length > 1 ? (
                latestPosts.slice(0, 1).map((post, i) => (
                  <Link
                    key={post._id.toString()}
                    href={`/blog/${post.slug}`}
                    className="group bg-[#0b0b12] rounded-2xl border border-white/5 p-3 flex gap-4 items-center hover:border-primary-500/30 overflow-hidden hover:shadow-[0_10px_40px_rgba(59,130,246,0.08)] transition-all duration-500 hover:-translate-y-0.5 relative"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#050508] shrink-0 border border-white/5 z-10">
                      <Image src={getValidImage(post.featuredImage)} alt={post.title} fill sizes="80px" quality={70} className="object-cover transition-transform group-hover:scale-105 duration-500" />
                    </div>
                    <div className="flex-1 py-1 relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-primary-400 font-black text-[8px] uppercase tracking-[0.2em]">{post.category?.name}</span>
                      </div>
                      <h4 className="text-sm md:text-base font-black leading-snug group-hover:text-white text-gray-200 transition-colors line-clamp-2">{post.title}</h4>
                      <div className="flex items-center gap-1 mt-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>Read Intel Report</span>
                        <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 group-hover:text-primary-400 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : null}

              {/* Archive Box */}
              <div className="p-6 rounded-2xl bg-premium-mesh border border-white/5 mt-auto relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="relative z-10">
                  <h4 className="text-sm font-black mb-1 text-white">Looking for something specific?</h4>
                  <p className="text-xs text-gray-400 mb-4 font-light leading-relaxed">Search through our full catalog of articles, guides, and comparison reviews.</p>
                  <Link href="/blog" className="flex items-center gap-2 text-white font-black text-[9px] uppercase tracking-[0.2em] group w-max">
                    Browse Article Archives <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Control - Explaining Purpose */}
      <section className="py-20 md:py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Reviews",
                desc: "In-depth technical analysis and real-world testing of the latest tech and gear.",
                icon: Zap,
                color: "text-primary-500"
              },
              {
                title: "Product Comparison",
                desc: "Side-by-side technical breakdowns to help you choose between flagship contenders.",
                icon: BarChart3,
                color: "text-cyan-500"
              },
              {
                title: "Buyer Guides",
                desc: "Curated lists of the best products in every category, updated for 2026 standards.",
                icon: Award,
                color: "text-yellow-500"
              }
            ].map((item, idx) => (
              <div key={idx} className="glass-premium p-8 rounded-[2rem] border-white/5 hover:border-primary-500/30 transition-all group reveal-up" style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-4">{item.title}</h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Header */}
      <div className="py-10 bg-dark-bg/30 border-y border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 reveal-up">
          <TrustBanner />
        </div>
      </div>

      {/* Global Ad Placement */}
      <div className="max-w-7xl mx-auto px-4 -my-4 relative z-20 reveal-up">
        <AdSlot className="max-w-4xl mx-auto" responsive={false} />
      </div>

      {/* Battle of the Flagships - Visual Comparison Tease */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 md:mb-24 reveal-up">
            <span className="text-primary-500 font-black uppercase text-[10px] md:text-xs tracking-[0.3em] mb-4">Elite Comparisons</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Battle of the <span className="premium-gradient">Flagships</span></h2>
            <p className="text-gray-500 text-sm md:text-lg max-w-xl font-light">We put the top-tier contenders through 100+ hours of technical analysis.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl reveal-up">
            {topProducts.slice(0, 2).map((prod, idx) => (
              <div key={prod._id} className="bg-[#050508] p-8 md:p-16 relative group transition-all duration-700 hover:bg-[#08080c]">
                <div className={`absolute top-10 ${idx === 0 ? 'right-10' : 'left-10'} text-[60px] md:text-[100px] font-black text-white/5 select-none`}>
                  0{idx + 1}
                </div>

                <div className="relative aspect-square w-48 md:w-64 mx-auto mb-10 md:mb-16">
                  <div className="absolute inset-0 bg-primary-600/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <Image
                    src={getValidImage(prod.image)}
                    alt={prod.title}
                    fill
                    sizes="300px"
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 z-10"
                  />
                </div>

                <div className="relative z-10 text-center lg:text-left">
                  <h3 className="text-2xl md:text-4xl font-black mb-6 group-hover:text-primary-400 transition-colors uppercase tracking-tighter">{prod.title}</h3>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                    {["Performance", "Value", "Innovation"].map((tag) => (
                      <div key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                        {tag}: <span className="text-white">{prod.scores?.[tag.toLowerCase()] || '94'}%</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/reviews/${prod.slug}`} className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-primary-500 hover:text-white transition-all group/btn">
                    Review Intel <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}

            {/* VS Circle Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 bg-dark-bg border-4 border-white/10 rounded-full z-20 hidden lg:flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">
              <span className="text-2xl md:text-3xl font-black text-primary-500 italic">VS</span>
            </div>
          </div>

          <div className="mt-12 text-center reveal-up">
            <Link href="/comparison" className="px-10 py-5 rounded-2xl glass-premium text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all inline-flex items-center gap-4">
              Launch Comparison Studio <RefreshCcw className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Picks: Detailed Grid */}
      <section className="py-20 md:py-32 px-4 bg-[#0a0a0f] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-baseline justify-between mb-12 md:mb-20 gap-6 md:gap-4 reveal-up text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center justify-center md:justify-start gap-4">
              <Star className="text-yellow-500 fill-yellow-500 w-6 h-6 md:w-8 md:h-8" /> Best of 2026
            </h2>
            <Link href="/comparison" className="px-6 py-4 md:px-8 md:py-3 w-full md:w-auto text-center rounded-[1rem] md:rounded-2xl glass-premium text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Full Comparison Studio
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {topProducts.map((prod, idx) => (
              <div
                key={prod._id.toString()}
                className="group bg-[#0d0d12] rounded-[2.5rem] p-4 border border-white/5 hover:border-primary-500/30 transition-all duration-500 reveal-up hover-lift shadow-premium"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className="relative aspect-square bg-white rounded-[2rem] overflow-hidden mb-8 shadow-inner flex items-center justify-center p-8">
                  <Image src={getValidImage(prod.image)} alt={prod.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px" quality={80} className="object-contain p-6 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-lg">
                    ₹{prod.price?.toLocaleString() || '---'}
                  </div>
                  <div className="absolute top-4 right-4 bg-dark-bg/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                    High Rank
                  </div>
                </div>

                <div className="px-4 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Verified Score</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black">{prod.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-black mb-8 line-clamp-1 leading-tight group-hover:text-primary-400 transition-colors">
                    {prod.title}
                  </h3>
                  <div className="space-y-3">
                    <AffiliateButton url={prod.affiliateLink} text="Secure Price" className="w-full py-3.5 text-xs font-black rounded-xl" />
                    <Link href="/comparison" className="w-full py-3 px-4 rounded-xl border border-white/5 hover:bg-white/5 text-[9px] font-black text-gray-500 flex items-center justify-center gap-2 uppercase tracking-[0.2em] transition-all">
                      Deep Compare
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Newsletter Premium - High Impact */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600/5 blur-[120px] rounded-full translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto glass-premium rounded-[3rem] md:rounded-[4rem] border border-white/10 p-8 md:p-20 relative z-10 overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary-500/20 transition-colors"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Zap className="w-3.5 h-3.5" /> Intelligence Network
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">Elite Tech Articles. <br /><span className="premium-gradient">Delivered Weekly.</span></h2>
              <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">Join 50,000+ tech enthusiasts receiving our un-hyped tech reviews and deal alerts directly in their inbox.</p>
            </div>
            <div className="reveal-up">
              <NewsletterForm />
              <div className="mt-8 flex flex-wrap gap-6 items-center justify-center lg:justify-start">
                {[
                  { label: "No Spam", icon: ShieldCheck },
                  { label: "Elite Deals", icon: TrendingUp },
                  { label: "Tech Vault", icon: Cpu }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <item.icon className="w-3.5 h-3.5 text-primary-500" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
