import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getImagesByCategory } from "../../api/clientApi";
import { useSettings } from "../../context/SettingsContext";
import "./BabyGallery.css";

export default function BabyGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    setLoading(true);
    getImagesByCategory("baby")
      .then((r) => {
        const clientImgs = r.data.data || [];
        const standaloneImgs = (settings?.standaloneGallery || []).filter(i => i.category === "baby");
        setImages([...standaloneImgs, ...clientImgs]);
      })
      .catch(() => {
        const standaloneImgs = (settings?.standaloneGallery || []).filter(i => i.category === "baby");
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

  const bannerBg = settings?.categoryBanners?.baby;

  return (
    <div className="baby-page">
      {/* Baby Custom Hero */}
      <section className="baby-hero">
        {bannerBg && <img src={bannerBg} alt="Baby Photography" className="baby-hero-bg" />}
        <div className="baby-hero-overlay" />
        <div className="container baby-hero-content">
          <span className="baby-badge">Sweet Moments</span>
          <h1 className="baby-title">Baby Photography</h1>
          <p className="baby-desc">Tiny fingers, tiny toes — moments too precious to let pass unforgotten.</p>
          <div className="baby-clouds"></div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="baby-section">
        <div className="container">
          {loading ? (
            <div className="baby-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton baby-card-skeleton" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="baby-empty">
              <h3>No sweet moments yet</h3>
              <p>Check back later for adorable updates!</p>
            </div>
          ) : (
            <div className="baby-grid">
              {images.map((img, idx) => (
                <div key={img._id || idx} className="baby-card" onClick={() => openLightbox(idx)}>
                  <div className="baby-card-inner">
                    <img src={img.url} alt="Baby" loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Baby Lightbox */}
      {lightbox !== null && (
        <div className="baby-lightbox" onClick={closeLightbox}>
          <button className="baby-lightbox-close" onClick={closeLightbox}>✕</button>
          <button className="baby-lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImg(); }}>‹</button>
          <div className="baby-lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightbox]?.url} alt={`Baby ${lightbox + 1}`} className="baby-lightbox-img" />
          </div>
          <button className="baby-lightbox-next" onClick={(e) => { e.stopPropagation(); nextImg(); }}>›</button>
        </div>
      )}
    </div>
  );
}
