"use client";

import Image from "next/image";
import { ExternalLink, Globe, ShieldCheck, Check } from "lucide-react";

export default function AuthorBox({ author }) {
  if (!author) return null;

  return (
    <div className="mt-20 pt-16 border-t border-white/5 reveal-up">
      <div className="group relative glass-premium rounded-[3rem] p-8 md:p-12 border-white/5 overflow-hidden shadow-premium hover:border-primary-500/20 transition-all duration-500">
        
        {/* Background Mesh Detail */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 opacity-[0.03] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
          {/* Author Image with Glow */}
          <div className="relative shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-br from-primary-600 to-purple-600 rounded-[2.5rem] opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden bg-[#0d0d12] border-2 border-white/10 p-1">
              {author.authorImage ? (
                <Image 
                  src={author.authorImage} 
                  alt={author.authorName} 
                  fill 
                  className="object-cover rounded-[1.8rem]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-700 bg-gray-900 uppercase">
                   {author.authorName?.[0]}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-full border-4 border-dark-card shadow-xl">
               <Check className="w-3 h-3 text-white stroke-[4]" />
            </div>
          </div>

          {/* Author Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-2">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                   <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
                   <span className="text-primary-400 text-[10px] font-black uppercase tracking-[0.25em]">Verified Authority</span>
                </div>
                <h3 className="text-3xl font-black tracking-tighter text-white">{author.authorName}</h3>
              </div>
              
              {/* Social Links - High Contrast */}
              <div className="flex items-center justify-center gap-2">
                {author.socials?.twitter && (
                  <a href={author.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {author.socials?.instagram && (
                  <a href={author.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                )}
                {author.socials?.linkedin && (
                  <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.208 24 24 23.227 24 22.271V1.729C24 .774 23.208 0 22.225 0z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl font-light italic">
              "{author.authorBio}"
            </p>
            
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Expert Reviewer</span>
               </div>
               <div className="text-[10px] text-gray-500 flex items-center gap-2 font-black uppercase tracking-widest">
                  <ExternalLink className="w-3 h-3" /> Industry Certified
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
