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
            src="/images/bg-hero.webp" 
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
                src="/images/mte25-logo.webp" 
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
      {/* 3. SECTION JUDGES & MENTORS (PERBAIKAN KARTU WAROQ AGAR PROPOSIONAL) */}
      {/* ========================================================================= */}
      <section id="judges-section" className="py-32 px-4 relative z-10 bg-[#0a0a0a] border-t border-white/5">
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

          {/* Single Premium Image Card */}
          <div className="w-[320px] md:w-[400px] mx-auto relative group mt-10">
            
            {/* Efek Glow Merah di Belakang Kartu */}
            <div className="absolute inset-0 bg-red-600 rounded-[2rem] blur-[30px] md:blur-[40px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>

            {/* Container Gambar Kartu (w-full h-auto akan mengikuti proporsi gambar secara otomatis) */}
            <div className="relative w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transform group-hover:-translate-y-4 group-hover:scale-[1.02] transition-all duration-500 drop-shadow-[0_20px_40px_rgba(220,38,38,0.4)] cursor-crosshair">
              
              {/* Efek Kilau/Reflection putih saat di-hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out z-20 pointer-events-none"></div>

              <Image 
                src="/images/waroq-card.webp" 
                alt="WaroQ Head Judge Card"
                width={800}  /* Rasio Lebar Standar */
                height={1200} /* Rasio Tinggi Standar */
                className="w-full h-auto object-cover block" 
                priority
              />
            </div>

            {/* Tambahan kosmetik: Teks "Head Judge" melayang di bawah kartu */}
            <div className="absolute -bottom-12 left-0 right-0 text-center opacity-50 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-2">
               <p className="text-xs tracking-[0.4em] font-bold text-red-500 uppercase">Head Judge</p>
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
                  src="/images/mte26-logo.webp" 
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
              <a href="https://www.instagram.com/adataxpgindonesia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group">
                <div>
                  <p className="text-white font-bold text-sm">Instagram</p>
                  <p className="text-gray-500 text-xs mt-1">@adataxpgindonesia</p>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <a href="https://www.tiktok.com/@adataxpg.id?is_from_webapp=1&sender_device=pc" className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group">
                <div>
                  <p className="text-white font-bold text-sm">TikTok</p>
                  <p className="text-gray-500 text-xs mt-1">@adataxpg.id</p>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <a href="https://www.facebook.com/share/1DvjkLg1Dz/?mibextid=wwXIfr" className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group">
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