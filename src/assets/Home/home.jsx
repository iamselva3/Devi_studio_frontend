import React from 'react'
import Sample from "../images/1.png"
import Stats from './stats.jsx';
import Testimonials from './testimonal.jsx';
import Footer from './footer.jsx';
import HeroShowcase from './Carosel.jsx';
import ClientCards from './ClientCards.jsx';


const Home = () => {
  return (
    <div>
        
      <section className="w-full max-w-7xl mx-auto px-[1px] md:px-6 py-12 md:py-24">
        {/* Top title */}
        <p className="text-zinc-500 dark:text-zinc-400 tracking-[0.3em] text-[10px] md:text-xs mb-4 uppercase">
          Hello, we are glad you found us!
        </p>

        {/* Main Title */}
        <h1 className="text-4xl md:text-7xl font-serif font-bold mb-10 leading-tight italic tracking-tighter">
          Welcome to <br className="md:hidden" /> Devi Studio!
        </h1>
      </section>

      <div className="w-full">
        <HeroShowcase />
      </div>

      <section className="w-full max-w-7xl mx-auto text-center px-[1px] py-20 md:py-32">
        <h2 className="text-3xl md:text-5xl font-serif font-semibold leading-tight mb-10">
          Transforming genuine <br className="hidden sm:block" /> 
          happiness into <span className="italic font-light">eternal imagery!</span>
        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
          What is more fantastic than a perfect dreamy wedding? It is an honor
          for us to be there to witness your special day with our candid
          wedding films that you never dreamt of.
        </p>
      </section>

      <div className="w-full">
        <ClientCards />
      </div>

      <div className="w-full py-20">
        <Testimonials />
      </div>

      
    </div>
  );
}

export default Home
