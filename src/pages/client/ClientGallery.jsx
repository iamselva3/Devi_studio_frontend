import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getClientByName } from "../../api/clientApi";
import { getSettings } from "../../api/studioApi";
import "../public/Gallery.css";
import "./ClientGallery.css";

export default function ClientGallery() {
  const { clientName } = useParams();
  const [client, setClient] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getClientByName(clientName),
      getSettings()
    ])
    .then(([clientRes, settingsRes]) => {
      setClient(clientRes.data.data);
      setSettings(settingsRes.data.data);
    })
    .catch((err) => {
      setError(err.response?.data?.message || "Gallery not found or unavailable.");
    })
    .finally(() => setLoading(false));
  }, [clientName]);

  const openLightbox = useCallback((idx) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevImg = useCallback(() => {
    if (client?.images) setLightbox((i) => (i > 0 ? i - 1 : client.images.length - 1));
  }, [client]);
  const nextImg = useCallback(() => {
    if (client?.images) setLightbox((i) => (i < client.images.length - 1 ? i + 1 : 0));
  }, [client]);

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

  if (loading) {
    return (
      <div className="client-gallery-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="client-gallery-error">
        <div className="container">
          <h2>Gallery Not Found</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const images = client.images || [];

  return (
    <div className="client-gallery">
      {/* Banner */}
      <div className="client-banner">
        <div className="client-banner__overlay" />
        <div className="container client-banner__content">
          <span className="label-gold">Private Collection</span>
          <div className="gold-divider" />
          <h1 className="heading-lg client-banner__title">{client.clientName}</h1>
          <p className="body-text client-banner__desc">
            {images.length} {images.length === 1 ? "Photo" : "Photos"}
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="section">
        <div className="container">
          {images.length === 0 ? (
            <div className="gallery-empty">
              <h3>No photos yet</h3>
              <p>Your photographer is still curating this gallery.</p>
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
                  <img src={img.url} alt={`${client.clientName} ${idx + 1}`} loading="lazy" />
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
             ✕
          </button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); prevImg(); }} aria-label="Previous">
            ←
          </button>
          <div className="lightbox__img-wrap" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightbox]?.url} alt={`Photo ${lightbox + 1}`} className="lightbox__img" />
          </div>
          <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); nextImg(); }} aria-label="Next">
            →
          </button>
          <div className="lightbox__counter">{lightbox + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}
