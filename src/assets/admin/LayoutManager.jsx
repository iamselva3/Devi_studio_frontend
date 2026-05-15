import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const LayoutManager = () => {
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState({
    bannerHeights: {
      home: 450,
      wedding: 400,
      baby: 400,
      model: 400,
      about: 400,
      contact: 400,
    },
    cardAlignment: "grid-cols-3",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchBanners();
    fetchSettings();
  }, []);

  const fetchBanners = async () => {
    try {
      // Fetch images from all banner categories
      const categories = ["banners", "banner_wedding", "banner_baby", "banner_model", "banner_about", "banner_contact"];
      const allBanners = [];
      for (const cat of categories) {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/images/category/${cat}`);
        allBanners.push(...res.data.data.map(img => ({ ...img, category: cat })));
      }
      setBanners(allBanners);
    } catch (err) {
      console.error("Error fetching banners", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings/layout_config`);
      if (res.data && res.data.value) {
        setSettings(res.data.value);
      }
    } catch (err) {
      console.error("Error fetching settings", err);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/settings/layout_config`, { value: settings }, authHeader);
      setMessage("Layout settings saved successfully!");
    } catch (err) {
      setMessage("Failed to save settings: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (clientName, public_id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/clients/${clientName}/images/${encodeURIComponent(public_id)}`, authHeader);
      setMessage("Banner deleted successfully");
      fetchBanners();
    } catch (err) {
      setMessage("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const updateBannerHeight = (page, value) => {
    setSettings({
      ...settings,
      bannerHeights: {
        ...settings.bannerHeights,
        [page]: parseInt(value),
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b border-zinc-900 pb-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">LAYOUT & BANNERS</h1>
          <a href="/admin" className="text-zinc-500 hover:text-white transition text-xs uppercase tracking-widest">Back to Dashboard</a>
        </div>

        {message && (
          <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl mb-8 text-center text-sm uppercase tracking-widest">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* SETTINGS PANEL */}
          <div className="lg:col-span-1 space-y-10">
            <section className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800">
              <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-white"></span>
                PAGE BANNERS
              </h2>
              <div className="space-y-8">
                {Object.entries(settings.bannerHeights).map(([page, height]) => (
                  <div key={page} className="space-y-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{page} Page</label>
                      <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-white font-mono">{height}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="200"
                      max="800"
                      step="10"
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                      value={height}
                      onChange={(e) => updateBannerHeight(page, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800">
              <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-white"></span>
                CARD ALIGNMENT
              </h2>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 block">Home Grid Columns</label>
                <select 
                  className="w-full bg-black border border-zinc-800 p-3 rounded-xl focus:border-white outline-none appearance-none cursor-pointer"
                  value={settings.cardAlignment}
                  onChange={(e) => setSettings({ ...settings, cardAlignment: e.target.value })}
                >
                  <option value="grid-cols-1">1 Column</option>
                  <option value="grid-cols-2">2 Columns</option>
                  <option value="grid-cols-3">3 Columns</option>
                  <option value="grid-cols-4">4 Columns</option>
                </select>
              </div>
            </section>

            <button 
              onClick={handleSaveSettings}
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loading ? "Saving..." : "Save All Configurations"}
            </button>
          </div>

          {/* BANNER PREVIEW PANEL */}
          <div className="lg:col-span-2">
            <section className="bg-zinc-900/10 p-8 rounded-3xl border border-zinc-800 h-full">
              <h2 className="text-xl font-serif mb-8 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-white"></span>
                BANNER ASSETS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto max-h-[800px] pr-4 custom-scrollbar">
                {banners.map((banner, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-video border border-white/5 bg-zinc-900">
                    <img src={banner.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-700" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">{banner.category}</p>
                      <p className="text-sm font-bold text-white mb-4">{banner.clientName}</p>
                      <button 
                        onClick={() => handleDeleteBanner(banner.clientName, banner.public_id)}
                        className="bg-red-500 text-white text-[10px] uppercase tracking-widest font-bold py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete Banner
                      </button>
                    </div>
                  </div>
                ))}
                {banners.length === 0 && (
                  <div className="col-span-2 text-center py-20 text-zinc-600 italic">No banners found.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default LayoutManager;
