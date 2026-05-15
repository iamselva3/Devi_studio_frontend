import React, { useState } from "react";
import { useTheme } from "./context/ThemeContext";
import Devi from "./assets/devi.jpg";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "WEDDINGS", path: "/weddings" },
    { name: "BABY PHOTOGRAPHY", path: "/baby-photography" },
    { name: "MODEL SHOOT", path: "/model-shoot" },
    { name: "ABOUT US", path: "/about-us" },
    { name: "CONTACT US", path: "/contact-us" },
  ];

  return (
    <nav className="w-full relative">
      <div className="
        bg-white/40 dark:bg-black/40 
        backdrop-blur-2xl 
        shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
        flex items-center justify-between 
        px-1 md:px-8 py-3 md:py-5 
        rounded-2xl md:rounded-[3rem] 
        border border-white/50 dark:border-white/10
        transition-all duration-500
      ">



        
        {/* LEFT - LOGO */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-3">
            <img src={Devi} alt="logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-serif font-bold tracking-tighter hidden sm:block text-[var(--text-color)]">DEVI STUDIO</span>
          </a>
        </div>

        {/* CENTER - DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-8 font-medium text-[11px] tracking-[0.2em] text-[var(--text-color)]">
          {menuItems.map((item) => (
            <li key={item.name} className="hover:opacity-50 transition-opacity">
              <a href={item.path}>{item.name}</a>
            </li>
          ))}
        </ul>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-4 text-[var(--text-color)]">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center hover:scale-110 transition shadow-sm border border-black/5 dark:border-white/10"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>



          {/* Desktop Call/Book */}
          <div className="hidden sm:flex items-center gap-3">
            <a href="tel:9443961216" className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 text-[10px] font-bold rounded-full tracking-widest hover:scale-105 transition">CALL</a>
            <a href="/contact-us" className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 text-[10px] font-bold rounded-full tracking-widest hover:scale-105 transition">BOOK</a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current transition ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-full h-0.5 bg-current transition ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-current transition ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-6 lg:hidden z-50 border border-black/5 dark:border-white/5"
          >
            <ul className="space-y-6 text-center font-medium tracking-[0.2em] text-xs">
              {menuItems.map((item) => (
                <li key={item.name} onClick={() => setIsOpen(false)}>
                  <a href={item.path} className="block py-2">{item.name}</a>
                </li>
              ))}
              <hr className="border-black/5 dark:border-white/5" />
              <li className="pt-2 flex flex-col gap-4">
                <a href="tel:9443961216" className="bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold">CALL 9443961216</a>
                <a href="/contact-us" className="bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold">BOOK US NOW</a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

