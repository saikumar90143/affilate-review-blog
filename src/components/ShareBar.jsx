"use client";

import { Share2, Link as LinkIcon, Check, Send, Globe } from "lucide-react";
import { useState } from "react";

export default function ShareBar({ title }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      name: "X (Twitter)",
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-blue-400 hover:bg-blue-400/10"
    },
    {
      name: "Facebook",
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-blue-600 hover:bg-blue-600/10"
    }
  ];

  return (
    <div className="flex items-center gap-2 mt-4 mb-2">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-1">
        <Share2 className="w-3 h-3" /> Share
      </span>
      
      {platforms.map((p) => {
        const Icon = p.icon;
        return (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg bg-gray-800/50 text-gray-400 transition-all ${p.color}`}
            title={`Share on ${p.name}`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}

      <button
        onClick={copyToClipboard}
        className={`p-2 rounded-lg bg-gray-800/50 text-gray-400 transition-all hover:text-green-400 hover:bg-green-400/10`}
        title="Copy Link"
      >
        {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}
