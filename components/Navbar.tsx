'use client';

import { useState, useEffect } from 'react';
import { Dancing_Script } from 'next/font/google';
import { FaCircleUser } from "react-icons/fa6";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock or unlock scroll on menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [menuOpen]);

  return (
    <div className="relative w-screen">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full h-[60px] flex justify-between items-center px-4 z-[50] bg-white">
        {/* Logo */}
        <div className={`${dancingScript.className} font-bold text-2xl`}>
          Try me
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6">
          <li className="cursor-pointer hover:font-semibold">Home</li>
          <li className="cursor-pointer hover:font-semibold">Product</li>
          <li className="cursor-pointer hover:font-semibold">Category</li>
          <li className="cursor-pointer hover:font-semibold">Contact</li>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4 pr-2">
          <span className="cursor-pointer hidden md:inline">Cart (0)</span>
          <FaCircleUser size={25} className="cursor-pointer hidden md:inline" />
          {/* Hamburger menu for mobile */}
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <RxCross1 size={24} /> : <RxHamburgerMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[60px] bg-white left-0 w-full h-screen z-[40] flex flex-col items-start pt-8 pl-8 space-y-6 text-sm border-t border-gray-400">
          <span className="cursor-pointer" onClick={() => setMenuOpen(false)}>Home</span>
          <span className="cursor-pointer" onClick={() => setMenuOpen(false)}>Product</span>
          <span className="cursor-pointer" onClick={() => setMenuOpen(false)}>Category</span>
          <span className="cursor-pointer" onClick={() => setMenuOpen(false)}>Contact</span>
          <span className="cursor-pointer" onClick={() => setMenuOpen(false)}>Cart (0)</span>
          <span className="cursor-pointer" onClick={() => setMenuOpen(false)}>Profile</span>
        </div>
      )}
    </div>
  );
}
