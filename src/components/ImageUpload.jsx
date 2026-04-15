"use client";

import { useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

export default function ImageUpload({ onUpload, defaultValue = "", label = "Upload Image" }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(defaultValue);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset state
    setLoading(true);
    setError(null);

    try {
      // Proxy through our backend to evade adblockers and secure our keys
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload proxy failed");
      
      const data = await res.json();
      const url = data.url;
      
      setPreview(url);
      onUpload(url);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setPreview("");
    onUpload("");
  };

  return (
    <div className="field">
      <label className="label">{label}</label>
      
      <div className="relative group">
        {preview ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700 bg-gray-800">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className={`
            flex flex-col items-center justify-center aspect-video w-full rounded-xl border-2 border-dashed 
            transition-all cursor-pointer bg-gray-800/50
            ${loading ? 'border-primary-500 bg-primary-500/5' : 'border-gray-700 hover:border-primary-500/50 hover:bg-gray-800'}
          `}>
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                <span className="text-sm text-gray-400 font-medium">Uploading to Cloud...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-gray-700 rounded-full">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 10MB)</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={loading}
            />
          </label>
        )}
      </div>
      
      {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  );
}
