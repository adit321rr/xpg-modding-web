import { supabase } from "../lib/supabase";
import ContestantGrid from "./components/ContestantGrid";
import Leaderboard from "./components/Leaderboard";
import Navbar from "./components/Navbar";
import Image from "next/image";

export const revalidate = 0;

export default async function Home() {
  const isMaintenance = false;

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
          
          {/* BADGE MERAH */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-bold tracking-[0.2em] mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            VOTING DITUTUP
          </div>
          
          {/* JUDUL BESAR */}
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider mb-6 drop-shadow-xl">
            Periode Voting <br className="md:hidden" /><span className="text-red-500">Telah Berakhir</span>
          </h1>
          
          {/* KOTAK PESAN */}
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-2xl mb-8">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Terima kasih atas antusiasme dan puluhan ribu partisipasi suara Anda dalam <strong>XPG ADATA PC Modding Contest 2026</strong>. 
              <br /><br />
              Pengumpulan suara resmi ditutup. Nantikan pengumuman pemenang dan undian hadiah pada tanggal <strong className="text-white bg-red-600/20 px-2 py-1 rounded">25 Mei 2026</strong> di media sosial resmi kami.
            </p>
          </div>
          
          {/* TOMBOL KE INSTAGRAM */}
          <a
            href="https://www.instagram.com/adataxpgindonesia"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-glow bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-xl transition-all active:scale-95 text-center tracking-wider shadow-2xl flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 1.76-6.985 6.986-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.204 5.221 2.622 6.786 6.985 6.986 1.28.058 1.688.072 4.947.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-1.762 6.986-6.986.058-1.28.072-1.689.072-4.947s-.014-3.667-.072-4.947c-.204-5.22-2.622-6.785-6.986-6.986-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            CEK INSTAGRAM XPG ADATA
          </a>
        </div>
      </main>
    );
  }

  // 1. AMBIL DATA KONTESTAN MENTAH
  const { data: contestants, error } = await supabase
    .from("contestants")
    .select("*");

  if (error) {
    return (
      <div className="text-white p-10 text-center">Gagal memuat data.</div>
    );
  }

  // 2. MINTA SUPABASE MENGHITUNG JUMLAH VOTE_V2 (AKURAT & TANPA LIMIT 1000)
  const cleanCounts: { [key: number]: number } = {};
  
  if (contestants) {
    // Kita jalankan perhitungan untuk setiap kontestan secara paralel
    await Promise.all(
      contestants.map(async (c) => {
        // Menggunakan opsi { count: 'exact', head: true } agar Supabase 
        // hanya mereturn jumlah angka, tanpa mendownload baris datanya!
        const { count } = await supabase
          .from("votes_v2")
          .select("*", { count: "exact", head: true })
          .eq("contestant_id", c.id);

        cleanCounts[c.id] = count || 0;
      })
    );
  }

  const orderMap: { [key: string]: number } = {
    "wimodz.tech": 1,
    MonsParmodd: 2,
    Rakazone21: 3,
    "Kim Jong Tep": 4,
    HelixCustom: 5,
  };

  // =========================================================================
  // KUNCI TAMPILAN: Timpa vote_count kontestan dengan hasil hitungan votes_v2
  // =========================================================================
  const displayContestants =
    contestants?.map((c) => ({
      ...c,
      vote_count: cleanCounts[c.id] || 0, // Menggunakan angka pas dari V2 (misal: 1239)
    })) || [];

  // DATA UNTUK CONTESTANT GRID ATAS (Menggunakan data displayContestants yang angkanya sudah votes_v2)
  const sortedContestants = [...displayContestants].sort((a, b) => {
    const orderA = orderMap[a.name] || 99;
    const orderB = orderMap[b.name] || 99;
    return orderA - orderB;
  });

  // DATA UNTUK LEADERBOARD BAWAH (Menggunakan data displayContestants yang angkanya sudah votes_v2)
  const leaderboardData = [...displayContestants].sort(
    (a, b) => b.vote_count - a.vote_count,
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

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

          <div className="mb-12 flex flex-col md:flex-row gap-6 justify-center w-full max-w-3xl">
            <div className="border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl flex-1 text-left md:text-center">
              <p className="text-white text-sm md:text-base mb-1">
                Periode voting: <strong>7 - 18 Mei 2026</strong>
              </p>
              <p className="text-white text-sm md:text-base">
                Pengumuman pemenang: <strong>25 Mei 2026</strong>
              </p>
            </div>
            <div className="border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl flex-1 text-left md:text-center">
              <p className="text-red-500 font-bold tracking-widest uppercase text-xs mb-2">
                SYARAT VOTING SAH DAN IKUT UNDIAN HADIAH:
              </p>
              <p className="text-white text-sm md:text-base">
                Upload poster bukti voting ke Instagram Story dan tag{" "}
                <strong>@adataxpgindonesia</strong>
              </p>
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
              HASIL VOTING
            </a>
          </div>
        </div>
      </section>

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
        <ContestantGrid contestants={sortedContestants} />
      </section>

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
          </div>
        </div>
      </section>

      <section
        id="leaderboard-section"
        className="py-24 px-4 bg-[#0a0a0a] border-t border-white/5 relative z-0"
      >
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight uppercase">
            LEADERBOARD
          </h2>
          <p className="text-gray-500 text-lg">
            Hasil ini hanya menampilkan jumlah voters yang sudah memenuhi syarat
            (posting poster bukti voting di Instagram story dan tag
            @adataxpgindonesia)
          </p>
          <br />
          <p className="text-gray-500 text-lg">
            Juara PC Modding Contest ditentukan oleh voting dari publik, 
            tim  XPG ADATA, dan WaroQ sebagai juri sekaligus mentor.
          </p>
        </div>
        <Leaderboard contestants={leaderboardData} />
      </section>

      <footer className="bg-[#0a0a0a] border-t border-red-900/30 pt-20 pb-8 px-4 relative z-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 mb-16">
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
              Kompetisi PC modding di Indonesia yang disponsori oleh XPG ADATA.
              Menghadirkan 5 modder kreatif yang memodifikasi PC untuk
              memperebutkan gelar juara.
            </p>
          </div>
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
              </a>
              <a
                href="https://www.tiktok.com/@adataxpg.id?is_from_webapp=1&sender_device=pc"
                className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group"
              >
                <div>
                  <p className="text-white font-bold text-sm">TikTok</p>
                  <p className="text-gray-500 text-xs mt-1">
                    @adataxpgindonesia
                  </p>
                </div>
              </a>
              <a
                href="https://www.facebook.com/share/1DvjkLg1Dz/?mibextid=wwXIfr"
                className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg hover:border-red-500/50 hover:bg-white/10 transition-all group"
              >
                <div>
                  <p className="text-white font-bold text-sm">Facebook</p>
                  <p className="text-gray-500 text-xs mt-1">ADATAINDONESIA</p>
                </div>
              </a>
            </div>
          </div>
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
                  SYARAT VOTING SAH DAN IKUT UNDIAN HADIAH
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Upload poster bukti voting di Instagram Story dan tag
                  @adataxpgindonesia. Klaim hadiah maksimal 1 bulan setelah
                  pengumuman pemenang.
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