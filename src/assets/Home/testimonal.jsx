import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Testimonials = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/test/testimonial`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-400/5 dark:bg-zinc-900/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-400/5 dark:bg-zinc-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-zinc-500 tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase mb-4"
          >
            Kind words from our clients
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold italic"
          >
            Testimonials
          </motion.h2>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 min-w-[300px] h-[350px] bg-zinc-500/5 dark:bg-zinc-900/50 animate-pulse rounded-[2.5rem] border border-black/5 dark:border-white/5"></div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonial-swiper pb-16"
          >
            {data.map((item, idx) => (
              <SwiperSlide key={item._id || idx}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-black/5 dark:bg-zinc-900/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 h-full flex flex-col relative group transition-all duration-500 hover:border-black/20 dark:hover:border-white/20"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-8 right-8 text-black/5 dark:text-white/5 group-hover:text-black/10 dark:group-hover:text-white/10 transition-colors duration-500">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V21H14.017ZM5.01695 21L5.01695 18C5.01695 16.8954 5.91238 16 7.01695 16H10.017C10.5692 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5692 8 10.017 8H7.01695C6.46467 8 6.01695 8.44772 6.01695 9V12C6.01695 12.5523 5.56923 13 5.01695 13H3.01695V21H5.01695Z" />
                    </svg>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 fill-zinc-400">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-zinc-600 dark:text-zinc-300 font-serif italic text-lg leading-relaxed mb-8 flex-grow">
                    "{item.content}"
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center gap-4 border-t border-black/5 dark:border-white/5 pt-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <img
                        src={item.image.url}
                        alt={item.name}
                        className="w-14 h-14 rounded-full object-cover relative z-10 border border-black/5 dark:border-white/10"
                        />
                    </div>
                    <div>
                      <h3 className="font-bold tracking-tight text-lg">
                        {item.name}
                      </h3>
                      <p className="text-zinc-500 text-sm uppercase tracking-widest">Happy Client</p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <style>{`
        .testimonial-swiper .swiper-pagination-bullet {
          background: var(--text-color);
          opacity: 0.2;
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          background: var(--text-color);
          opacity: 1;
          width: 24px;
          border-radius: 4px;
          transition: all 0.3s;
        }
        .testimonial-swiper .swiper-button-next,
        .testimonial-swiper .swiper-button-prev {
          background: var(--nav-bg);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          color: var(--text-color) !important;
          transition: all 0.3s;
        }
        .testimonial-swiper .swiper-button-next:hover,
        .testimonial-swiper .swiper-button-prev:hover {
          transform: scale(1.1);
        }
        .testimonial-swiper .swiper-button-next::after,
        .testimonial-swiper .swiper-button-prev::after {
          font-size: 18px !important;
          font-weight: bold;
        }
      `}</style>
    </section>

  );
};

export default Testimonials;
