import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getImagesByCategory } from "../../api/clientApi";
import "./Gallery.css";

import { useSettings } from "../../context/SettingsContext";

const CATEGORIES = {
  wedding: { label: "Weddings", desc: "Every love story deserves to be preserved with elegance and care." },
  baby: { label: "Baby Photography", desc: "Tiny fingers, tiny toes — moments too precious to let pass unforgotten." },
  model: { label: "Model Shoots", desc: "Fashion, power, confidence — captured through a cinematic lens." },
};

export default function Gallery({ title, category, bannerCategory }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    setLoading(true);
    getImagesByCategory(category)
      .then((r) => {
        const clientImgs = r.data.data || [];
        const standaloneImgs = (settings?.standaloneGallery || []).filter(i => i.category === category);
        setImages([...standaloneImgs, ...clientImgs]);
      })
      .catch(() => {
        const standaloneImgs = (settings?.standaloneGallery || []).filter(i => i.category === category);
        setImages(standaloneImgs);
      })
      .finally(() => setLoading(false));
  }, [category, settings]);

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

  const info = CATEGORIES[category] || {};
  const bannerBg = settings?.categoryBanners?.[category];

  return (
    <div className="gallery-page">
      {/* Banner */}
      <section 
        className="gallery-banner" 
        style={bannerBg ? { backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="gallery-banner__overlay" style={bannerBg ? { background: "linear-gradient(135deg, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.4) 100%)" } : {}} />
        <div className="container gallery-banner__content">
          <div className="gallery-banner__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{title || info.label}</span>
          </div>
          <span className="label-gold">Our Portfolio</span>
          <div className="gold-divider" />
          <h1 className="heading-lg gallery-banner__title" style={bannerBg ? { color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" } : {}}>
            {title || info.label}
          </h1>
          <p className="body-text gallery-banner__desc" style={bannerBg ? { color: "#eee", textShadow: "0 2px 10px rgba(0,0,0,0.5)" } : {}}>{info.desc}</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="gallery-grid gallery-grid--skeleton">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="skeleton gallery-grid__skeleton" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="gallery-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="48" height="48">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <h3>No photos yet</h3>
              <p>The gallery is being curated. Check back soon!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((img, idx) => (
                <button
                  key={img._id || idx}
                  className="gallery-item"
                  onClick={() => openLightbox(idx)}
                  aria-label={`View photo ${idx + 1}`}
                  style={{ animationDelay: `${(idx % 9) * 0.05}s` }}
                >
                  <img src={img.url} alt={`${title} ${idx + 1}`} loading="lazy" />
                  <div className="gallery-item__overlay">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox__close" onClick={closeLightbox} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); prevImg(); }} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <div className="lightbox__img-wrap" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightbox]?.url} alt={`Photo ${lightbox + 1}`} className="lightbox__img" />
          </div>
          <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); nextImg(); }} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          <div className="lightbox__counter">{lightbox + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}
