import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ClientGallery = () => {
  const { clientName } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchClientPhotos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${clientName}`);
        setClient(res.data.data);
      } catch (err) {
        console.error("Error fetching client photos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientPhotos();
  }, [clientName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-black/10 dark:border-white/10 border-t-black dark:border-t-white rounded-full"
        />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-serif mb-4">Client Not Found</h2>
        <p className="text-zinc-500">The requested gallery could not be located.</p>
      </div>
    );
  }

  const bannerImage = client.images.find(img => img.category === "banners") || client.images[0];

  return (
    <div className="min-h-screen">
      {/* Cinematic Banner */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-6 mt-4">
        <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden rounded-[2.5rem] shadow-2xl">
            <img 
                src={bannerImage?.url} 
                alt={client.clientName} 
                className="w-full h-full object-cover scale-105 animate-[zoom_25s_infinite_alternate] opacity-60" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/60 text-[10px] md:text-xs tracking-[0.5em] uppercase mb-4"
                >
                    Photography Collection
                </motion.span>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-7xl font-serif font-bold uppercase tracking-widest text-white italic"
                >
                    {client.clientName}
                </motion.h1>
                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="w-32 h-[1px] bg-white/30 mt-8"
                />
            </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-serif italic dark:text-zinc-300">The Gallery</h2>
            <div className="h-[1px] flex-grow bg-black/5 dark:bg-white/5 mx-8"></div>
            <span className="text-zinc-500 dark:text-zinc-600 text-[10px] uppercase tracking-widest">{client.images.length} Assets</span>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {client.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-zinc-900/5 border border-black/5 dark:border-white/5"
              onClick={() => setSelectedImage(image.url)}
            >
              <img 
                src={image.url} 
                alt={`Gallery ${index}`} 
                className="w-full h-auto transition duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}</style>


      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
            />
            <button 
              className="absolute top-10 right-10 text-white text-4xl hover:scale-110 transition"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export default ClientGallery;
