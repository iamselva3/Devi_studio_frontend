import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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

  // Duplicate data for seamless loop
  const marqueeData = [...data, ...data, ...data];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-400/5 dark:bg-zinc-900/30 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold italic"
          >
           Stories Through Their Eyes
          </motion.h2>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-hidden px-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[350px] h-[300px] bg-zinc-500/5 dark:bg-zinc-900/50 animate-pulse rounded-[2.5rem] border border-black/5 dark:border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* FADE GRADIENTS FOR SIDES */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--bg-color)] to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--bg-color)] to-transparent z-20 pointer-events-none"></div>

          <motion.div 
            className="flex gap-6 py-4"
            animate={{
              x: [0, -1500],
            }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ width: "fit-content" }}
            whileHover={{ transition: { duration: 0 } }} // Optional: stop or slow down on hover? 
            // Better way to pause on hover with Framer Motion is using playback controls, 
            // but a simpler trick is using a state or just CSS transition-play-state
          >
            {marqueeData.map((item, idx) => (
              <div 
                key={idx}
                className="min-w-[350px] md:min-w-[450px] bg-black/5 dark:bg-zinc-900/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col relative group hover:border-black/20 dark:hover:border-white/20 transition-all duration-500"
              >
                {/* Quote Icon */}
                <div className="absolute top-8 right-8 text-black/5 dark:text-white/5">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V21H14.017ZM5.01695 21L5.01695 18C5.01695 16.8954 5.91238 16 7.01695 16H10.017C10.5692 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5692 8 10.017 8H7.01695C6.46467 8 6.01695 8.44772 6.01695 9V12C6.01695 12.5523 5.56923 13 5.01695 13H3.01695V21H5.01695Z" />
                  </svg>
                </div>

                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 fill-zinc-400">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>

                <p className="text-zinc-600 dark:text-zinc-300 font-serif italic text-base md:text-lg leading-relaxed mb-8 flex-grow">
                  "{item.content}"
                </p>

                <div className="flex items-center gap-4 border-t border-black/5 dark:border-white/5 pt-6">
                  <img
                    src={item.image.url}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border border-black/5 dark:border-white/10"
                  />
                  <div>
                    <h3 className="font-bold tracking-tight text-base md:text-lg">
                      {item.name}
                    </h3>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Happy Client</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      <style>{`
        .relative:hover motion.div {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};


export default Testimonials;
