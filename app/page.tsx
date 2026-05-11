import { supabase } from "../lib/supabase";
import ContestantGrid from "./components/ContestantGrid";
import Leaderboard from "./components/Leaderboard";
import Navbar from "./components/Navbar";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const revalidate = 0;

export default async function Home() {
  const { data: contestants, error } = await supabase
    .from("contestants")
    .select("*");

  if (error) {
    return (
      <div className="text-white p-10 text-center">
        Gagal memuat data. Pastikan koneksi internet aman.
      </div>
    );
  }
  // =========================================================================
  // SAKLAR MAINTENANCE (Ubah jadi 'false' kalau web sudah siap dibuka lagi)
  // =========================================================================
  const isMaintenance = true;

  if (isMaintenance) {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/bg-hero.webp"
            alt="Background"
            className="w-full h-full object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
        </div>

        <div className="relative z-10 text-center flex flex-col items-center max-w-2xl mx-auto mt-[-50px]">
          <img
            src="/images/mte25-logo.webp"
            alt="Logo MTE"
            className="w-[300px] md:w-[450px] mb-8 drop-shadow-[0_0_25px_rgba(220,38,38,0.3)]"
          />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-400 text-xs font-bold tracking-[0.2em] mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            UNDER MAINTENANCE
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider mb-6 drop-shadow-xl">
            Sistem Sedang <span className="text-red-500">Ditingkatkan</span>
          </h1>
          
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-2xl mb-10">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Mohon maaf, platform voting XPG ADATA PC Modding Contest sedang dalam pemeliharaan rutin untuk sinkronisasi dan peningkatan keamanan data. 
              <br/><br/>
              Kami akan kembali beroperasi normal dalam waktu kurang lebih <strong className="text-white bg-red-600/20 px-2 py-1 rounded">2 jam</strong>. Terima kasih atas kesabaran Anda.
            </p>
          </div>
          
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
        </div>
      </main>
    );
  }
  // =========================================================================
  // REVISI URUTAN CUSTOM (Sesuai Request ADATA XPG)
  // =========================================================================
  const orderMap: { [key: string]: number } = {
    "wimodz.tech": 1,
    MonsParmodd: 2,
    Rakazone21: 3,
    "Kim Jong Tep": 4,
    HelixCustom: 5,
  };

  const sortedContestants = contestants?.sort((a, b) => {
    const orderA = orderMap[a.name] || 99;
    const orderB = orderMap[b.name] || 99;
    return orderA - orderB;
  });

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-hero.webp"
            alt="Background XPG Mod Battle"
            fill
            className="object-cover object-top opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/60 to-[#050505]"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-900/30 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-bold tracking-[0.2em] mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            OFFICIAL EVENT BY XPG ADATA
          </div>

          <div className="relative mb-8 drop-shadow-[0_0_25px_rgba(220,38,38,0.3)] flex justify-center">
            <Image
              src="/images/mte25-logo.webp"
              alt="Logo Mod To Xtreme 2026"
              width={600}
              height={300}
              className="w-[350px] md:w-[600px] h-auto object-contain"
              priority
            />
          </div>

          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-wider mb-12 mt-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            <span className="text-white">Pilih & Menangkan </span>
            <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]">
              Rp 16 JUTA!
            </span>
          </h2>

          {/* DIBUAT JADI 2 KOTAK AGAR RAPI SESUAI PERMINTAAN KLIEN */}
          <div className="mb-12 flex flex-col md:flex-row gap-6 justify-center w-full max-w-3xl">
            <div className="border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl flex-1 text-left md:text-center">
              <p className="text-white text-sm md:text-base mb-1">Periode voting: <strong>7 - 18 Mei 2026</strong></p>
              <p className="text-white text-sm md:text-base">Pengumuman pemenang: <strong>25 Mei 2026</strong></p>
            </div>
            <div className="border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl flex-1 text-left md:text-center">
              <p className="text-red-500 font-bold tracking-widest uppercase text-xs mb-2">Syarat Ikut Undian Hadiah:</p>
              <p className="text-white text-sm md:text-base">Upload poster bukti voting ke Instagram Story dan tag <strong>@adataxpgindonesia</strong></p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="#vote-section"
              className="neon-glow bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-10 rounded-xl transition-all active:scale-95 text-center tracking-wide shadow-2xl"
            >
              TONTON & VOTE
            </a>
            <a
              href="#leaderboard-section"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-10 rounded-xl transition-all active:scale-95 text-center tracking-wide"
            >
              HASIL LIVE
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION VOTE */}
      {/* ========================================================================= */}
      <section
        id="vote-section"
        className="pt-24 pb-12 px-4 relative z-10 bg-[#050505]"
      >
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            5 Kontestan
          </h2>
          <p className="text-gray-500 text-lg">
            Pilih juara favoritmu! Satu suaramu sangat berharga
          </p>
        </div>

        <ContestantGrid contestants={sortedContestants || []} />
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION JUDGES & MENTORS */}
      {/* ========================================================================= */}
      <section
        id="judges-section"
        className="pt-12 pb-24 px-4 relative z-0 bg-[#050505]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-center flex flex-col md:flex-row items-center justify-center md:gap-3">
              <span className="text-white">JURI & MENTOR:</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 drop-shadow-[0_0_15px_rgba(220,38,38,0.6)] mt-1 md:mt-0">
                WAROQ
              </span>
            </h2>
            <p className="mt-4 text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Indonesian Professional PC modder
            </p>
          </div>

          <div className="w-[320px] md:w-[400px] mx-auto relative group mt-10">
            <div className="absolute inset-0 bg-red-600 rounded-[2rem] blur-[30px] md:blur-[40px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>

            <div className="relative w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transform group-hover:-translate-y-4 group-hover:scale-[1.02] transition-all duration-500 drop-shadow-[0_20px_40px_rgba(220,38,38,0.4)] cursor-crosshair">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out z-20 pointer-events-none"></div>

              <Image
                src="/images/waroq-card.webp"
                alt="Kartu Ketua Juri WaroQ"
                width={800}
                height={1200}
                className="w-full h-auto object-cover block"
                priority
              />
            </div>
            {/* TULISAN "KETUA JURI" DI BAWAH SINI SUDAH DIHAPUS SESUAI REVISI */}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION LEADERBOARD */}
      {/* ========================================================================= */}
      <section
        id="leaderboard-section"
        className="py-24 px-4 bg-[#0a0a0a] border-t border-white/5 relative z-0"
      >
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight uppercase">
            LEADERBOARD
          </h2>
          <p className="text-gray-500 text-lg">
            Hasil pemungutan suara secara real-time.
          </p>
        </div>

        <Leaderboard
          contestants={
            contestants?.sort((a, b) => b.vote_count - a.vote_count) || []
          }
        />
      </section>

      {/* ========================================================================= */}
      {/* 5. FOOTER SECTION */}
      {/* ========================================================================= */}
      <footer className="bg-[#0a0a0a] border-t border-red-900/30 pt-20 pb-8 px-4 relative z-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 mb-16">
          {/* Kolom Kiri: Logo & Deskripsi */}
          <div>
            <div className="mb-6">
              <Image
                src="/images/mte25-logo.webp"
                alt="Logo MTE26"
                width={190}
                height={40}
                className="object-contain object-left"
                priority
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed pr-4 mt-2">
              Kompetisi PC modding di Indonesia yang disponsori oleh XPG ADATA. Menghadirkan 5 modder kreatif yang memodifikasi PC untuk memperebutkan gelar juara.
            </p>
          </div>

          {/* Kolom Tengah: Sosial Media */}
          <div>
            <h4 className="text-red-600 font-bold tracking-widest mb-6 uppercase text-sm">
              Ikuti Kami
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/adataxpgindonesia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group"
              >
                <div>
                  <p className="text-white font-bold text-sm">Instagram</p>
                  <p className="text-gray-500 text-xs mt-1">
                    @adataxpgindonesia
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@adataxpg.id?is_from_webapp=1&sender_device=pc"
                className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group"
              >
                <div>
                  <p className="text-white font-bold text-sm">TikTok</p>
                  <p className="text-gray-500 text-xs mt-1">@adataxpgindonesia</p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1DvjkLg1Dz/?mibextid=wwXIfr"
                className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group"
              >
                <div>
                  <p className="text-white font-bold text-sm">Facebook</p>
                  <p className="text-gray-500 text-xs mt-1">ADATAINDONESIA</p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Info Kontes */}
          <div>
            <h4 className="text-red-600 font-bold tracking-widest mb-6 uppercase text-sm">
              Info Kontes
            </h4>
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <p className="text-white font-bold text-sm uppercase tracking-wider">
                  TOTAL HADIAH
                </p>
                <p className="text-red-500 text-xs mt-1 font-mono tracking-widest">
                  Rp 16.000.000 untuk 32 pemenang
                </p>
              </div>

              {/* DUPLIKASI DIHAPUS, TERSISA 1 PESERTA SAJA */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <p className="text-white font-bold text-sm uppercase tracking-wider">
                  PESERTA
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  5 Modders Profesional
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <p className="text-white font-bold text-sm uppercase tracking-wider">
                  PERIODE VOTING
                </p>
                <p className="text-gray-400 text-xs mt-1">7-18 Mei 2026</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <p className="text-white font-bold text-sm uppercase tracking-wider">
                  PENGUMUMAN PEMENANG
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  25 Mei 2026 di media sosial XPG ADATA
                </p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <p className="text-white font-bold text-sm uppercase tracking-wider">
                  SYARAT IKUT HADIAH
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Upload poster bukti voting di Instagram Story dan tag @adataxpgindonesia. Klaim hadiah maksimal 1 bulan setelah pengumuman pemenang.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-gray-600 text-xs tracking-wider text-center md:text-left">
            © 2026 XPG ADATA Indonesia. Hak cipta dilindungi undang-undang.
            Kontes PC Modding.
          </p>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span className="text-gray-500 text-xs tracking-widest uppercase font-bold">
              Sistem Voting Aktif
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}