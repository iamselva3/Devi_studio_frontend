import React from 'react'
import Sample from "../images/Banner.png"
import Stats from './stats.jsx';


const Home = () => {
  return (
    <div>
      <section className="w-full max-w-8xl  px-6 sm:px-6 py-16 md:py-24">
        {/* Top title */}
        <p className="text-gray-500 tracking-widest text-sm mb-4">
          HELLO, WE ARE GLAD YOU FOUND US!
        </p>

        {/* Main Title */}
        <h1 className="text-3xl text-white md:text-5xl font-serif font-bold mb-10 leading-snug">
          Welcome to Devi Studio!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* LEFT CONTENT */}
          <div className="pr-4">

            {/* <h2 className='text-xl text-white md:text-xl font-serif font-bold mb-10 leading-snug'> Wedding Photography: </h2> */}
            <p className="text-gray-600 text-lg text-left mb-6">
              At Devi Studio, we believe your wedding story deserves to be told
              with honesty, elegance, and heart. Our journey began with a simple
              passion — capturing emotions that last a lifetime. Today, we are
              proud to be one of the most trusted wedding photography studios,
              creating meaningful visual memories for couples across the
              country.
            </p>

            <p className="text-gray-600 text-lg text-left mb-6">
              Our approach is natural, participatory, and completely centered
              around you. From the quiet moments of getting ready to the lively
              celebrations with family, our photographers blend seamlessly into
              your wedding, guiding you with effortless comfort while
              documenting every detail that makes your day truly yours. We’ve
              crafted hundreds of love stories through our lenses, each unique
              and unforgettable.
            </p>

            {/* <p className="text-gray-600 text-lg text-left">
              At Devi Studio, we don’t just take photos — we preserve feelings.
              Every frame is crafted with care, passion, and an artistic eye
              that brings your memories to life. Our team’s commitment is to
              ensure that when you look back at your photographs, you relive the
              joy, laughter, and emotion of your special day all over again.
            </p> */}
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center md:justify-end">
            <img
              src={Sample}
              alt="Wedding Photography"
              className="rounded-3xl shadow-lg w-full md:w-[90%] h-98 object-cover"
            />
          </div>
        </div>

           <div className="grid grid-cols-1 md:grid-cols-2 mt-20 gap-10 items-start">
          <div className="flex justify-center md:justify-start">
            <img
              src={Sample}
              alt="Wedding Photography"
              className="rounded-3xl shadow-lg w-full md:w-[70%] object-cover"
            />
          </div>
          {/* LEFT CONTENT */}
          <div className="pr-4">
            <p className="text-gray-600 text-lg text-left mb-6">
              At Devi Studio, we believe your wedding story deserves to be told
              with honesty, elegance, and heart. Our journey began with a simple
              passion — capturing emotions that last a lifetime. Today, we are
              proud to be one of the most trusted wedding photography studios,
              creating meaningful visual memories for couples across the
              country.
            </p>

            <p className="text-gray-600 text-lg text-left mb-6">
              Our approach is natural, participatory, and completely centered
              around you. From the quiet moments of getting ready to the lively
              celebrations with family, our photographers blend seamlessly into
              your wedding, guiding you with effortless comfort while
              documenting every detail that makes your day truly yours. We’ve
              crafted hundreds of love stories through our lenses, each unique
              and unforgettable.
            </p>

            <p className="text-gray-600 text-lg text-left">
              At Devi Studio, we don’t just take photos — we preserve feelings.
              Every frame is crafted with care, passion, and an artistic eye
              that brings your memories to life. Our team’s commitment is to
              ensure that when you look back at your photographs, you relive the
              joy, laughter, and emotion of your special day all over again.
            </p>
          </div>

          {/* RIGHT IMAGE */}
        </div>
      </section>
        <div className='w-full'>
            <Stats />
        </div>
    </div>
  );
}

export default Home
