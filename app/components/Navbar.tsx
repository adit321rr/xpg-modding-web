'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo Kiri (Diperbaiki menggunakan ukuran pasti / Fixed Size) */}
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
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

        {/* Menu Kanan (Desktop Only) */}
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

      </div>
    </motion.nav>
  );
}