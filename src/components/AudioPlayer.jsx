"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";

export default function AudioPlayer({ textToRead }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsReady(true);
      // Clean up if component unmounts while speaking
      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const togglePlay = () => {
    if (!isReady) return;
    
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        // Pick an English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en"));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (isReady) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  if (!isReady || !textToRead) return null;

  return (
    <div className="flex items-center gap-4 bg-primary-900/40 border border-primary-500/20 backdrop-blur-md rounded-2xl p-4 shadow-lg w-full max-w-sm reveal-fade">
      <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
         <Volume2 className="w-5 h-5 text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
         <p className="text-xs font-black uppercase text-gray-400 tracking-wider">Audio Summary</p>
         <p className="text-sm font-medium text-white truncate">Listen to key takeaways</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={stopAudio}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          disabled={!isPlaying && !window.speechSynthesis.paused}
          aria-label="Stop audio summary"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
        <button 
          onClick={togglePlay}
          className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-500 flex items-center justify-center text-white transition-all shadow-glow"
          aria-label={isPlaying ? "Pause audio summary" : "Play audio summary"}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
        </button>
      </div>
    </div>
  );
}
