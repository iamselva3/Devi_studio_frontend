import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ClientCards = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alignment, setAlignment] = useState("md:grid-cols-2 lg:grid-cols-3");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients`);
        // Filter out SYSTEM content for the portfolio cards
        setClients(res.data.data.filter(c => c.clientName !== "SYSTEM"));

        // Fetch Alignment Setting
        const settingsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings/layout_config`);
        if (settingsRes.data && settingsRes.data.value && settingsRes.data.value.cardAlignment) {
            setAlignment(settingsRes.data.value.cardAlignment);
        }
      } catch (err) {
        console.error("Error fetching clients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) return (
    <div className="py-24 px-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current opacity-20"></div>
    </div>
  );
  
  if (clients.length === 0) return null;

  return (
    <section className="py-24 px-[1px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-zinc-500 tracking-[0.3em] uppercase text-[10px] mb-4">Our Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight uppercase">Featured Clients</h2>
          </div>
          <div className="h-[1px] flex-grow bg-zinc-900 dark:bg-white/10 hidden md:block mb-4 mx-8"></div>
        </div>


        <div className={`grid grid-cols-1 gap-4 md:gap-12 ${alignment.split(' ').map(cls => cls.startsWith('grid-cols-') ? `md:${cls}` : cls).join(' ')}`}>
          {clients.map((client, index) => {
            // Find a featured image (prefer 'cards' category, or just use the first image)
            const featuredImage = client.images.find(img => img.category === "cards") || client.images[0];
            
            if (!featuredImage) return null;

            return (
              <motion.div
                key={client._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link 
                    to={`/client/${client.clientName}`} 
                    className="group block relative overflow-hidden rounded-none md:rounded-[2.5rem] aspect-[3/2] md:aspect-[4/5] bg-zinc-900 shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <img 
                    src={featuredImage.url} 
                    alt={client.clientName} 
                    className="w-full h-full object-cover transition duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition duration-700" />
                  
                  {/* Glass Content */}
                  <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 p-4 md:p-6 rounded-none md:rounded-[2rem] bg-black/20 backdrop-blur-md border border-white/10 translate-y-2 group-hover:translate-y-0 transition duration-700">
                    <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-2">View Gallery</p>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
                      {client.clientName}
                    </h3>
                  </div>

                  {/* Corner Icon */}
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClientCards;
