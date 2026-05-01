import { ArrowRight, Monitor, MousePointerClick, TrendingUp, Target, Code2, Zap, CheckCircle2, ShieldCheck, BarChart3, Users, Award } from "lucide-react";
import Link from "next/link";
import TrustBanner from "@/components/TrustBanner";

export const metadata = {
  title: "Expert Web Design & Google Ads Management | Elite Digital",
  description: "Scale your business with high-performance web design and precision-targeted Google Ads campaigns from an industry expert.",
};

export default function ServicesPage() {
  const phoneNumber = "+919014386620";
  const defaultMessage = encodeURIComponent("Hi, I want to scale my business. I'm interested in your expert Web Design and Google Ads services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white overflow-hidden bg-premium-mesh">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[80vh] flex flex-col justify-center">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[120px] -mr-[400px] -mt-[400px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -ml-[300px] -mb-[300px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-glow">
            <Award className="w-4 h-4" /> Proven Digital Growth Partner
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] md:leading-[0.95]">
            Scale Your Brand. <br />
            <span className="premium-gradient">Dominate Your Market.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Stop losing customers to slow websites and wasted ad spend. Partner with an expert to build <span className="text-white font-medium">high-performance funnels</span> and <span className="text-white font-medium">hyper-targeted Google Ads</span> that guarantee ROI.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-5 rounded-2xl bg-white text-black text-sm md:text-base font-black transition-all hover:bg-gray-200 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3"
            >
              Start Getting Clients Now <TrendingUp className="w-5 h-5" />
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/10 max-w-4xl mx-auto">
            {[
              { value: "150+", label: "Websites Built" },
              { value: "3.5x", label: "Average Ad ROI" },
              { value: "99.9%", label: "Uptime Guaranteed" },
              { value: "24/7", label: "Expert Support" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-black text-white">{stat.value}</span>
                <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <div className="bg-white/5 border-y border-white/10 py-8 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Trusted by Industry Leaders</p>
          <TrustBanner />
        </div>
      </div>

      {/* Expertise 1: Web Design */}
      <section className="py-24 md:py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative group reveal-up">
              <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full group-hover:bg-cyan-500/30 transition-colors duration-700 pointer-events-none"></div>
              <div className="relative glass-premium p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-[#0a0a0f] border border-white/10 flex items-center justify-center mb-8 shadow-inner">
                  <Code2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-black mb-6">The Architecture of a <br /><span className="text-cyan-400">High-Converting Website</span></h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  A beautiful website isn't enough. Your website must be a 24/7 salesperson. We build Next.js powered web applications that load instantly and guide users effortlessly towards conversion.
                </p>
                <ul className="space-y-4">
                  {[
                    { title: "Sub-Second Load Times", desc: "Built on edge networks for instant performance." },
                    { title: "Conversion-Centric UX/UI", desc: "Designed using heatmaps and user psychology." },
                    { title: "Technical SEO Foundation", desc: "Rank higher on Google organically from day one." },
                    { title: "Mobile-First Responsiveness", desc: "Flawless experience on every device." }
                  ].map((feature, i) => (
                    <li key={i} className="flex gap-4">
                      <CheckCircle2 className="w-6 h-6 text-cyan-500 shrink-0" />
                      <div>
                        <h4 className="text-white font-bold text-sm">{feature.title}</h4>
                        <p className="text-gray-500 text-xs mt-1">{feature.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="order-1 lg:order-2 reveal-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                Expertise Area 01
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
                Premium <br />Web Design.
              </h2>
              <p className="text-gray-400 text-lg mb-8 font-light leading-relaxed">
                We engineer digital experiences that establish instant authority. When your competitors have slow, outdated templates, your custom-built flagship website will instantly capture the market's trust.
              </p>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.1em] text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                Request a Design Audit <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise 2: Google Ads */}
      <section className="py-24 md:py-32 px-4 relative bg-[#0a0a0f] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                Expertise Area 02
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
                Precision-Targeted <br />Google Ads.
              </h2>
              <p className="text-gray-400 text-lg mb-8 font-light leading-relaxed">
                Stop setting your ad budget on fire. We specialize in intent-based search campaigns that place your business at the exact moment your ideal client is ready to buy.
              </p>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.1em] text-primary-400 hover:text-primary-300 transition-colors group"
              >
                Scale Your Revenue <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="relative group reveal-up">
              <div className="absolute inset-0 bg-primary-600/20 blur-[100px] rounded-full group-hover:bg-primary-500/30 transition-colors duration-700 pointer-events-none"></div>
              <div className="relative glass-premium p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-[#0a0a0f] border border-white/10 flex items-center justify-center mb-8 shadow-inner">
                  <Target className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-3xl font-black mb-6">The Science of <br /><span className="text-primary-400">Profitable Ad Spend</span></h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  We don't guess. We utilize data-driven bid strategies, relentless A/B testing, and negative keyword optimization to drive down your Cost-Per-Acquisition (CPA).
                </p>
                <ul className="space-y-4">
                  {[
                    { title: "High-Intent Keyword Mining", desc: "Targeting users ready to convert, not window shoppers." },
                    { title: "Psychological Ad Copy", desc: "Writing that forces clicks and pre-qualifies leads." },
                    { title: "Advanced Conversion Tracking", desc: "Knowing exactly which penny generated profit." },
                    { title: "Continuous Optimization", desc: "Daily monitoring to scale what works and cut what doesn't." }
                  ].map((feature, i) => (
                    <li key={i} className="flex gap-4">
                      <BarChart3 className="w-6 h-6 text-primary-500 shrink-0" />
                      <div>
                        <h4 className="text-white font-bold text-sm">{feature.title}</h4>
                        <p className="text-gray-500 text-xs mt-1">{feature.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-24 md:py-32 px-4 relative">
        <div className="max-w-5xl mx-auto text-center reveal-up">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">How We Deliver <span className="premium-gradient">Results</span></h2>
          <p className="text-gray-400 text-lg mb-16 font-light max-w-2xl mx-auto">Our transparent, 4-step framework guarantees that your project moves from strategy to profit without delays.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-white/10 z-0"></div>

            {[
              { step: "01", title: "Discovery", desc: "Deep-dive into your business model, competitors, and goals." },
              { step: "02", title: "Strategy", desc: "Architecting the funnel and mapping the ad campaigns." },
              { step: "03", title: "Execution", desc: "Building the high-performance site and launching ads." },
              { step: "04", title: "Optimization", desc: "A/B testing and scaling the ad spend for maximum ROI." }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 glass-premium p-8 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all hover:-translate-y-2 group">
                <div className="w-16 h-16 mx-auto rounded-full bg-dark-bg border border-white/10 flex items-center justify-center text-xl font-black text-white group-hover:bg-primary-600 group-hover:border-primary-500 transition-colors mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600/10 blur-[150px] rounded-full translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto glass-premium rounded-[3rem] md:rounded-[4rem] border border-white/10 p-12 md:p-24 relative z-10 text-center shadow-[0_20px_100px_rgba(0,0,0,0.5)] group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight text-white">
            Ready to Stop Playing Small?
          </h2>
          <p className="text-gray-400 text-lg mb-12 font-light max-w-xl mx-auto">
            Book a free strategy session via WhatsApp today. We'll audit your current digital presence and show you exactly how to double your leads.
          </p>

          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-6 rounded-2xl bg-[#25D366] text-white text-base font-black hover:bg-[#128C7E] hover:scale-105 transition-all shadow-[0_10px_40px_rgba(37,211,102,0.3)] gap-3"
          >
            Chat with an Expert on WhatsApp <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
