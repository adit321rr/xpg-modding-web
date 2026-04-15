import { supabase } from '../lib/supabase';
import ContestantGrid from './components/ContestantGrid';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';

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
      
      {/* 2. PANGGIL NAVBAR DI SINI (Paling Atas) */}
      <Navbar />
      
      {/* 1. HERO SECTION (Gradasi Cahaya & Elegan - SEKARANG FULL SCREEN) */}
      {/* PERUBAHAN: Tambah min-h-screen, flex, flex-col, items-center, justify-center */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        
        {/* Efek Cahaya Latar Belakang (Disesuaikan agar posisinya tepat di tengah layar) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-900/30 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-bold tracking-[0.2em] mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            ADATA XPG OFFICIAL EVENT
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase drop-shadow-2xl">
            PC MOD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-red-600 to-red-900 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              BATTLE 2026
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Six visionary builders. One ultimate crown. Watch the extreme builds, cast your vote, and decide the champion.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="#vote-section" className="neon-glow bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-10 rounded-xl transition-all active:scale-95 text-center tracking-wide">
              WATCH & VOTE
            </a>
            <a href="#leaderboard-section" className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold py-4 px-10 rounded-xl transition-all active:scale-95 text-center tracking-wide">
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