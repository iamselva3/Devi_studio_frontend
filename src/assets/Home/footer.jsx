import React from 'react'

const Footer = () => {
  return (
    <>
    <footer 
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
      className="border-t border-black/[0.03] dark:border-white/[0.03] pb-24 mt-20 transition-all duration-700"
    >

      {/* BOOK US NOW SECTION */}
      <div className="max-w-7xl mx-auto px-[1px] md:px-6">
        <div className="bg-white dark:bg-zinc-900/20 text-[var(--text-color)] p-8 md:p-24 relative overflow-hidden rounded-3xl md:rounded-[4rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border border-black/[0.03] dark:border-white/[0.03]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            <div className="text-center lg:text-left">
              <h2 className="text-5xl md:text-8xl font-serif font-bold italic mb-8 tracking-tighter leading-[0.9]">
                Ready to <br /> <span className="text-zinc-400 dark:text-zinc-600">begin?</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-lg font-light leading-relaxed mx-auto lg:mx-0">
                Let's transform your fleeting moments into timeless legacies. Our calendar fills up quickly—reach out today.
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-10">
               <div className="space-y-2 text-center lg:text-right">
                 <span className="text-zinc-300 dark:text-zinc-700 text-[10px] uppercase tracking-[0.5em] font-bold block">Quick Contact</span>
                 <a href="tel:9443961216" className="text-2xl md:text-4xl font-serif font-bold italic hover:text-zinc-400 transition-colors duration-500 block">
                   +91 9443961216
                 </a>
               </div>
               <a href="/contact-us" className="group relative bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full text-[11px] font-bold tracking-[0.3em] uppercase overflow-hidden transition-all duration-500 hover:pr-16">
                 <span className="relative z-10">Book Your Session</span>
                 <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">→</span>
               </a>
            </div>
          </div>
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-zinc-100 dark:bg-white/[0.02] rounded-full blur-[120px]"></div>
        </div>
      </div>

      {/* LINKS SECTION */}
      <div className="max-w-7xl mx-auto py-32 px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20">
        
        {/* WEDDINGS */}
        <div className="space-y-10">
          <h3 className="text-zinc-500 dark:text-white/40 text-[11px] font-bold uppercase tracking-[0.5em]">Services</h3>
          <ul className="space-y-5 text-sm text-zinc-500 dark:text-zinc-400 font-light">
            <li className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Wedding Cinema</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Bridal Portraits</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Event Coverage</li>
          </ul>
        </div>

        {/* EXPLORE */}
        <div className="space-y-10">
          <h3 className="text-zinc-500 dark:text-white/40 text-[11px] font-bold uppercase tracking-[0.5em]">Explore</h3>
          <ul className="space-y-5 text-sm text-zinc-500 dark:text-zinc-400 font-light">
            <li className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Portfolio</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Our Story</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Pricing</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="space-y-10">
          <h3 className="text-zinc-500 dark:text-white/40 text-[11px] font-bold uppercase tracking-[0.5em]">Connect</h3>
          <ul className="space-y-5 text-sm text-zinc-500 dark:text-zinc-400 font-light">
            <li className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Instagram</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Facebook</li>
            <li className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">YouTube</li>
          </ul>
        </div>

        {/* LOCATIONS */}
        <div className="space-y-10">
          <h3 className="text-zinc-500 dark:text-white/40 text-[11px] font-bold uppercase tracking-[0.5em]">Studio</h3>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
            <p className="font-serif italic text-xl text-zinc-900 dark:text-white mb-4 tracking-tight">Chennai | Tuticorin</p>
          </div>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="max-w-7xl mx-auto px-10">
        <div className="pt-12 border-t border-black/[0.03] dark:border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-400 dark:text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-medium">
          <span>© {new Date().getFullYear()} Devi Studio.</span>
          <div className="flex gap-12">
            <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>

    </>
  )
}


export default Footer
