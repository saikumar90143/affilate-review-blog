"use client";

import { useState, useEffect, useCallback } from "react";
import Drawer from "@/components/Drawer";
import { Plus, Trash2, Edit, CheckCircle, Zap } from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";

function toSlug(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const blank = { title: "", slug: "", image: "", affiliateLink: "", links: [], category: "", rating: "5", pros: "", cons: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
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
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [addingCatLoading, setAddingCatLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products", { cache: 'no-store' }),
        fetch("/api/categories?type=product", { cache: 'no-store' })
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok)  setCategories(await catRes.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => {
    setForm(blank); setError(null); setSuccess(null);
    setIsEdit(false); setEditId(null); setDrawerOpen(true);
  };

  const openEdit = (prod) => {
    setForm({
      ...prod,
      category: prod.category?._id || prod.category,
      pros: (prod.pros || []).join(", "),
      cons: (prod.cons || []).join(", "),
      rating: String(prod.rating),
      links: prod.links || [],
    });
    setError(null); setSuccess(null);
    setIsEdit(true); setEditId(prod._id); setDrawerOpen(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(f => ({ ...f, title, ...(!isEdit ? { slug: toSlug(title) } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!form.title || !form.slug || !form.category || !form.rating) {
      setError("Please fill required fields (Title, Slug, Category, Rating).");
      return;
    }

    if (!form.image) {
      setError("Please upload a product image before registering.");
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      rating: parseFloat(form.rating) || 0,
      pros: (form.pros || "").split(",").map(p => p.trim()).filter(Boolean),
      cons: (form.cons || "").split(",").map(c => c.trim()).filter(Boolean),
    };

    const res = await fetch(isEdit ? `/api/products/${editId}` : "/api/products", {
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
    setSuccess(isEdit ? "Product updated!" : "Product created!");
    fetchAll();
    setTimeout(() => { setDrawerOpen(false); setSuccess(null); }, 1500);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product permanently?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) fetchAll();
  };

  const handleQuickAddCategory = async () => {
    if (!newCatName.trim()) return;
    setAddingCatLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          slug: toSlug(newCatName.trim()),
          for: ["product"],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.[0]?.message || data.error || "Failed to create category");
      
      setCategories(prev => [data, ...prev]);
      setForm(f => ({ ...f, category: data._id }));
      setNewCatName("");
      setIsAddingCat(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingCatLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" /> New Product
        </button>
      </div>

      <div className="mb-5">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products by title…"
          className="input max-w-sm"
        />
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-900/60 border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4 hidden md:table-cell">Category</th>
              <th className="p-4">Rating</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading…</td></tr>
            ) : products.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">{search ? `No products matching "${search}"` : "No products yet."}</td></tr>
            ) : products.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map(prod => (
              <tr key={prod._id} className="hover:bg-gray-700/30 transition-colors">
                <td className="p-4">
                  <div className="w-14 h-14 bg-white rounded-lg relative overflow-hidden p-1">
                    <Image src={prod.image} alt="" fill className="object-contain" sizes="56px" unoptimized />
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-medium max-w-xs truncate">{prod.title}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">/{prod.slug}</p>
                </td>
                <td className="p-4 hidden md:table-cell text-green-400 text-sm">{prod.category?.name || "—"}</td>
                <td className="p-4">
                  <span className="text-yellow-400 font-bold">{prod.rating} ★</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(prod)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(prod._id)} className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors">
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
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={isEdit ? "Refine Product" : "New Inventory"}>
        {error   && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-[2rem] mb-10 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">{error}</div>}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-[2rem] mb-10 flex items-center gap-4 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 shrink-0" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-12 pb-10">
          {/* Section 1: Product Specs */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-glow"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Specifications</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="field">
                <label className="label">Product Model *</label>
                <input required value={form.title} onChange={handleTitleChange} className="input" placeholder="Sony WH-1000XM6" />
              </div>
              <div className="field">
                <label className="label">Routing Slug *</label>
                <input required value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} className="input font-mono text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="field">
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Category Segment *</label>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsAddingCat(!isAddingCat);
                      setNewCatName("");
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors"
                  >
                    {isAddingCat ? "[ Cancel ]" : "[ Add New ]"}
                  </button>
                </div>

                {isAddingCat ? (
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      placeholder="New category..." 
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      className="input flex-1 border-green-500/20 focus:border-green-500/50"
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleQuickAddCategory())}
                    />
                    <button 
                      type="button"
                      disabled={addingCatLoading}
                      onClick={handleQuickAddCategory}
                      className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 rounded-xl transition-all"
                    >
                      {addingCatLoading ? "..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <select required value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="input">
                    <option value="">Select Vertical…</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                )}
              </div>
              <div className="field">
                <label className="label">Elite Rating (0–5) *</label>
                <input required type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(f => ({...f, rating: e.target.value}))} className="input" />
              </div>
            </div>

            <ImageUpload 
              label="Boutique Visual (Product Image) *" 
              defaultValue={form.image} 
              onUpload={(url) => setForm(f => ({ ...f, image: url }))} 
            />
          </div>

          <div className="h-px bg-white/5"></div>

          {/* Section 2: Purchase Channels */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-primary-600 shadow-glow"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Purchase Channels</h3>
            </div>
            
            <div className="space-y-4">
              {form.links.map((link, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-black/20 p-4 rounded-2xl border border-white/5 reveal-up">
                  <div className="flex-1 space-y-4">
                    <input 
                      placeholder="Platform (e.g., Amazon)" 
                      value={link.platform} 
                      onChange={e => {
                        const newLinks = [...form.links];
                        newLinks[idx].platform = e.target.value;
                        setForm(f => ({...f, links: newLinks}));
                      }}
                      className="input"
                    />
                    <input 
                      placeholder="Full Affiliate URL" 
                      value={link.url} 
                      onChange={e => {
                        const newLinks = [...form.links];
                        newLinks[idx].url = e.target.value;
                        setForm(f => ({...f, links: newLinks}));
                      }}
                      className="input text-xs font-mono"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const newLinks = form.links.filter((_, i) => i !== idx);
                      setForm(f => ({...f, links: newLinks}));
                    }}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => setForm(f => ({...f, links: [...f.links, { platform: "", url: "" }]}))}
                className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-primary-500/50 hover:text-primary-500 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Multi-Store Channel
              </button>
            </div>
          </div>

          <div className="h-px bg-white/5"></div>

          {/* Section 3: Attribute Analysis */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-purple-600 shadow-glow"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Attribute Analysis</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="field">
                <label className="label">Dominant Pros (CSV)</label>
                <textarea rows={4} value={form.pros} onChange={e => setForm(f => ({...f, pros: e.target.value}))} className="input" placeholder="Great battery, Clear sound" />
              </div>
              <div className="field">
                <label className="label">Critical Cons (CSV)</label>
                <textarea rows={4} value={form.cons} onChange={e => setForm(f => ({...f, cons: e.target.value}))} className="input" placeholder="Expensive, Bulky" />
              </div>
            </div>
          </div>

          {/* Deployment Bar */}
          <div className="flex justify-end pt-10 border-t border-white/5">
            <button 
              type="submit" 
              disabled={saving} 
              className="bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-black px-12 py-5 rounded-2xl transition-all shadow-glow transform active:scale-95 flex items-center gap-3"
            >
              {saving ? "Deploying..." : isEdit ? "Sync Inventory" : "Register Product"}
              {!saving && <Zap className="w-4 h-4 text-green-600 fill-green-600" />}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
