import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getImagesByCategory } from "../../api/clientApi";
import { useSettings } from "../../context/SettingsContext";
import "./ModelGallery.css";

export default function ModelGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    setLoading(true);
    getImagesByCategory("model")
      .then((r) => {
        const clientImgs = r.data.data || [];
        const standaloneImgs = (settings?.standaloneGallery || []).filter(i => i.category === "model");
        setImages([...standaloneImgs, ...clientImgs]);
      })
      .catch(() => {
        const standaloneImgs = (settings?.standaloneGallery || []).filter(i => i.category === "model");
        setImages(standaloneImgs);
      })
      .finally(() => setLoading(false));
  }, [settings]);

  const openLightbox = useCallback((idx) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevImg = useCallback(() => setLightbox((i) => (i > 0 ? i - 1 : images.length - 1)), [images]);
  const nextImg = useCallback(() => setLightbox((i) => (i < images.length - 1 ? i + 1 : 0)), [images]);

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return;
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prevImg, nextImg, closeLightbox]);

  const bannerBg = settings?.categoryBanners?.model;

  return (
    <div className="model-page">
      {/* Editorial Hero */}
      <section className="model-hero">
        {bannerBg && <img src={bannerBg} alt="Model Portfolio" className="model-hero-bg" />}
        <div className="model-hero-overlay" />
        <div className="model-hero-content">
          <div className="model-brand-text">EDITORIAL</div>
          <h1 className="model-title">FASHION & MODELING</h1>
          <p className="model-desc">Power, confidence, and cinematic aesthetics captured through the lens.</p>
          <div className="model-scroll-indicator">
            <span className="scroll-line"></span>
          </div>
        </div>
      </section>

      {/* Cinematic Grid */}
      <section className="model-section">
        {loading ? (
          <div className="model-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton model-item" style={{ minHeight: "300px" }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="model-empty">
            <h2>NO SHOTS YET</h2>
            <p>The lookbook is being curated.</p>
          </div>
        ) : (
          <div className="model-grid">
            {images.map((img, idx) => (
              <div 
                key={img._id || idx} 
                className="model-item"
                onClick={() => openLightbox(idx)}
              >
                <img src={img.url} alt="Fashion" loading="lazy" />
                <div className="model-item-hover">
                  <span>VIEW LOOK</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dark Mode Lightbox */}
      {lightbox !== null && (
        <div className="model-lightbox" onClick={closeLightbox}>
          <button className="model-lightbox-close" onClick={closeLightbox}>✕</button>
          <button className="model-lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImg(); }}>‹</button>
          <div className="model-lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightbox]?.url} alt={`Look ${lightbox + 1}`} className="model-lightbox-img" />
          </div>
          <button className="model-lightbox-next" onClick={(e) => { e.stopPropagation(); nextImg(); }}>›</button>
        </div>
      )}
    </div>
  );
}
