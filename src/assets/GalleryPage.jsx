import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";

const GalleryPage = ({ title, category, bannerCategory }) => {
  const [banners, setBanners] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerHeight, setBannerHeight] = useState(400); // Default mobile height

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const bannerRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/images/category/${bannerCategory}`);
        setBanners(bannerRes.data.data);
        const imageRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/images/category/${category}`);
        setImages(imageRes.data.data);

        // Fetch Banner Height Setting
        const settingsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings/layout_config`);
        if (settingsRes.data && settingsRes.data.value && settingsRes.data.value.bannerHeights) {
            const pageKey = category.split('_').pop(); // e.g. "banner_wedding" -> "wedding"
            const height = settingsRes.data.value.bannerHeights[category] || settingsRes.data.value.bannerHeights[pageKey] || 400;
            setBannerHeight(height);
        }
      } catch (err) {
        console.error(`Error fetching data for ${title}`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, bannerCategory, title]);

  return (
    <div className="min-h-screen">
      {/* BANNER SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-[1px] md:px-6 mt-4">
        <div 
          className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-700"
          style={{ height: `${bannerHeight}px` }}
        >
        {loading ? (
          <div className="w-full h-full bg-zinc-900/10 dark:bg-zinc-900/50 animate-pulse flex items-center justify-center">
             <span className="text-zinc-400 font-serif italic text-lg tracking-widest uppercase">Loading...</span>
          </div>
        ) : banners.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="w-full h-full gallery-banner-swiper"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img src={banner.url} alt={`Banner ${index}`} className="w-full h-full object-cover scale-105 animate-[zoom_20s_infinite_alternate]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white/60 text-[10px] md:text-xs tracking-[0.5em] uppercase mb-4"
                      >
                        Photography & Films
                      </motion.span>
                      <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-7xl font-serif font-bold uppercase tracking-widest text-white italic"
                      >
                        {title}
                      </motion.h1>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
             <h1 className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-widest text-white/20 relative z-10 italic">{title}</h1>
          </div>
        )}

        <style>{`
          @keyframes zoom {
            from { transform: scale(1.05); }
            to { transform: scale(1.15); }
          }
          .gallery-banner-swiper .swiper-pagination-bullet { background: #fff; opacity: 0.5; }
          .gallery-banner-swiper .swiper-pagination-bullet-active { background: #fff; opacity: 1; }
        `}</style>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="max-w-7xl mx-auto px-[1px] py-12 md:py-32">
        <div className="mb-16 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-serif italic dark:text-zinc-300">The Gallery</h2>
            <div className="h-[1px] flex-grow bg-black/5 dark:bg-white/5 mx-8"></div>
            <span className="text-zinc-500 dark:text-zinc-600 text-[10px] uppercase tracking-widest hidden sm:block">{images.length} Assets</span>
        </div>
        
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-[4/5] bg-zinc-900/10 dark:bg-zinc-900/50 animate-pulse rounded-[2rem]"></div>
                ))}
            </div>
        ) : images.length > 0 ? (
            <div className="columns-2 sm:columns-2 lg:columns-3 gap-3 md:gap-6 space-y-3 md:space-y-6">
                {images.map((img, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-zinc-900/5 border border-black/5 dark:border-white/5"
                    >
                        <img 
                            // src={encodeUrl(img.url)} 
                            src={img.url}
                            alt={`${title} ${index}`} 
                            className="w-full h-auto transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-24 text-zinc-500 italic">
                No images found in the {title} gallery yet.
            </div>
        )}
      </section>
    </div>

  );
};

export default GalleryPage;
