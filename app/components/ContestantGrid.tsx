"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ContestantGrid({
  contestants,
}: {
  contestants: any[];
}) {
  const router = useRouter();

  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeGallery, setActiveGallery] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  const [activeVote, setActiveVote] = useState<{
    id: number;
    name: string;
    theme: string;
    image: string;
    poster: string;
  } | null>(null);
  const [igUsername, setIgUsername] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showRules, setShowRules] = useState(false);

  const totalVotes = contestants.reduce(
    (acc, curr) => acc + (curr.vote_count || 0),
    0,
  );

  // =========================================================================
  // FIX URUTAN: Mengurutkan peserta secara statis sesuai request klien
  // =========================================================================
  const orderMap: { [key: string]: number } = {
    "wimodz.tech": 1,
    "MonsParmodd": 2,
    "Rakazone21": 3,
    "Kim Jong Tep": 4,
    "HelixCustom": 5,
  };

  const orderedContestants = [...contestants].sort((a, b) => {
    const orderA = orderMap[a.name] || 99;
    const orderB = orderMap[b.name] || 99;
    return orderA - orderB;
  });
  // =========================================================================

  const handleCloseVoteModal = () => {
    setActiveVote(null);
    setTimeout(() => {
      setVoteSuccess(false);
      setShowRules(false);
      setErrorMessage("");
      setIgUsername("");
      setIsChecked(false);
    }, 500);
  };

  const handleVoteSubmit = async () => {
    setErrorMessage("");
    if (!activeVote) return;
    if (!igUsername.trim())
      return setErrorMessage("Tolong masukkan username Instagram kamu.");
    if (!isChecked)
      return setErrorMessage(
        "Kamu harus menyetujui persyaratan untuk melanjutkan.",
      );

    setLoading(true);
    const cleanIgUsername = igUsername.replace("@", "").trim().toLowerCase();

    try {
      const { data: existingVote } = await supabase
        .from("votes")
        .select("*")
        .eq("ig_username", cleanIgUsername)
        .single();

      if (existingVote) {
        setErrorMessage(
          "Akun Instagram ini sudah pernah digunakan untuk voting!",
        );
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("votes")
        .insert([
          { ig_username: cleanIgUsername, contestant_id: activeVote.id },
        ]);

      if (error) throw error;

      setVoteSuccess(true);
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMessage("Gagal mengirim vote. Pastikan koneksi internet stabil.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // FIX VIDEO: Memperbaiki typo dari Supabase & segala format YouTube/IG
  // =========================================================================
  const handleOpenVideo = (url: string | null) => {
    if (!url) {
      alert("Video belum tersedia untuk peserta ini.");
      return;
    }
    let finalUrl = url;
    
    // Auto-detect format YouTube dan ubah jadi Embed Resmi
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("embed/") && !url.includes("embed?v=")) {
        videoId = url.split("embed/")[1].split("?")[0];
      }
      
      if (videoId) {
        // Otomatis putar (autoplay) kalau videonya youtube
        finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    } 
    // FIX INSTAGRAM TYPO DARI SUPABASE (emabed -> embed)
    else if (url.includes("instagram.com")) {
      finalUrl = url.replace("/emabed", "/embed");
      // Pastikan selalu ada /embed/ di belakang
      if (!finalUrl.includes("/embed")) {
        finalUrl = finalUrl.replace(/\/$/, "") + "/embed/";
      }
    }
    
    setActiveVideo(finalUrl);
  };

  return (
    <>
      <motion.div className="max-w-[1400px] mx-auto flex flex-nowrap md:grid md:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 px-4 md:px-0 relative z-10 items-stretch pb-12 overflow-x-auto overflow-y-hidden md:overflow-visible snap-x snap-mandatory scroll-smooth hide-scrollbar">
        {orderedContestants?.map((c, index) => {
          const votePercentage =
            totalVotes > 0 ? Math.round((c.vote_count / totalVotes) * 100) : 0;
          const mainImg =
            c.image_url ||
            `/images/${c.id === 1 ? "kim.webp" : c.id === 2 ? "raka.webp" : c.id === 3 ? "wira.webp" : c.id === 4 ? "helix.webp" : "mons.webp"}`;

          const posterImg = c.poster || `/images/poster.webp`;

          const dbGallery = [
            c.gallery_1,
            c.gallery_2,
            c.gallery_3,
            c.gallery_4,
            c.gallery_5,
            c.gallery_6,
            c.gallery_7,
            c.gallery_8,
            c.gallery_9,
            c.gallery_10,
            c.gallery_11,
            c.gallery_12,
            c.gallery_13,
          ].filter(Boolean);

          const galleryList = dbGallery.length > 0 ? dbGallery : [mainImg];

          return (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              key={c.id}
              className="group relative h-full w-[75vw] sm:w-[50vw] md:w-full flex-none snap-start md:snap-center bg-[#0a0b12] border border-[#1f2235] hover:border-red-500/50 flex flex-col transition-all duration-500 shadow-2xl rounded-[1.5rem] overflow-hidden"
            >
              <div
                onClick={() =>
                  setActiveGallery({ images: galleryList, index: 0 })
                }
                className="relative h-[350px] md:h-[300px] xl:h-[350px] w-full bg-black cursor-pointer overflow-hidden shrink-0"
              >
                <div
                  className={`absolute top-0 left-0 z-20 px-4 py-2 font-black text-sm text-white ${index === 0 ? "bg-red-600" : "bg-[#1f2235]"}`}
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%)",
                  }}
                >
                  {index === 0 ? "🏆 #1" : `#${index + 1}`}
                </div>
                <Image
                  src={mainImg}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 20vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b12] via-[#0a0b12]/60 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute bottom-4 left-5 right-5 z-20">
                  <h2 className="text-3xl font-black text-white leading-tight tracking-wide mb-1">
                    {c.name}
                  </h2>
                  <p className="text-[#00ffff] font-medium text-xs md:text-sm uppercase tracking-widest">
                    {c.theme}
                  </p>
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col z-20 relative -mt-2">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex-grow mr-4">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      <span>Persentase</span>
                      <span className="text-white">{votePercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1f2235] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 transition-all duration-1000 ease-out"
                        style={{ width: `${votePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl md:text-2xl font-black text-white leading-none">
                      {c.vote_count}
                    </span>
                    <p className="text-gray-500 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-0.5">
                      SUARA
                    </p>
                  </div>
                </div>

                <div className="mb-6 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-[1px] bg-red-600"></div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      GALERI
                    </span>
                  </div>

                  <div
                    onClick={() =>
                      setActiveGallery({ images: galleryList, index: 0 })
                    }
                    className="relative w-full h-[140px] flex justify-center items-center cursor-pointer group/stack"
                  >
                    {galleryList.length > 1 && (
                      <div className="absolute left-[5%] w-[40%] h-[70%] rounded-xl overflow-hidden shadow-xl opacity-60 group-hover/stack:opacity-100 group-hover/stack:-translate-x-4 transition-all duration-500 z-10 grayscale-[50%] border border-white/5">
                        <Image
                          src={galleryList[1]}
                          alt="Gallery 2"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {galleryList.length > 2 && (
                      <div className="absolute right-[5%] w-[40%] h-[70%] rounded-xl overflow-hidden shadow-xl opacity-60 group-hover/stack:opacity-100 group-hover/stack:translate-x-4 transition-all duration-500 z-10 grayscale-[50%] border border-white/5">
                        <Image
                          src={galleryList[2]}
                          alt="Gallery 3"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="absolute w-[50%] h-[90%] rounded-xl overflow-hidden shadow-2xl z-20 border-2 border-[#0a0b12] group-hover/stack:border-red-500/50 transition-all duration-500 group-hover/stack:scale-105">
                      <Image
                        src={galleryList[0]}
                        alt="Gallery 1"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md">
                        {galleryList.length} Foto
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenVideo(c.video_url);
                  }}
                  className="w-full flex items-center bg-[#12141d] border border-[#1f2235] hover:border-red-500/50 hover:bg-[#1a1d29] transition-all p-3 rounded-xl mb-4 group/btn text-left mt-auto relative z-[60] cursor-pointer"
                >
                  <div className="w-10 h-10 bg-red-600 flex items-center justify-center rounded-lg shrink-0 shadow-[0_0_10px_rgba(220,38,38,0.3)] group-hover/btn:scale-105 transition-transform">
                    <svg
                      className="w-5 h-5 text-white ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-white text-xs md:text-sm font-bold uppercase tracking-wider">
                      TONTON VIDEO
                    </div>
                    <div className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest mt-0.5">
                      Proses Rakit & Pameran
                    </div>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setActiveVote({
                      id: c.id,
                      name: c.name,
                      theme: c.theme,
                      image: mainImg,
                      poster: posterImg,
                    })
                  }
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-4 font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center rounded-xl shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:shadow-[0_10px_30px_rgba(220,38,38,0.4)] active:scale-95 shrink-0"
                >
                  VOTE PESERTA INI
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* POP-UP MODAL VOTE */}
      <AnimatePresence>
        {activeVote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <div
              className="absolute inset-0"
              onClick={handleCloseVoteModal}
            ></div>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-[450px] bg-[#0a0b10] border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)] z-10 flex flex-col min-h-[350px] max-h-[90vh]"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
              }}
            >
              {!voteSuccess && (
                <button
                  onClick={handleCloseVoteModal}
                  className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors z-50"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              <AnimatePresence mode="wait">
                {showRules && !voteSuccess && (
                  <motion.div
                    key="rules"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="p-6 md:p-8 flex-grow flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar"
                  >
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2 border-b border-white/10 pb-4">
                      Peraturan Resmi
                    </h2>
                    <div className="text-gray-400 text-sm space-y-4 my-4 leading-relaxed">
                      <p>
                        <strong className="text-white">1. Kelayakan:</strong>{" "}
                        Voting terbuka untuk umum. Kamu wajib menggunakan akun
                        Instagram yang aktif dan asli. Penggunaan akun palsu
                        atau bot akan mengakibatkan diskualifikasi suara.
                      </p>
                      <p>
                        <strong className="text-white">
                          2. Satu Akun Satu Vote:
                        </strong>{" "}
                        Setiap username Instagram hanya bisa memberikan{" "}
                        <strong>SATU</strong> suara selama periode kontes
                        berlangsung. Pilih jagoanmu dengan bijak!
                      </p>
                      <p>
                        <strong className="text-white">
                          3. Syarat Sosial Media:
                        </strong>{" "}
                        Untuk mengesahkan suaramu dan berhak mengikuti undian
                        hadiah Rp 16 Juta, kamu{" "}
                        <strong>WAJIB mem-follow</strong> XPG ADATA Indonesia di
                        Instagram, TikTok, dan Facebook.
                      </p>
                      <p>
                        <strong className="text-white">
                          4. Pengumuman Pemenang:
                        </strong>{" "}
                        Pemilih beruntung yang memenangkan undian akan dihubungi
                        langsung melalui DM Instagram oleh akun resmi
                        @adataxpgindonesia.
                      </p>
                      <p>
                        <strong className="text-white">
                          5. Hak Penyelenggara:
                        </strong>{" "}
                        XPG ADATA berhak membatalkan atau mengurangi suara yang
                        terbukti curang. Keputusan juri dan penyelenggara adalah
                        mutlak.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRules(false)}
                      className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 font-bold tracking-widest uppercase transition-all rounded-lg shrink-0"
                    >
                      Saya Mengerti, Kembali ke Vote
                    </button>
                  </motion.div>
                )}

                {!showRules && !voteSuccess && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-6 md:p-8 flex-grow flex flex-col"
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                        Berikan Suaramu
                      </h2>
                      <p className="text-gray-500 text-sm">
                        XPG ADATA PC Modding Contest 2026
                      </p>
                    </div>
                    <div className="flex items-center gap-4 bg-[#12141d] border border-white/5 p-4 rounded-lg mb-6 shrink-0">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-black flex-shrink-0">
                        <Image
                          src={activeVote.image}
                          alt={activeVote.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight">
                          {activeVote.name}
                        </h3>
                        <p className="text-red-500 text-sm font-medium">
                          {activeVote.theme}
                        </p>
                      </div>
                    </div>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2"
                      >
                        <svg
                          className="w-5 h-5 shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p>{errorMessage}</p>
                      </motion.div>
                    )}
                    <div className="mb-6 mt-auto">
                      <label className="block text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">
                        Username Instagram
                      </label>
                      <input
                        type="text"
                        placeholder="username Instagram"
                        value={igUsername}
                        onChange={(e) => setIgUsername(e.target.value)}
                        className="w-full bg-[#12141d] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                      />
                      <p className="text-gray-500 text-xs mt-2">
                        Masukkan tanpa simbol @
                      </p>
                    </div>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          id="consent"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                          className="w-5 h-5 accent-red-600 bg-[#12141d] border-white/10 rounded cursor-pointer"
                        />
                      </div>
                      <label
                        htmlFor="consent"
                        className="text-gray-300 text-sm cursor-pointer leading-relaxed"
                      >
                        Saya telah membaca dan menyetujui
                        <button
                          type="button"
                          onClick={() => setShowRules(true)}
                          className="text-red-500 underline hover:text-red-400 mx-1 focus:outline-none"
                        >
                          peraturan kontes
                        </button>
                        serta mengonfirmasi bahwa saya mem-follow XPG ADATA di
                        semua platform media sosial yang disyaratkan.
                      </label>
                    </div>
                    <button
                      onClick={handleVoteSubmit}
                      disabled={loading}
                      className="w-full mt-auto bg-red-900/40 hover:bg-red-600 border border-red-500/50 text-white py-4 font-black tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      style={{
                        clipPath:
                          "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                      }}
                    >
                      {loading ? "MENGIRIM..." : "KIRIM VOTE"}
                    </button>
                  </motion.div>
                )}

                {/* --- LAYAR SUKSES BERHASIL VOTE --- */}
                {voteSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 md:p-6 flex-grow flex flex-col items-center justify-start md:justify-center text-center overflow-y-auto custom-scrollbar"
                  >
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest mb-1 shrink-0 mt-2">
                      VOTE BERHASIL!
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm mb-4 shrink-0">
                      Terima kasih{" "}
                      <strong className="text-white">
                        @{igUsername.replace("@", "")}
                      </strong>
                    </p>

                    <div className="relative w-[210px] md:w-[290px] aspect-[9/16] rounded-lg overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.3)] mb-4 border border-white/20 shrink-0">
                      <Image
                        src={activeVote.poster}
                        alt="Share Poster"
                        fill
                        className="object-cover bg-[#0a0b12]"
                      />
                      {/* PERUBAHAN 1: top-[10%] diubah jadi top-[21%] agar turun ke dalam kotak merah */}
                      <div className="absolute top-[16%] left-0 w-full text-center z-10 px-1">
                        <p
                          className="text-white font-black text-[11px] md:text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] truncate"
                          style={{ fontFamily: "'TT Octosquares', sans-serif" }}
                        >
                          @{igUsername.replace("@", "")}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed mb-6 px-2 shrink-0">
                      Download poster personal ini dan bagikan ke IG Story-mu!
                      <br className="hidden md:block" /> Jangan lupa tag{" "}
                      <strong className="text-red-500">
                        @adataxpgindonesia
                      </strong>
                    </p>

                    <div className="w-full flex flex-col gap-3 mt-auto shrink-0 pb-2">
                      <button
                        onClick={() => {
                          const canvas = document.createElement("canvas");
                          const ctx = canvas.getContext("2d");

                          if (!ctx) {
                            alert(
                              "Browser Anda tidak mendukung fitur ini. Silakan screenshot manual.",
                            );
                            return;
                          }

                          const img = new window.Image();

                          img.crossOrigin = "anonymous";
                          img.src = activeVote.poster;

                          img.onload = () => {
                            // WAJIB pakai document.fonts.ready agar font TT Octosquares pasti keload
                            document.fonts.ready.then(() => {
                              canvas.width = img.width;
                              canvas.height = img.height;

                              ctx.drawImage(img, 0, 0);

                              // 1. UKURAN FONT DIPERKECIL JADI 36px
                              ctx.font =
                                "bold 40px 'TT Octosquares', sans-serif";
                              ctx.fillStyle = "#ffffff";
                              ctx.textAlign = "center";

                              // Efek bayangan ringan agar teks terbaca walau background terang
                              ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
                              ctx.shadowBlur = 10;
                              ctx.shadowOffsetX = 2;
                              ctx.shadowOffsetY = 2;

                              // 2. POSISI Y DIUBAH JADI 380 (Lebih ke atas, di atas kotak merah)
                              ctx.fillText(
                                `@${igUsername.replace("@", "")}`,
                                canvas.width / 2,
                                385,
                              );

                              const dataUrl = canvas.toDataURL(
                                "image/jpeg",
                                0.9,
                              );
                              const link = document.createElement("a");
                              link.download = `Poster-Vote-${activeVote.name}.jpg`;
                              link.href = dataUrl;
                              link.click();
                            });
                          };

                          img.onerror = () => {
                            alert(
                              "Gagal men-download poster otomatis. Tahan/klik kanan gambar di atas untuk menyimpan.",
                            );
                          };
                        }}
                        className="w-full bg-[#12141d] border border-white/20 hover:bg-white/10 text-white py-3 md:py-4 font-black tracking-widest text-xs md:text-sm uppercase transition-all rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        DOWNLOAD POSTER SAYA
                      </button>

                    
                      <button
                        onClick={handleCloseVoteModal}
                        className="w-full bg-transparent border border-white/20 hover:bg-white/10 text-white py-3 md:py-4 font-bold tracking-widest uppercase transition-all rounded-xl"
                      >
                        KEMBALI
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POP-UP MODAL GALLERY SLIDER */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
          >
            <div
              className="absolute inset-0"
              onClick={() => setActiveGallery(null)}
            ></div>

            <div className="relative w-full max-w-5xl h-[60vh] md:h-[80vh] flex items-center justify-center z-[100000] mt-12 md:mt-0">
              <button
                onClick={() => setActiveGallery(null)}
                className="absolute -top-14 left-0 md:-top-16 md:left-0 flex items-center gap-2 bg-[#12141d]/90 hover:bg-red-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full transition-all backdrop-blur-xl border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-[100001]"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">
                  KEMBALI
                </span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveGallery((prev) =>
                    prev
                      ? {
                          ...prev,
                          index:
                            (prev.index - 1 + prev.images.length) %
                            prev.images.length,
                        }
                      : null,
                  );
                }}
                className="absolute -left-2 md:-left-16 top-1/2 -translate-y-1/2 bg-[#12141d]/80 hover:bg-red-600 text-white p-3 rounded-full transition-all border border-white/20 z-[100001]"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
                <Image
                  src={activeGallery.images[activeGallery.index]}
                  alt="Gallery Preview"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveGallery((prev) =>
                    prev
                      ? {
                          ...prev,
                          index: (prev.index + 1) % prev.images.length,
                        }
                      : null,
                  );
                }}
                className="absolute -right-2 md:-right-16 top-1/2 -translate-y-1/2 bg-[#12141d]/80 hover:bg-red-600 text-white p-3 rounded-full transition-all border border-white/20 z-[100001]"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm font-bold tracking-widest">
                {activeGallery.index + 1} / {activeGallery.images.length}
              </div>
            </div>
          </motion.div>
        )}
        
      </AnimatePresence>
      {/* ========================================================================= */}
      {/* POP-UP MODAL VIDEO (TOMBOL DI KIRI ATAS VIDEO) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setActiveVideo(null)} 
          >
            <style dangerouslySetInnerHTML={{ __html: `nav { display: none !important; }` }} />

            {/* Kontainer fleksibel agar tombol selalu pas di atas kiri kotak video */}
            <div className={`w-full flex flex-col items-start ${activeVideo.includes('instagram') ? 'max-w-[450px]' : 'max-w-6xl'}`}>
              
              <button 
                onClick={() => setActiveVideo(null)} 
                className="mb-4 flex items-center gap-2 bg-[#12141d]/90 hover:bg-red-600 text-white px-5 py-2.5 rounded-full transition-all backdrop-blur-xl border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-[100000]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">TUTUP VIDEO</span>
              </button>
              
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 20 }} 
                className={`w-full bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.4)] border border-red-500/20 relative z-[100000] ${
                  activeVideo.includes('instagram') 
                    ? 'h-[75vh] md:h-[85vh]' // Tinggi disesuaikan agar sisa ruang cukup buat tombol
                    : 'aspect-video' 
                }`} 
                onClick={(e) => e.stopPropagation()}
              >
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={activeVideo} 
                  title="Video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}