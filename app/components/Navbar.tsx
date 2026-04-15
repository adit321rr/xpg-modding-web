'use client';

import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      // Fixed di atas, efek kaca gelap (backdrop-blur)
      className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo Kiri */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <div className="bg-red-600 p-2 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            {/* Ikon Microchip */}
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <span className="font-black text-xl tracking-wider text-white">
            XPG <span className="text-red-600">MOD BATTLE</span>
          </span>
        </div>

        {/* Menu Kanan (Sembunyi di HP, Muncul di Desktop) */}
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