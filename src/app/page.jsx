import { ArrowRight, Star, TrendingUp, Cpu, Dumbbell, Sprout, Wallet, ShieldCheck, Users, Zap, Award, BarChart3, Globe, Smartphone } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Click from "@/models/Click";
import Image from "next/image";
import Link from "next/link";
import AffiliateButton from "@/components/AffiliateButton";
import TrustBanner from "@/components/TrustBanner";
import AdSlot from "@/components/AdSlot";

export const revalidate = 60;

const getValidImage = (src) => src || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default async function Home() {
  let latestPosts = [];
  let topProducts = [];
  let allCategories = [];
  let stats = { posts: 0, products: 0, clicks: 0 };
  let spotlightProduct = null;
  let dbError = false;

  try {
    await connectToDatabase();
    
    let [posts, products, categories, totalPosts, totalProducts, totalClicks] = await Promise.all([
      Post.find({ isPublished: true }).sort({ createdAt: -1 }).limit(3).populate('category').lean(),
      Product.find({ rating: { $gte: 4.8 } }).sort({ rating: -1 }).limit(4).lean(),
      Category.find({}).lean(),
      Post.countDocuments({ isPublished: true }),
      Product.countDocuments(),
      Click.countDocuments()
    ]);

    posts = JSON.parse(JSON.stringify(posts));
    products = JSON.parse(JSON.stringify(products));
    categories = JSON.parse(JSON.stringify(categories));

    latestPosts = posts;
    topProducts = products;
    
    allCategories = await Promise.all(categories.map(async (cat) => {
      const count = await Post.countDocuments({ category: cat._id, isPublished: true });
      return { ...cat, count };
    }));

    stats = { posts: totalPosts, products: totalProducts, clicks: totalClicks };
    spotlightProduct = products[0]; 
  } catch (error) {
    dbError = true;
  }

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white overflow-hidden bg-premium-mesh">
      {/* Hero Section v3 - Ultra Detailed */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Asset */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/hero_banner.png" 
            alt="Hero" 
            fill 
            className="object-cover opacity-20 mix-blend-screen scale-110 blur-[2px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/40 via-dark-bg/80 to-dark-bg"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Hero Left Content */}
          <div className="text-center lg:text-left reveal-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              2026 Editorial Edition
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] md:leading-[0.9] lg:max-w-xl">
              Buy Less. <br />
              <span className="premium-gradient">Buy Better.</span>
            </h1>
            
            <p className="text-base sm:text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 mb-10 md:mb-12 leading-relaxed font-light">
              We separate the high-performance gear from the hype. Technical analysis and real-world testing for the elite consumer.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-5 mb-12 md:mb-16">
              <Link href="/blog" className="px-6 py-4 md:px-10 md:py-5 rounded-2xl bg-white text-black text-sm md:text-base font-black transition-all hover:bg-gray-200 hover:scale-105 shadow-2xl flex items-center justify-center gap-3 group w-full sm:w-auto">
                Access The Vault <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/comparison" className="px-6 py-4 md:px-10 md:py-5 rounded-2xl glass-premium text-white text-sm md:text-base font-bold transition-all hover:bg-white/10 flex items-center justify-center gap-3 w-full sm:w-auto">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5" /> Compare Gear
              </Link>
            </div>

            {/* Stats Bar with Details */}
            <div className="grid grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-10 border-t border-white/5 max-w-lg mx-auto lg:mx-0">
               <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-black text-white leading-none">{stats.posts}+</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest">Post Guides</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-black text-white leading-none">{stats.products}</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest">Lab Tests</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-black text-white leading-none">99.9%</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest">Objectivity</span>
               </div>
            </div>
          </div>

          {/* Hero Right: Spotlight Spotlight */}
          {spotlightProduct && (
            <div className="hidden lg:block reveal-fade">
              <div className="relative group">
                {/* Product Glow Layer */}
                <div className="absolute -inset-20 bg-primary-600/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="relative glass-premium p-10 rounded-[3rem] border-white/20 hover:scale-[1.02] transition-transform duration-500">
                   <div className="absolute -top-5 -right-5 bg-gradient-to-br from-yellow-400 to-orange-600 text-black px-5 py-2.5 rounded-2xl font-black text-[11px] shadow-2xl z-20 flex items-center gap-2 ring-8 ring-dark-bg uppercase tracking-tighter">
                     <Award className="w-4 h-4" /> Best in Class
                   </div>
                   
                   <div className="relative aspect-square w-full bg-white rounded-[2rem] mb-10 p-12 overflow-hidden shadow-inner flex items-center justify-center">
                      <Image 
                        src={getValidImage(spotlightProduct.image)} 
                        alt={spotlightProduct.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-100/50 to-transparent"></div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <div className="flex">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`w-3.5 h-3.5 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                           ))}
                         </div>
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Expert Rating</span>
                      </div>
                      <h2 className="text-3xl font-black mb-6">{spotlightProduct.title}</h2>
                      <AffiliateButton url={spotlightProduct.affiliateLink} text="Check Exclusive Deal" className="w-full py-5 text-base font-black rounded-2xl" />
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust Header */}
      <div className="py-20 bg-dark-bg/50 border-y border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 reveal-up">
           <TrustBanner />
        </div>
      </div>

      {/* Bento Grid Category Section */}
      <section className="py-20 md:py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20 reveal-up">
             <span className="text-primary-500 font-black uppercase text-[10px] md:text-xs tracking-[0.3em] mb-3 md:mb-4 block">Categories</span>
             <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Discovery Engine</h2>
             <p className="text-gray-500 text-sm md:text-lg max-w-xl mx-auto font-light leading-relaxed">Select your domain and find the highest-performing gear curated by experts.</p>
          </div>

          {/* Uniform Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {allCategories.map((cat, idx) => {
               let Icon = Cpu;
               if (cat.name.toLowerCase().includes('fit')) Icon = Dumbbell;
               if (cat.name.toLowerCase().includes('farm') || cat.name.toLowerCase().includes('plant')) Icon = Sprout;
               if (cat.name.toLowerCase().includes('pay') || cat.name.toLowerCase().includes('money')) Icon = Wallet;
               if (cat.name.toLowerCase().includes('tech')) Icon = Smartphone;
               
               return (
                 <Link 
                   key={cat._id.toString()} 
                   href={`/category/${cat.slug}`} 
                   className="group relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-[#0d0d12] border border-white/5 hover:border-primary-500/50 transition-all duration-500 reveal-up hover-lift aspect-square flex flex-col justify-end"
                   style={{ transitionDelay: `${idx * 100}ms` }}
                 >
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700">
                       <Icon className="w-16 h-16 md:w-32 md:h-32" />
                    </div>

                    <div className="relative p-5 md:p-10 flex flex-col justify-between h-full z-10">
                       <div className="bg-white/5 p-2.5 md:p-4 rounded-xl md:rounded-2xl w-fit group-hover:bg-primary-600 transition-colors shrink-0">
                          <Icon className="w-4 h-4 md:w-7 md:h-7" />
                       </div>
                       <div className="mt-auto">
                          <h3 className="text-sm md:text-2xl font-black leading-tight">{cat.name}</h3>
                          <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1 md:mt-2 group-hover:text-primary-400 transition-colors line-clamp-1">
                            {cat.count || 0} Professional Guides
                          </p>
                       </div>
                    </div>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </Link>
               )
            })}
          </div>
        </div>
      </section>

      {/* Global Ad Placement */}
      <div className="max-w-7xl mx-auto px-4 -my-4 relative z-20 reveal-up">
         <AdSlot className="max-w-4xl mx-auto" responsive={false} />
      </div>

      {/* Magazine Blog Feed - High Fidelity */}
      <section className="py-20 md:py-32 px-4 bg-dark-bg/80 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-16 md:mb-20 reveal-up">
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Latest Dispatch</h2>
             <div className="flex-1 h-px bg-white/5"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
             {/* Left Column: Big Featured */}
             {latestPosts[0] && (
               <div className="lg:col-span-7 reveal-up">
                 <Link href={`/blog/${latestPosts[0].slug}`} className="group block h-full">
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-white/5 mb-6 md:mb-10 shadow-2xl">
                       <Image 
                         src={getValidImage(latestPosts[0].featuredImage)} 
                         alt={latestPosts[0].title} 
                         fill 
                         sizes="(max-width: 1024px) 100vw, 60vw"
                         className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/20 to-transparent"></div>
                       <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                          <span className="px-3 md:px-4 py-1.5 md:py-2 bg-primary-600 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl">Featured Report</span>
                          <h3 className="text-2xl md:text-4xl font-black mt-4 md:mt-6 leading-tight group-hover:text-primary-400 transition-colors line-clamp-3">{latestPosts[0].title}</h3>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest px-2 md:px-4">
                       <span className="text-primary-500">{latestPosts[0].category?.name}</span>
                       <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-gray-800 rounded-full"></span>
                       <span>8 Min Read</span>
                    </div>
                 </Link>
               </div>
             )}

             {/* Right Column: Mini Feed */}
             <div className="lg:col-span-5 flex flex-col justify-between gap-4 md:gap-6">
                {latestPosts.slice(1).map((post, i) => (
                  <Link 
                    key={post._id.toString()} 
                    href={`/blog/${post.slug}`} 
                    className="group bg-[#0b0b12] rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 p-3 md:p-4 flex gap-4 md:gap-6 items-center hover:border-primary-500/30 overflow-hidden hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] transition-all duration-500 hover:-translate-y-1 relative"
                    style={{ transitionDelay: `${(i+1)*100}ms` }}
                  >
                     {/* Hover glow inside card */}
                     <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                     <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden bg-[#050508] shrink-0 border border-white/5 z-10 shadow-inner">
                        <Image src={getValidImage(post.featuredImage)} alt={post.title} fill sizes="128px" className="object-cover transition-transform group-hover:scale-110 duration-700" />
                     </div>
                     <div className="flex-1 py-1 md:py-2 relative z-10">
                        <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                           <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-primary-500"></span>
                           <span className="text-primary-400 font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em]">{post.category?.name}</span>
                        </div>
                        <h4 className="text-base md:text-xl font-black leading-snug group-hover:text-white text-gray-200 transition-colors line-clamp-2">{post.title}</h4>
                        <div className="flex items-center gap-1 md:gap-2 mt-2 md:mt-4 text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                           <span>Read Report</span>
                           <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:translate-x-1 group-hover:text-primary-400 transition-all" />
                        </div>
                     </div>
                  </Link>
                ))}
                
                {/* CTA Card */}
                <div className="p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] bg-premium-mesh border border-white/10 mt-6 md:mt-auto relative overflow-hidden group hover:border-white/20 transition-all">
                   <div className="relative z-10">
                      <h5 className="text-lg md:text-xl font-black mb-1 md:mb-2 text-white">Want to see more?</h5>
                      <p className="text-xs md:text-sm text-gray-400 mb-6 md:mb-8 font-light leading-relaxed">Join the inner circle. Access our full historical archive of deep-dive tech reports.</p>
                      <Link href="/blog" className="flex items-center gap-2 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] group w-max">
                         Browse Archive <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors"></div>
                </div>
             </div>
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
                  <Image src={getValidImage(prod.image)} alt={prod.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-contain p-6 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
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

      {/* Ultra-Premium Newsletter Breakout */}
      <section className="relative py-20 md:py-40 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-premium-mesh opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600 opacity-20 rounded-full blur-[150px] animate-pulse"></div>

        <div className="max-w-4xl mx-auto relative z-10 reveal-up">
          <div className="bg-[#050505]/40 backdrop-blur-[40px] border border-white/10 p-8 md:p-24 rounded-[3rem] md:rounded-[4rem] text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tighter leading-[1.1] md:leading-[0.9]">Gear <br className="md:hidden" /><span className="premium-gradient">Elevated.</span></h2>
            <p className="text-base md:text-xl text-gray-400 mb-8 md:mb-12 max-w-lg mx-auto font-light leading-relaxed">
              We send the elite tech insights you actually need once a week. Join the club of 50k+ enthusiasts.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto bg-black/40 p-2 rounded-[1.5rem] md:rounded-[2rem] border border-white/5">
              <input 
                type="email" 
                placeholder="reader@elite.com" 
                className="flex-1 px-6 py-4 md:px-8 md:py-5 rounded-xl md:rounded-2xl bg-transparent focus:outline-none text-base md:text-lg font-light placeholder:text-gray-700 text-center md:text-left" 
                required
              />
              <button type="submit" className="px-6 py-4 md:px-10 md:py-5 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-xl md:rounded-[1.5rem] transition-all shadow-glow transform active:scale-95 text-sm md:text-base tracking-[0.1em]">
                Join Today
              </button>
            </form>
            <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-4 md:gap-6 opacity-40 md:opacity-30">
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">No Ads</span>
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden sm:inline">Expert Advice</span>
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Secure Privacy</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
