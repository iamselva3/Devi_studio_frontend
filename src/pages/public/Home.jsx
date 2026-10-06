import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllClients } from "../../api/clientApi";
import { getTestimonials } from "../../api/studioApi";
import { useSettings } from "../../context/SettingsContext";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
/* SketchRevealImage component — starts as true pencil sketch, fades to reveal color */
function SketchRevealImage({ src, alt, position }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: position === "left" ? -80 : 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
      className="about-image-wrapper"
      style={{ order: position === "left" ? 1 : 2 }}
    >
      <img src={src} alt={alt} className="about-image" />
    </motion.div>
  );
}

const categories = [
  { key: "wedding", label: "Weddings", to: "/weddings", num: "01" },
  { key: "baby", label: "Baby Photography", to: "/baby-photography", num: "02" },
  { key: "model", label: "Model Shoots", to: "/model-shoot", num: "03" },
];

const MODE = import.meta.env.VITE_MODE;

export default function Home() {
  const [allPhotos, setAllPhotos] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const { settings } = useSettings();

  useEffect(() => {
    // Fetch clients first, then handle showcase images
    if (MODE === "server") {
      getAllClients().then(r => {
        const clients = r.data.data || [];
        setClientsList(clients);

        // 1. Showcase Images
        if (settings?.showcaseImages?.length > 0) {
          setAllPhotos(settings.showcaseImages);
        } else {
          const extractedPhotos = clients.flatMap(client => client.images || []);
          const shuffled = extractedPhotos.sort(() => 0.5 - Math.random()).slice(0, 9);
          setAllPhotos(shuffled);
        }
      }).catch(() => { });
    } else if (settings?.showcaseImages?.length > 0) {
      setAllPhotos(settings.showcaseImages);
    }

    // 2. Testimonials
    if (MODE === "server") {
      getTestimonials().then(r => {
        setTestimonials(r.data.data || []);
      }).catch(() => { });
    }
  }, [settings]);

  const baseHeroImages = settings?.heroImages?.length ? settings.heroImages : [
    { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80" },
    { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" },
    { url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80" }
  ];

  // Swiper loop mode needs enough slides to render prev/next previews correctly.
  // If there are only 1-3 images, we duplicate them so it loops seamlessly.
  const heroImages = baseHeroImages.length > 0 && baseHeroImages.length < 5
    ? [...baseHeroImages, ...baseHeroImages, ...baseHeroImages].slice(0, 6)
    : baseHeroImages;

  const studioName = settings?.studioName || "Devi Studio";
  const tagline = settings?.tagline || "Where Moments Become Masterpieces";

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
  };

  return (
    <div className="home-wrapper">

      {/* ── 3D Hero Slider ────────────────────────────────────────────────── */}
      <section className="home-hero">
        <Swiper
          key={`hero-swiper-${heroImages.length}-${heroImages[0]?.url}`}
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 300,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          modules={[EffectCoverflow, Autoplay]}
        >
          {heroImages.map((img, idx) => (
            <SwiperSlide key={`${img._id || 'hero'}-${idx}`}>
              <div className="slide-image-wrapper">
                <img src={img.url} alt="Hero" className="slide-image" />
                <div className="slide-overlay" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <motion.div
          className="hero-content-overlay"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] } }
          }}
        >
          <h1 className="title-hero" style={{ color: settings?.heroTextColor || "var(--text-primary)" }}>
            {studioName}
          </h1>
          <p className="subtitle" style={{ marginTop: '1rem', color: settings?.heroTextColor || 'var(--accent)' }}>
            {tagline}
          </p>
          <div className="hero-actions">
            <Link to="/weddings" className="btn-primary">Explore Gallery</Link>
          </div>
        </motion.div>
      </section>

      {/* ── Dynamic Highlights (About) Sections — Pencil Sketch Reveal ─────── */}
      <section className="section-spacing home-about">
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "8rem" }}>
          {((settings?.aboutSections?.length > 0) ? settings.aboutSections : [{
            title: "The Art of Authenticity",
            text: `We believe that every frame should tell a story. Not just what it looked like, but what it felt like. At ${studioName}, we discard the generic to capture the raw, unscripted beauty of your most cherished moments.`,
            imagePosition: "right",
            image: heroImages[1]?.url || heroImages[0]?.url
          }]).map((sec, idx) => (
            <div className="about-grid" key={idx} style={{ alignItems: "center" }}>

              {/* Text Block — slides from LEFT */}
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                className="about-text"
                style={{ order: sec.imagePosition === "left" ? 2 : 1 }}
              >
                <span className="about-section-num">{String(idx + 1).padStart(2, '0')}</span>
                <h2 className="title-section" style={{ color: "var(--gold)", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>{sec.title}</h2>
                <div className="about-divider"></div>
                <p style={{ marginTop: "1rem", whiteSpace: "pre-line" }}>{sec.text}</p>
                {idx === 0 && (
                  <div style={{ marginTop: "2rem" }}>
                    <Link to="/about-us" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.85rem' }}>Our Story</Link>
                  </div>
                )}
              </motion.div>

              {/* Image Block — slides from RIGHT with pencil sketch reveal */}
              <SketchRevealImage 
                src={sec.image || heroImages[0]?.url} 
                alt={sec.title} 
                position={sec.imagePosition === "left" ? "left" : "right"} 
              />

            </div>
          ))}
        </div>
      </section>

      {/* ── Showcase — Horizontal Filmstrip ───────────────────────────────── */}
      <section className="home-showcase">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="showcase-header">
            <span className="showcase-eyebrow">◈ PORTFOLIO</span>
            <h2 className="title-section">Recent Masterpieces</h2>
            <p className="showcase-sub">A curated selection of our finest work</p>
          </motion.div>
        </div>

        <div className="showcase-filmstrip">
          <div className="showcase-track">
            {[...allPhotos, ...allPhotos].map((photo, idx) => (
              <motion.div
                key={`showcase-${idx}`}
                className="showcase-frame"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 6) * 0.08, duration: 0.6 }}
              >
                <div className="showcase-frame-inner">
                  <img src={photo.url} alt="Showcase" loading="lazy" />
                  <div className="showcase-frame-shine"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {allPhotos.length === 0 && (
          <div className="container" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '2rem 0' }}>
            Loading recent client photos...
          </div>
        )}
      </section>

      {/* ── Our Clients — Magazine Spread ─────────────────────────────────── */}
      <section className="section-spacing home-clients-section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="clients-header">
            <div className="clients-header-line"></div>
            <div className="clients-header-content">
              <span className="clients-eyebrow">REAL STORIES</span>
              <h2 className="title-section">Our Clients</h2>
              <p className="clients-sub">Every love story deserves to be told beautifully</p>
            </div>
            <div className="clients-header-line"></div>
          </motion.div>

          <div className="clients-magazine-grid">
            {clientsList.slice(0, 6).map((client, idx) => (
              <motion.div
                key={client._id || idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.15, duration: 0.7 }}
                className={`client-magazine-card ${idx === 0 ? 'client-magazine-card--featured' : ''}`}
              >
                <Link to={`/client/${encodeURIComponent(client.clientName)}`} className="client-magazine-link">
                  <div className="client-magazine-img-wrap">
                    <img
                      src={client.images?.[0]?.url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"}
                      alt={client.clientName}
                      className="client-magazine-img"
                    />
                    <div className="client-magazine-overlay">
                      <span className="client-magazine-view">View Gallery →</span>
                    </div>
                  </div>
                  <div className="client-magazine-info">
                    <span className="client-magazine-category">{client.images?.[0]?.category || "Gallery"}</span>
                    <h3 className="client-magazine-name">{client.clientName}</h3>
                    <span className="client-magazine-count">{client.images?.length || 0} Photos</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {clientsList.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--text-secondary)", fontStyle: "italic" }}>
              Loading featured clients...
            </div>
          )}
        </div>
      </section>

      {/* ── Client Testimonials ────────────────────────────────────────── */}
      <section className="section-spacing" style={{ background: "rgba(255,255,255,0.02)", overflow: "hidden" }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="subtitle text-gold">Client Stories</p>
            <h2 className="title-section" style={{ marginTop: '0.5rem' }}>Words of Love</h2>
          </motion.div>
        </div>

        {testimonials.length > 0 ? (
          (() => {
            let displayTestimonials = [...testimonials];
            while (displayTestimonials.length > 0 && displayTestimonials.length < 6) {
              displayTestimonials = [...displayTestimonials, ...testimonials];
            }
            return (
              <div className="marquee-container">
                {[1, 2].map((trackIndex) => (
                  <div key={trackIndex} className="marquee-track" aria-hidden={trackIndex === 2 ? "true" : "false"}>
                    {displayTestimonials.map((t, idx) => (
                      <div key={`${trackIndex}-${idx}`} className="testimonial-card">
                        <div className="testimonial-stars">
                          {"★".repeat(t.rating || 5)}{"☆".repeat(5 - (t.rating || 5))}
                        </div>
                        <p className="testimonial-message">"{t.message}"</p>
                        <div className="testimonial-author">
                          <h4>{t.clientName}</h4>
                          <p>{t.eventType}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })()
        ) : (
          <div className="container">
            <div style={{ textAlign: "center", color: "var(--text-secondary)", fontStyle: "italic", padding: "2rem 0" }}>
              No testimonials have been added yet. Add some in the Admin Dashboard!
            </div>
          </div>
        )}
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="section-spacing" style={{ textAlign: 'center' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="title-section" style={{ marginBottom: '3rem' }}>Ready to create<br /> something <em className="text-gold" style={{ fontStyle: 'normal' }}>beautiful?</em></h2>
          <Link to="/contact-us" className="btn-primary">Book A Session</Link>
        </motion.div>
      </section>

    </div>
  );
}
