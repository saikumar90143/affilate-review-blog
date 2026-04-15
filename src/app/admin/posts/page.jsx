"use client";

import { useState, useEffect, useCallback } from "react";
import Editor from "@/components/Editor";
import Drawer from "@/components/Drawer";
import { Plus, Trash2, Edit, CheckCircle, Zap } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";

function toSlug(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const blank = {
  title: "", slug: "", excerpt: "", content: "",
  featuredImage: "", category: "", tags: "",
  isPublished: true, metaTitle: "", metaDescription: "",
};

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(blank);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, catsRes] = await Promise.all([
        fetch(`/api/posts?limit=100&admin=true`, { cache: 'no-store' }),
        fetch("/api/categories", { cache: 'no-store' }),
      ]);
      if (postsRes.ok) setPosts((await postsRes.json()).posts || []);
      if (catsRes.ok)  setCategories(await catsRes.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => {
    setForm(blank); setError(null); setSuccess(null);
    setIsEdit(false); setEditId(null); setDrawerOpen(true);
  };

  const openEdit = (post) => {
    setForm({
      ...post,
      category: post.category?._id || post.category,
      tags: (post.tags || []).join(", "),
      isPublished: post.isPublished ?? true, // Default to true if field is missing from DB
    });
    setError(null); setSuccess(null);
    setIsEdit(true); setEditId(post._id); setDrawerOpen(true);
  };

  const closeDrawer = () => { setDrawerOpen(false); };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(f => ({ ...f, title, ...(!isEdit ? { slug: toSlug(title) } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.slug || !form.category || !form.excerpt || !form.content) {
      setError("Please fill all required fields (Title, Slug, Category, Excerpt, Content).");
      return;
    }

    setSaving(true);

    const payload = { ...form, tags: (form.tags || "").split(",").map(t => t.trim()).filter(Boolean) };
    const res = await fetch(isEdit ? `/api/posts/${editId}` : "/api/posts", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(Array.isArray(data.error) ? data.error[0].message : data.error);
      return;
    }
    setSuccess(isEdit ? "Post updated!" : "Post created successfully!");
    fetchAll();
    setTimeout(() => { setDrawerOpen(false); setSuccess(null); }, 1500);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post permanently?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) fetchAll();
  };

  const togglePublish = async (post) => {
    await fetch(`/api/posts/${post._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...post,
        category: post.category?._id || post.category,
        isPublished: !post.isPublished,
        tags: post.tags,
      }),
    });
    fetchAll();
  };

  return (
    <div className="p-6 md:p-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-gray-400 text-sm mt-1">{posts.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" /> New Post
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-5">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts by title…"
          className="input max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-900/60 border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4 hidden md:table-cell">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading…</td></tr>
            ) : posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">{search ? `No posts matching "${search}"` : "No posts yet. Create your first one!"}</td></tr>
            ) : posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map(post => (
              <tr key={post._id} className="hover:bg-gray-700/30 transition-colors">
                <td className="p-4">
                  <div className="w-16 h-11 bg-gray-700 rounded-lg relative overflow-hidden">
                    {post.featuredImage && (
                      <Image src={post.featuredImage} alt="" fill className="object-cover" sizes="64px" unoptimized />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-medium max-w-xs truncate">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">/{post.slug}</p>
                </td>
                <td className="p-4 hidden md:table-cell text-blue-400 text-sm">{post.category?.name || "—"}</td>
                <td className="p-4">
                  <button
                    onClick={() => togglePublish(post)}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                      post.isPublished
                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                    }`}
                  >
                    {post.isPublished ? "✓ Live" : "Draft"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(post)}
                      title="Edit"
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      title="Delete"
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Drawer */}
      <Drawer open={drawerOpen} onClose={closeDrawer} title={isEdit ? "Refine Report" : "New Dispatch"}>
        {error   && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-[2rem] mb-10 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">{error}</div>}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-[2rem] mb-10 flex items-center gap-4 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 shrink-0" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-12 pb-10">
          {/* Status Header - High Visibility */}
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex items-center justify-between shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Visibility Status</span>
              <span className={`text-lg font-black tracking-tight ${form.isPublished ? "text-primary-400" : "text-yellow-500"}`}>
                {form.isPublished ? "OPERATIONAL (LIVE)" : "HIDDEN (DRAFT)"}
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => setForm(f => ({...f, isPublished: !f.isPublished}))}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 p-1 border border-white/10 ${form.isPublished ? "bg-primary-600 shadow-glow" : "bg-white/10"}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${form.isPublished ? "translate-x-8" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="h-px bg-white/5"></div>

          {/* Section 1: Identity */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-primary-600 shadow-glow"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Essential Dispatch</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="field">
                <label className="label">Operational Title *</label>
                <input required value={form.title} onChange={handleTitleChange} className="input" placeholder="Elite Gear Review" />
              </div>
              <div className="field">
                <label className="label">Routing Slug *</label>
                <input required value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} className="input font-mono text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="field">
                <label className="label">Vertical Category *</label>
                <select required value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="input">
                  <option value="">Select Vertial…</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <ImageUpload 
                label="Primary Visual (Featured)" 
                defaultValue={form.featuredImage} 
                onUpload={(url) => setForm(f => ({ ...f, featuredImage: url }))} 
              />
            </div>
          </div>

          <div className="h-px bg-white/5"></div>

          {/* Section 2: Narrative */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-purple-600 shadow-glow"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">The Narrative</h3>
            </div>

            <div className="field">
              <label className="label">Brief Summary (Excerpt) *</label>
              <textarea required rows={3} value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} className="input" placeholder="Primary insights for cards..." />
            </div>

            <div className="field">
              <label className="label">Full Report Content *</label>
              <div className="rounded-[2rem] overflow-hidden border border-white/5 bg-[#050505] shadow-inner">
                <Editor value={form.content} onChange={v => setForm(f => ({...f, content: v}))} />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5"></div>

          {/* Section 3: Global SEO */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-glow"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Global SEO</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="field">
                <label className="label">Search Metadata Title</label>
                <input value={form.metaTitle} onChange={e => setForm(f => ({...f, metaTitle: e.target.value}))} className="input" placeholder="Optimized title..." />
              </div>
              <div className="field">
                <label className="label">Social Tags</label>
                <input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} className="input" placeholder="tech, review, 2026" />
              </div>
            </div>

            <div className="field">
              <label className="label">Search Metadata Description</label>
              <textarea rows={2} value={form.metaDescription} onChange={e => setForm(f => ({...f, metaDescription: e.target.value}))} className="input" placeholder="High-CTR description..." />
            </div>
          </div>

          {/* Deployment Bar */}
          <div className="flex items-center justify-end pt-10 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-black px-10 py-5 rounded-2xl transition-all shadow-glow transform active:scale-95 flex items-center gap-3"
            >
              {saving ? "Deploying..." : isEdit ? "Sync Report" : "Launch Dispatch"}
              {!saving && <Zap className="w-4 h-4 text-primary-600 fill-primary-600" />}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
