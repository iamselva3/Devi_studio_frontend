import React from "react";
import Devi from "./assets/devi.jpg"

const Navbar = () => {
  return (
<nav className="w-full bg-white shadow flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-4 sm:px-6 py-3">

  {/* LEFT - LOGO */}
  <div className="flex items-center">
    <img src={Devi} alt="logo" className="w-12 h-12 object-contain" />
  </div>

  {/* CENTER - MENU */}
  <ul className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-8 font-medium">

    <li className="relative group cursor-pointer">
      <span>WEDDINGS</span>
      <ul className="absolute left-0 mt-2 w-40 sm:w-48 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <li className="px-4 py-2 hover:bg-gray-100">Traditional Wedding</li>
        <li className="px-4 py-2 hover:bg-gray-100">Candid Wedding</li>
        <li className="px-4 py-2 hover:bg-gray-100">Outdoor Wedding</li>
      </ul>
    </li>

    <li className="relative group cursor-pointer">
      <span>BABY PHOTOGRAPHY</span>
      <ul className="absolute left-0 mt-2 w-40 sm:w-48 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <li className="px-4 py-2 hover:bg-gray-100">Newborn Shoot</li>
        <li className="px-4 py-2 hover:bg-gray-100">1st Birthday</li>
      </ul>
    </li>

    <li className="relative group cursor-pointer">
      <span>GALLERY</span>
      <ul className="absolute left-0 mt-2 w-40 sm:w-48 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <li className="px-4 py-2 hover:bg-gray-100">Photos</li>
        <li className="px-4 py-2 hover:bg-gray-100">Videos</li>
      </ul>
    </li>

    <li className="relative group cursor-pointer">
      <span>DESTINATION WEDDINGS</span>
      <ul className="absolute left-0 mt-2 w-52 sm:w-56 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <li className="px-4 py-2 hover:bg-gray-100">Goa</li>
        <li className="px-4 py-2 hover:bg-gray-100">Kerala</li>
      </ul>
    </li>
  </ul>

  {/* RIGHT - BUTTONS */}
  <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3 md:gap-4">

    <button className="bg-black text-white px-4 py-2 font-semibold rounded w-full md:w-auto">
      SHOP
    </button>

    <button className="bg-black text-white px-4 py-2 font-semibold rounded w-full md:w-auto">
      CALL 9840767566
    </button>

    <button className="bg-black text-white px-4 py-2 font-semibold rounded w-full md:w-auto">
      BOOK US NOW
    </button>

  </div>

</nav>

  );
};

export default Navbar;
