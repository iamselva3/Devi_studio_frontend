import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const About = () => {
  const [latestImages, setLatestImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // Fetch all clients and flatten their images to find the latest
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients`);
        let allImages = [];
        res.data.data.forEach(client => {
          client.images.forEach(img => {
            allImages.push({ ...img, clientName: client.clientName });
          });
        });
        
        // Sort by some criteria if available, or just take the last 3
        // For now, we take the last 3 from the flattened array
        setLatestImages(allImages.slice(-3).reverse());
      } catch (err) {
        console.error("Error fetching latest images", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-6 block font-bold">Our Story</span>
          <h1 className="text-6xl md:text-9xl font-serif font-bold italic tracking-tighter leading-none uppercase">
            Passion <br /> & <span className="text-zinc-400">Purpose</span>
          </h1>
        </motion.div>

        {/* SECTION 1: Image Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {latestImages[0] ? (
              <img src={latestImages[0].url} className="w-full h-full object-cover" alt="About Devi Studio" />
            ) : (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 animate-pulse"></div>
            )}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight uppercase leading-tight">
              Capturing life's <br /> most precious <br /> <span className="text-zinc-400">milestones.</span>
            </h2>
            <p className="text-xl font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              Founded on the belief that every moment holds a story worth telling, Devi Studio has spent years perfecting the art of cinematic storytelling. We don't just take photos; we preserve emotions.
            </p>
            <p className="text-lg font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              Our team of dedicated artists works tirelessly to ensure that your special day—whether it's a wedding, a newborn's first smile, or a professional portfolio—is captured with the highest level of detail and care.
            </p>
          </motion.div>
        </div>

        {/* SECTION 2: Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight uppercase leading-tight">
              Our <br /> Philosophy <br /> <span className="text-zinc-400">& Vision.</span>
            </h2>
            <p className="text-xl font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
              We believe in authenticity. In the quiet glances, the loud laughter, and the tears of joy. Our vision is to provide a timeless archive of your life's most significant events, presented in a way that feels as fresh decades from now as it does today.
            </p>
            <div className="pt-6">
               <div className="h-[1px] w-20 bg-zinc-900 dark:bg-white mb-6"></div>
               <p className="font-serif italic text-2xl">"Photography is the only language that can be understood anywhere in the world."</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {latestImages[1] ? (
              <img src={latestImages[1].url} className="w-full h-full object-cover" alt="Devi Studio Vision" />
            ) : (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 animate-pulse"></div>
            )}
          </motion.div>
        </div>

        {/* SECTION 3: Full Width Quote & Image */}
        <div className="mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full h-[500px] md:h-[700px] rounded-[4rem] overflow-hidden shadow-2xl mb-20"
          >
            {latestImages[2] ? (
              <img src={latestImages[2].url} className="w-full h-full object-cover" alt="Devi Studio Art" />
            ) : (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-10 text-center">
                <h3 className="text-white text-3xl md:text-5xl font-serif italic max-w-4xl leading-tight">
                  "At Devi Studio, we don't just capture images. We capture the essence of who you are and the beauty of the moments you share."
                </h3>
            </div>
          </motion.div>
          
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-500 dark:text-zinc-400 italic">
              Join us in this journey of documenting the extraordinary in the ordinary. Based in Chennai | Tuticorin, available worldwide for those who value art and memory.
            </p>
            <a 
              href="/contact-us" 
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full text-[11px] font-bold tracking-[0.3em] uppercase hover:scale-105 transition-transform"
            >
              Start Your Story With Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
