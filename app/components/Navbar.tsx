'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault(); 
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    setIsOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        <div 
          className="flex items-center cursor-pointer z-50" 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsOpen(false);
          }} 
        >
          <Image
              src="/images/mte26-logo.webp" 
              alt="Logo MTE26"
              width={100}   
              height={40}   
              className="object-contain"
              priority
          />
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#vote-section" onClick={(e) => handleScroll(e, 'vote-section')} className="text-sm font-bold text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
            Peserta
          </a>
          <a href="#judges-section" onClick={(e) => handleScroll(e, 'judges-section')} className="text-sm font-bold text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
            Juri & Mentor
          </a>
          <a href="#leaderboard-section" onClick={(e) => handleScroll(e, 'leaderboard-section')} className="text-sm font-bold text-gray-400 hover:text-white transition-colors tracking-widest uppercase">
            Klasemen
          </a>
          <a href="#vote-section" onClick={(e) => handleScroll(e, 'vote-section')} className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 px-6 rounded-md transition-all active:scale-95 tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            VOTE SEKARANG
          </a>
        </div>

        {/* TOMBOL HAMBURGER MOBILE */}
        <button 
          className="md:hidden text-white p-2 focus:outline-none z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* DROPDOWN MENU MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden absolute top-20 left-0 right-0 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          >
            <div className="flex flex-col px-6 pt-4 pb-8 gap-2 relative z-50">
              <a href="#vote-section" onClick={(e) => handleScroll(e, 'vote-section')} className="block text-center text-lg font-bold text-gray-300 hover:text-white py-4 tracking-widest uppercase border-b border-white/5">
                Peserta
              </a>
              <a href="#judges-section" onClick={(e) => handleScroll(e, 'judges-section')} className="block text-center text-lg font-bold text-gray-300 hover:text-white py-4 tracking-widest uppercase border-b border-white/5">
                Juri & Mentor
              </a>
              <a href="#leaderboard-section" onClick={(e) => handleScroll(e, 'leaderboard-section')} className="block text-center text-lg font-bold text-gray-300 hover:text-white py-4 tracking-widest uppercase border-b border-white/5">
                Klasemen
              </a>
              <a href="#vote-section" onClick={(e) => handleScroll(e, 'vote-section')} className="mt-6 block text-center bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-4 rounded-xl active:scale-95 tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                VOTE SEKARANG
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
}