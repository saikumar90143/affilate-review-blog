"use client";

import { useState, useEffect, useCallback } from "react";
import Drawer from "@/components/Drawer";
import { Plus, Trash2, Edit, CheckCircle } from "lucide-react";

function toSlug(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const blank = { name: "", slug: "", description: "" };

export default function AdminCategories() {
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
      const res = await fetch("/api/categories", { cache: 'no-store' });
      if (res.ok) setCategories(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => {
    setForm(blank); setError(null); setSuccess(null);
    setIsEdit(false); setEditId(null); setDrawerOpen(true);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
    setError(null); setSuccess(null);
    setIsEdit(true); setEditId(cat._id); setDrawerOpen(true);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm(f => ({ ...f, name, ...(!isEdit ? { slug: toSlug(name) } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.slug) {
      setError("Please fill required fields (Name and Slug).");
      return;
    }

    setSaving(true);

    const res = await fetch(isEdit ? `/api/categories/${editId}` : "/api/categories", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(Array.isArray(data.error) ? data.error[0].message : data.error);
      return;
    }
    setSuccess(isEdit ? "Category updated!" : "Category created!");
    fetchAll();
    setTimeout(() => { setDrawerOpen(false); setSuccess(null); }, 1500);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Posts linked to it will lose their category.")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) fetchAll();
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" /> New Category
        </button>
      </div>

      <div className="mb-5">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="input max-w-sm"
        />
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-900/60 border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-4">Name</th>
              <th className="p-4">Slug / URL</th>
              <th className="p-4 hidden md:table-cell">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {loading ? (
              <tr><td colSpan={4} className="p-10 text-center text-gray-400">Loading…</td></tr>
            ) : categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
              <tr><td colSpan={4} className="p-10 text-center text-gray-400">{search ? `No categories matching "${search}"` : "No categories yet."}</td></tr>
            ) : categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(cat => (
              <tr key={cat._id} className="hover:bg-gray-700/30 transition-colors">
                <td className="p-4 font-semibold text-purple-400">{cat.name}</td>
                <td className="p-4 text-sm font-mono text-gray-400">/category/{cat.slug}</td>
                <td className="p-4 hidden md:table-cell text-sm text-gray-400 max-w-xs truncate">{cat.description || "—"}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(cat)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors">
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
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={isEdit ? "Edit Category" : "New Category"}>
        {error   && <div className="bg-red-900/40 border border-red-500 text-red-300 p-4 rounded-xl mb-5">{error}</div>}
        {success && (
          <div className="bg-green-900/40 border border-green-500 text-green-300 p-4 rounded-xl mb-5 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="field">
            <label className="label">Name *</label>
            <input required value={form.name} onChange={handleNameChange} className="input" placeholder="Tech Gadgets" />
          </div>
          <div className="field">
            <label className="label">Slug *</label>
            <input required value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} className="input font-mono" placeholder="tech-gadgets" />
            <p className="text-xs text-gray-500 mt-1.5">
              Public URL: <span className="text-gray-300">/category/<strong>{form.slug || "slug"}</strong></span>
            </p>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="input" placeholder="Brief description shown on category archive pages" />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-700">
            <button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
              {saving ? "Saving…" : isEdit ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
