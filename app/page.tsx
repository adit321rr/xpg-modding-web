import { supabase } from '../lib/supabase';
import ContestantGrid from './components/ContestantGrid';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';
import Image from 'next/image'; 

export const revalidate = 0;

export default async function Home() {
  const { data: contestants, error } = await supabase
    .from('contestants')
    .select('*')
    .order('vote_count', { ascending: false }) 
    .order('id', { ascending: true }); 

  if (error) {
    return <div className="text-white p-10 text-center">Gagal memuat data. Pastikan koneksi aman.</div>;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* PANGGIL NAVBAR DI SINI (Paling Atas) */}
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        
        {/* === BACKGROUND GAMBAR === */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/bg-hero.jpg" 
            alt="XPG Mod Battle Background"
            fill
            className="object-cover object-top opacity-30" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/60 to-[#050505]"></div>
        </div>

        {/* Efek Cahaya Latar Belakang */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-900/30 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-bold tracking-[0.2em] mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            ADATA XPG OFFICIAL EVENT
          </div>
          
          {/* Image Logo MTE25 */}
          <div className="relative mb-8 drop-shadow-[0_0_25px_rgba(220,38,38,0.3)] flex justify-center">
             <Image 
                src="/images/mte25-logo.jpg" 
                alt="Mod To Xtreme 2026 Logo"
                width={600}
                height={300}
                className="w-[350px] md:w-[600px] h-auto object-contain" 
                priority
             />
          </div>
          
          {/* Teks Hadiah yang Bold, Italic & Mencolok */}
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-wider mb-12 mt-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            <span className="text-white">Vote & Win </span>
            <br className="md:hidden" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]">
              IDR 16 Million!
            </span>
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="#vote-section" className="neon-glow bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-10 rounded-xl transition-all active:scale-95 text-center tracking-wide shadow-2xl">
              WATCH & VOTE
            </a>
            <a href="#leaderboard-section" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-10 rounded-xl transition-all active:scale-95 text-center tracking-wide">
              LIVE RESULTS
            </a>
          </div>
        </div>
      </section>

      {/* 2. SECTION VOTE */}
      <section id="vote-section" className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">The Contestants</h2>
          <p className="text-gray-500 text-lg">Witness the craftsmanship. Your single vote matters.</p>
        </div>
        
        <ContestantGrid contestants={contestants || []} />
      </section>

      {/* 3. SECTION LEADERBOARD */}
      <section id="leaderboard-section" className="py-24 px-4 bg-[#0a0a0a] border-t border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Live Leaderboard</h2>
          <p className="text-gray-500 text-lg">Real-time voting results.</p>
        </div>
        
        <Leaderboard contestants={contestants || []} />
      </section>

      {/* ========================================================================= */}
      {/* 4. FOOTER SECTION (BARU DITAMBAHKAN) */}
      {/* ========================================================================= */}
      <footer className="bg-[#050505] border-t border-red-900/30 pt-20 pb-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 mb-16">
          
          {/* Kolom 1: Logo & Deskripsi */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-md flex items-center justify-center transform -skew-x-12 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <svg className="w-7 h-7 text-white transform skew-x-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-black text-2xl tracking-widest leading-none uppercase">XPG ADATA</h3>
                <p className="text-red-600 text-sm font-bold tracking-widest uppercase mt-1">MOD TO XTREME</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed pr-4">
              The premier PC modding competition in Indonesia. Showcasing creativity, craftsmanship, and extreme builds powered by XPG ADATA.
            </p>
          </div>

          {/* Kolom 2: Follow Us */}
          <div>
            <h4 className="text-red-600 font-bold tracking-widest mb-6 uppercase text-sm">Follow Us</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group">
                <div>
                  <p className="text-white font-bold text-sm">Instagram</p>
                  <p className="text-gray-500 text-xs mt-1">@adataxpgindonesia</p>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <a href="#" className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group">
                <div>
                  <p className="text-white font-bold text-sm">TikTok</p>
                  <p className="text-gray-500 text-xs mt-1">@adataxpg.id</p>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <a href="#" className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group">
                <div>
                  <p className="text-white font-bold text-sm">Facebook</p>
                  <p className="text-gray-500 text-xs mt-1">ADATAINDONESIA</p>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>

          {/* Kolom 3: Contest Info */}
          <div>
            <h4 className="text-red-600 font-bold tracking-widest mb-6 uppercase text-sm">Contest Info</h4>
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <p className="text-white font-bold text-sm uppercase tracking-wider">Prize Pool</p>
                <p className="text-red-500 text-xs mt-1 font-mono tracking-widest">IDR 16,000,000</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <p className="text-white font-bold text-sm uppercase tracking-wider">Participants</p>
                <p className="text-gray-400 text-xs mt-1">5 Elite Modders</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <p className="text-white font-bold text-sm uppercase tracking-wider">Voted By</p>
                <p className="text-gray-400 text-xs mt-1">The Community</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar: Copyright & Status */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-gray-600 text-xs tracking-wider">
            © 2026 XPG ADATA Indonesia. All rights reserved. PC Modding Contest.
          </p>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span className="text-gray-500 text-xs tracking-widest uppercase font-bold">Voting System Active</span>
          </div>
        </div>
      </footer>

    </main>
  );
}