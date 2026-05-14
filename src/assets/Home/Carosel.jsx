import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { motion } from "framer-motion";

const HeroShowcase = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/images/category/banners`);
        setBanners(res.data.data);
      } catch (err) {
        console.error("Error fetching banners", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-6 mt-4">
      <div className="relative rounded-[2rem] shadow-2xl overflow-hidden h-[450px] md:h-[600px]">
        {loading ? (
          <div className="w-full h-full bg-zinc-400/10 dark:bg-zinc-900/50 animate-pulse flex items-center justify-center">
            <span className="text-zinc-400 font-serif italic text-xl tracking-[0.3em]">DEVI STUDIO</span>
          </div>
        ) : banners.length > 0 ? (

          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={0}
            slidesPerView={1}
            className="h-full home-banner-swiper"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img 
                    src={banner.url} 
                    alt={`Banner ${index}`} 
                    className="w-full h-full object-cover scale-105 animate-[zoom_25s_infinite_alternate]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
             <p className="text-zinc-500 font-serif italic">No banners uploaded yet.</p>
          </div>
        )}

        {/* TEXT OVERLAY */}
        <div
          className="
            absolute inset-0
            z-20
            flex flex-col items-center md:items-end justify-center md:justify-end
            text-center md:text-end px-6 md:px-16
            pb-10 md:pb-16
            pointer-events-none
          "
        >
          <motion.h2 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-2xl text-white"
          >
            DEVI STUDIO
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-medium mb-6 drop-shadow-lg text-white/90 italic"
          >
            Capturing your eternal memories
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl text-xs md:text-sm leading-relaxed drop-shadow-lg text-white/70 uppercase tracking-widest hidden md:block"
          >
            Vellore, Tamil Nadu <br />
            9840767566
          </motion.div>
        </div>
      </div>
      <style>{`
        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        .home-banner-swiper .swiper-pagination-bullet { background: #fff; opacity: 0.5; }
        .home-banner-swiper .swiper-pagination-bullet-active { background: #fff; width: 20px; border-radius: 4px; opacity: 1; transition: all 0.3s; }
      `}</style>
    </section>
  );
};

export default HeroShowcase;
