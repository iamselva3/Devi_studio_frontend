import React from 'react'

const Footer = () => {
  return (
    <>
    <footer className="bg-zinc-100 dark:bg-zinc-900/10 border-t border-black/5 dark:border-white/5 pb-20">

      {/* BOOK US NOW SECTION */}
      <div className="bg-white dark:bg-white/5 text-[var(--text-color)] p-8 md:p-20 relative overflow-hidden mx-4 md:mx-6 rounded-[3.5rem] mt-20 shadow-2xl border border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 text-center lg:text-left">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold italic mb-6 tracking-tighter">Let's create magic.</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-lg font-light">
              Ready to capture your special moments? Get in touch and let us tell your story through our lens.
            </p>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-6">
             <span className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-[0.3em] font-bold">Call us directly</span>
             <a href="tel:9840767566" className="text-3xl md:text-6xl font-serif font-bold italic hover:opacity-50 transition duration-500">
               +91 9840767566
             </a>
             <a href="/contact-us" className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition duration-500 mt-4">
               Book Session Now
             </a>
          </div>
        </div>
      </div>

      {/* LINKS SECTION */}
      <div className="max-w-7xl mx-auto py-24 px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
        
        {/* WEDDINGS */}
        <div className="space-y-8">
          <h3 className="text-zinc-900 dark:text-white text-[10px] font-bold uppercase tracking-[0.4em]">Weddings</h3>
          <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400 font-light">
            <li className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Outdoor Wedding</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Muslim Wedding</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Christian Wedding</li>
          </ul>
        </div>

        {/* GALLERY */}
        <div className="space-y-8">
          <h3 className="text-zinc-900 dark:text-white text-[10px] font-bold uppercase tracking-[0.4em]">Gallery</h3>
          <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400 font-light">
            <li className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Bridal Portraits</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Couple Portraits</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Groom Portraits</li>
          </ul>
        </div>

        {/* OUTDOOR */}
        <div className="space-y-8">
          <h3 className="text-zinc-900 dark:text-white text-[10px] font-bold uppercase tracking-[0.4em]">Outdoor</h3>
          <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400 font-light">
            <li className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Pre-wedding</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Post-wedding</li>
          </ul>
        </div>

        {/* LOCATIONS */}
        <div className="space-y-8">
          <h3 className="text-zinc-900 dark:text-white text-[10px] font-bold uppercase tracking-[0.4em]">Locations</h3>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
            <p className="font-bold text-zinc-900 dark:text-white mb-2 italic">Vellore, Tamil Nadu</p>
            <p>No 61, Vellore–Katpadi main road,</p>
            <p>Vellore, 632007.</p>
          </div>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="pt-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-400 dark:text-zinc-600 text-[9px] uppercase tracking-[0.3em]">
          <span>© {new Date().getFullYear()} Devi Studio. All Rights Reserved.</span>
          <div className="flex gap-8">
            <span className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}


export default Footer
