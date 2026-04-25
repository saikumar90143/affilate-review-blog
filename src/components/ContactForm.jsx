"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-dark-card p-8 rounded-2xl border border-green-500/30 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
        <p className="text-gray-400 mb-6">We've received your request and will get back to you shortly.</p>
        <button 
          onClick={() => setStatus("idle")}
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-dark-card p-8 rounded-2xl border border-border">
      <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
      
      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Something went wrong. Please try again or reach out to us via email.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <input 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
          <textarea 
            required 
            rows="4" 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors resize-none"
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors mt-2 flex justify-center items-center"
        >
          {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
