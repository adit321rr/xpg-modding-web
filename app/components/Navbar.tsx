'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  // State untuk melacak apakah menu HP sedang terbuka atau tertutup
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo Kiri */}
        <div 
          className="flex items-center cursor-pointer z-50" 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsOpen(false); // Tutup menu kalau logo diklik
          }} 
        >
          <Image
              src="/images/mte26-logo.jpg" 
              alt="MTE26 Logo"
              width={100}   /* Lebar logo kita tetapkan langsung */
              height={40}   /* Tinggi logo kita tetapkan langsung */
              className="object-contain"
              priority
          />
        </div>

         {/* ========================================= */}
        {/* MENU DESKTOP (Tersembunyi di HP) */}
        {/* ========================================= */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#vote-section" className="text-sm font-bold text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
            Contestants
          </a>
          <a href="#leaderboard-section" className="text-sm font-bold text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
            Leaderboard
          </a>
          <a href="#vote-section" className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 px-6 rounded-md transition-all active:scale-95 tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            VOTE NOW
          </a>
        </div>

        {/* ========================================= */}
        {/* TOMBOL HAMBURGER MOBILE (Tersembunyi di PC) */}
        {/* ========================================= */}
        <button 
          className="md:hidden text-white p-2 focus:outline-none z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              // Ikon X (Close) kalau menu terbuka
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              // Ikon Garis Tiga (Hamburger) kalau menu tertutup
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* ========================================= */}
      {/* DROPDOWN MENU MOBILE (Animasi Framer Motion) */}
      {/* ========================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden absolute top-20 left-0 right-0 shadow-2xl"
          >
            <div className="flex flex-col px-6 pt-4 pb-8 gap-2">
              <a href="#vote-section" onClick={() => setIsOpen(false)} className="block text-center text-lg font-bold text-gray-300 hover:text-white py-4 tracking-widest uppercase border-b border-white/5">
                Contestants
              </a>
              <a href="#leaderboard-section" onClick={() => setIsOpen(false)} className="block text-center text-lg font-bold text-gray-300 hover:text-white py-4 tracking-widest uppercase border-b border-white/5">
                Leaderboard
              </a>
              <a href="#vote-section" onClick={() => setIsOpen(false)} className="mt-6 block text-center bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-4 rounded-xl active:scale-95 tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                VOTE NOW
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
}


