"use client";

import { useState } from "react";
import { Bot, Sparkles, Save, Eye, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AIGeneratorPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError("");
    setSuccess("");
    setGeneratedData(null);

    try {
      const res = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate blog");
      }

      setGeneratedData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (status = "draft") => {
    if (!generatedData) return;
    
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...generatedData, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save blog");
      }

      setSuccess(`Blog successfully saved as ${status}!`);
      setGeneratedData(null); // Clear form after successful save
      setTopic("");
      router.refresh();
      
      // Optionally redirect to blogs list:
      // router.push("/admin/blogs");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-400" />
            AI Blog Generator
          </h1>
          <p className="text-gray-400 mt-2">Generate SEO-optimized affiliate content in seconds</p>
        </div>
        <Link 
          href="/admin/blogs" 
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-sm flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View All Blogs
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-3">
          <Save className="w-5 h-5 shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleGenerate} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Topic or Keyword
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Best Gaming Laptops under $1000 in 2024"
              className="flex-1 px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Post
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            The AI will generate a title, URL slug, summary, meta tags, and a ~1000 word SEO optimized HTML article.
          </p>
        </div>
      </form>

      {generatedData && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Generated Output
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => handleSave("draft")}
                disabled={isSaving}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save as Draft
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={isSaving}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                Publish Immediately
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Title</label>
                <input 
                  value={generatedData.title || ''} 
                  onChange={(e) => setGeneratedData({...generatedData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Slug</label>
                <input 
                  value={generatedData.slug || ''} 
                  onChange={(e) => setGeneratedData({...generatedData, slug: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-gray-400 text-sm focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Summary</label>
                <textarea 
                  value={generatedData.summary || ''} 
                  onChange={(e) => setGeneratedData({...generatedData, summary: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-gray-300 text-sm focus:outline-none resize-none" 
                />
              </div>
            </div>
            
            <div className="space-y-4 bg-gray-900/50 p-4 rounded-xl border border-white/5">
              <h3 className="text-sm font-medium text-gray-300 mb-3 border-b border-white/10 pb-2">SEO Meta Data</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Meta Title</label>
                <p className="text-sm text-blue-400">{generatedData.metaTitle}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Meta Description</label>
                <p className="text-sm text-gray-400">{generatedData.metaDescription}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">HTML Content Preview</label>
            <div 
              className="bg-gray-900 border border-white/10 rounded-xl p-6 prose prose-invert max-w-none prose-h2:text-blue-400 prose-h3:text-blue-300 prose-a:text-purple-400"
              dangerouslySetInnerHTML={{ __html: generatedData.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
