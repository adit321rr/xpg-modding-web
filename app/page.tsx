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
          
          {/* ======================================================= */}
          {/* PERUBAHAN: Teks Hadiah yang Bold, Italic & Mencolok */}
          {/* ======================================================= */}
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-wider mb-12 mt-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            <span className="text-white">Vote & Win </span>
            {/* Tag <br> ini akan membuat enter ke bawah KHUSUS di layar HP agar tidak bertumpuk */}
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

      {/* 2. SECTION VOTE (Grid Efek Kaca) */}
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

    </main>
  );
}