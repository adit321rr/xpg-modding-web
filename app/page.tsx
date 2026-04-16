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
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Background kembali hanya di sini) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        
        {/* === BACKGROUND GAMBAR KHUSUS HERO === */}
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
      <section id="vote-section" className="py-24 px-4 relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">The Contestants</h2>
          <p className="text-gray-500 text-lg">Witness the craftsmanship. Your single vote matters.</p>
        </div>
        
        <ContestantGrid contestants={contestants || []} />
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION JUDGES & MENTORS (Diubah jadi 1 Slot Super Premium) */}
      {/* ========================================================================= */}
      <section id="judges-section" className="py-24 px-4 relative z-10 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Judges */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg border border-red-500/30 bg-red-500/10 mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
               <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">
              Judges & <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">Mentors</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Expert evaluators overseeing the modding contest with years of experience.</p>
          </div>

          {/* Single Premium Card */}
          <div className="max-w-md mx-auto">
             <div className="bg-[#050505] border border-red-600/50 rounded-2xl p-10 flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.2)] group hover:border-red-500 hover:shadow-[0_0_60px_rgba(220,38,38,0.3)] transition-all duration-500">
                
                {/* Garis Merah Atas */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-70"></div>
                
                {/* Badge Head Judge */}
                <div className="absolute top-5 right-5 border border-red-500 text-red-500 text-[10px] font-bold px-3 py-1 uppercase tracking-widest bg-red-500/10 rounded-sm flex items-center gap-1">
                   ★ JUDGE
                </div>
                
                {/* Efek Titik-titik (Dot Pattern) di belakang foto */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px] pointer-events-none"></div>

                {/* Lingkaran Avatar / Tameng */}
                <div className="w-48 h-48 rounded-full border-2 border-red-500/40 mb-8 bg-[#0a0a0a] flex flex-col items-center justify-center relative z-10 shadow-[0_0_30px_rgba(220,38,38,0.2)] group-hover:scale-105 group-hover:border-red-500 transition-all duration-500">
                   <svg className="w-14 h-14 text-red-800 mb-3 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                   <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold group-hover:text-gray-400">Photo Coming Soon</span>
                </div>
                
                {/* Detail Juri */}
                <h3 className="text-3xl font-black text-white mb-2 tracking-wider uppercase relative z-10 group-hover:text-red-500 transition-colors">WaroQ</h3>
                <p className="text-red-600 text-sm font-bold uppercase tracking-widest mb-3 relative z-10">Head Judge & Mentor</p>
                <p className="text-gray-500 text-sm mb-10 relative z-10">PC Modding Expert</p>

                {/* Indikator Keahlian (Build, Cable, Aesth) */}
                <div className="flex gap-3 relative z-10 w-full justify-center">
                  <div className="px-5 py-2 border border-red-900/50 bg-red-900/10 text-xs text-gray-300 font-mono tracking-widest rounded shadow-inner">BUILD</div>
                  <div className="px-5 py-2 border border-red-900/50 bg-red-900/10 text-xs text-gray-300 font-mono tracking-widest rounded shadow-inner">CABLE</div>
                  <div className="px-5 py-2 border border-red-900/50 bg-red-900/10 text-xs text-gray-300 font-mono tracking-widest rounded shadow-inner">AESTH</div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 4. SECTION LEADERBOARD */}
      <section id="leaderboard-section" className="py-24 px-4 bg-[#050505] border-t border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Live Leaderboard</h2>
          <p className="text-gray-500 text-lg">Real-time voting results.</p>
        </div>
        
        <Leaderboard contestants={contestants || []} />
      </section>

      {/* 5. FOOTER SECTION */}
      <footer className="bg-[#0a0a0a] border-t border-red-900/30 pt-20 pb-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 mb-16">
          
          <div>
            <div className="mb-6">
              <Image
                  src="/images/mte26-logo.jpg" 
                  alt="MTE26 Logo"
                  width={190}   
                  height={40}   
                  className="object-contain object-left" 
                  priority
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed pr-4 mt-2">
              The premier PC modding competition in Indonesia. Showcasing creativity, craftsmanship, and extreme builds powered by XPG ADATA.
            </p>
          </div>

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