"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { CheckCircle, Save, Loader2, User, Globe, Share2 } from "lucide-react";

export default function AdminSettings() {
  const [form, setForm] = useState({
    authorName: "",
    authorBio: "",
    authorImage: "",
    socials: { twitter: "", instagram: "", linkedin: "" },
    siteName: "",
    siteDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  const router = useRouter();

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess("Settings updated successfully!");
      setTimeout(() => {
        setSuccess(null);
        router.push("/admin");
      }, 1500);
    } else {
      setError("Failed to update settings.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading settings…</div>;

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your professional persona and site metadata.</p>
      </div>

      {success && (
        <div className="bg-green-900/40 border border-green-500 text-green-300 p-4 rounded-xl mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> {success}
        </div>
      )}
      {error && <div className="bg-red-900/40 border border-red-500 text-red-300 p-4 rounded-xl mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Author Section */}
        <section className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
            <User className="text-primary-500 w-5 h-5" />
            <h2 className="text-xl font-semibold">Author Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="field">
                <label className="label">Expert Name</label>
                <input 
                  value={form.authorName} 
                  onChange={e => setForm({...form, authorName: e.target.value})} 
                  className="input" 
                  placeholder="e.g. Alex Johnson"
                />
              </div>
              <div className="field">
                <label className="label">Professional Bio</label>
                <textarea 
                  rows={4} 
                  value={form.authorBio} 
                  onChange={e => setForm({...form, authorBio: e.target.value})} 
                  className="input" 
                  placeholder="Tell readers about your expertise..."
                />
              </div>
            </div>
            
            <ImageUpload 
              label="Author Photo" 
              defaultValue={form.authorImage} 
              onUpload={(url) => setForm({...form, authorImage: url})} 
            />
          </div>
        </section>

        {/* Social Links Section */}
        <section className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
            <Share2 className="text-primary-500 w-5 h-5" />
            <h2 className="text-xl font-semibold">Social Connections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="field">
              <label className="label">Twitter / X URL</label>
              <input value={form.socials.twitter} onChange={e => setForm({...form, socials: {...form.socials, twitter: e.target.value}})} className="input" placeholder="https://twitter.com/…" />
            </div>
            <div className="field">
              <label className="label">Instagram URL</label>
              <input value={form.socials.instagram} onChange={e => setForm({...form, socials: {...form.socials, instagram: e.target.value}})} className="input" placeholder="https://instagram.com/…" />
            </div>
            <div className="field">
              <label className="label">LinkedIn URL</label>
              <input value={form.socials.linkedin} onChange={e => setForm({...form, socials: {...form.socials, linkedin: e.target.value}})} className="input" placeholder="https://linkedin.com/…" />
            </div>
          </div>
        </section>

        {/* SEO Section */}
        <section className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
            <Globe className="text-primary-500 w-5 h-5" />
            <h2 className="text-xl font-semibold">General SEO</h2>
          </div>
          <div className="space-y-4">
            <div className="field">
              <label className="label">Site Name</label>
              <input value={form.siteName} onChange={e => setForm({...form, siteName: e.target.value})} className="input" />
            </div>
            <div className="field">
              <label className="label">Meta Description</label>
              <textarea rows={2} value={form.siteDescription} onChange={e => setForm({...form, siteDescription: e.target.value})} className="input" />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:scale-105"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
