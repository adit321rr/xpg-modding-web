'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ContestantGrid({ contestants }: { contestants: any[] }) {
  const router = useRouter();

  // STATES UNTUK POP-UP MODAL
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeGallery, setActiveGallery] = useState<{ images: string[], index: number } | null>(null);
  
  // STATES UNTUK VOTE
  const [activeVote, setActiveVote] = useState<{ id: number, name: string, theme: string, image: string } | null>(null);
  const [igUsername, setIgUsername] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Menghitung Vote Share
  const totalVotes = contestants.reduce((acc, curr) => acc + (curr.vote_count || 0), 0);

  // ==========================================
  // FUNGSI SUBMIT VOTE
  // ==========================================
  const handleVoteSubmit = async () => {
    if (!activeVote) return;
    if (!igUsername.trim()) return alert("Mohon masukkan username Instagram kamu!");
    if (!isChecked) return alert("Kamu harus menyetujui persyaratan (centang kotak) untuk melanjutkan!");

    setLoading(true);
    const cleanIgUsername = igUsername.replace('@', '').trim().toLowerCase();

    try {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('ig_username', cleanIgUsername)
        .single();

      if (existingVote) {
        alert('Maaf, Username Instagram ini sudah pernah digunakan untuk voting!');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('votes')
        .insert([{ ig_username: cleanIgUsername, contestant_id: activeVote.id }]);

      if (error) throw error;

      alert(`Berhasil memberikan vote untuk ${activeVote.name}!`);
      setActiveVote(null); // Tutup pop-up
      setIgUsername('');
      setIsChecked(false);
      router.refresh(); 
      
    } catch (err) {
      console.error(err);
      alert('Gagal memproses vote. Pastikan koneksi internet stabil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ========================================== */}
      {/* 1. GRID CARD PESERTA UTAMA */}
      {/* ========================================== */}
      <motion.div layout className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 relative z-10">
        {contestants?.map((c, index) => {
          const votePercentage = totalVotes > 0 ? Math.round((c.vote_count / totalVotes) * 100) : 0;
          
          // Tentukan gambar utama (Ambil dari Supabase, kalau kosong baru pakai fallback .webp)
          const mainImg = c.image_url || `/images/${c.id === 1 ? 'kim.webp' : c.id === 2 ? 'raka.webp' : c.id === 3 ? 'wira.webp' : c.id === 4 ? 'helix.webp' : 'mons.webp'}`;
          // MENGAMBIL DATA FOTO DARI DATABASE:
          // Kita filter(Boolean) untuk membuang data yang kosong/null.
          const dbGallery = [c.gallery_1, c.gallery_2, c.gallery_3, c.gallery_4, c.gallery_5].filter(Boolean);
          
          // Jika di database ternyata belum ada foto sama sekali, pakai foto utama sebagai pajangan.
          // Tapi kalau ada, gunakan foto dari database.
          const galleryList = dbGallery.length > 0 ? dbGallery : [mainImg];
          
          return (
            <motion.div
              layout 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              key={c.id} 
              className="group relative bg-[#0a0b12] border border-[#1f2235] hover:border-red-500/50 flex flex-col justify-between transition-all duration-500 shadow-2xl"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%)' }}
            >
              
              <div onClick={() => setActiveVideo(c.video_url)} className="relative h-[220px] w-full bg-black cursor-pointer overflow-hidden">
                <div className={`absolute top-0 left-0 z-20 px-3 py-1 font-black text-sm text-white ${index === 0 ? 'bg-red-600' : 'bg-[#1f2235]'}`} style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}>
                  {index === 0 ? '🏆 #1' : `#${index + 1}`}
                </div>
                <Image src={mainImg} alt={c.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="20vw" priority={index === 0} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b12] via-transparent to-transparent z-10 pointer-events-none"></div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col z-20 relative -mt-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight tracking-wide group-hover:text-red-400 transition-colors">{c.name}</h2>
                    <p className="text-[#00ffff] font-medium text-[10px] uppercase tracking-widest mt-1">{c.theme}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white leading-none">{c.vote_count}</span>
                    <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-1">VOTES</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    <span>Vote Share</span>
                    <span className="text-white">{votePercentage}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1f2235] rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${votePercentage}%` }}></div>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* GALLERY MINI (DENGAN BATAS 4 KOTAK & EFEK + SISA FOTO)         */}
                {/* ============================================================== */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-[1px] bg-red-600"></div>
                    <span className="text-red-600 text-[10px] font-bold uppercase tracking-widest">GALLERY</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {/* Kita paksa hanya map 4 gambar saja (0 sampai 3) */}
                    {galleryList.slice(0, 4).map((imgSrc, i) => {
                      // Cek apakah ini kotak ke-4 (index 3) dan apakah total fotonya lebih dari 4
                      const isLastBox = i === 3;
                      const hasMore = galleryList.length > 4;
                      const remainingCount = galleryList.length - 4;

                      return (
                        <div 
                          key={i} 
                          // Saat diklik, lempar SELURUH galleryList (semua fotonya) ke slider
                          onClick={() => setActiveGallery({ images: galleryList, index: i })} 
                          className="aspect-square relative rounded border border-[#1f2235] overflow-hidden bg-black opacity-70 hover:opacity-100 cursor-pointer transition-all hover:border-red-500"
                        >
                           <Image src={imgSrc} alt={`gallery ${i}`} fill className="object-cover" />
                           
                           {/* Menambahkan efek layar gelap dengan tulisan +1, +2 dst khusus di kotak terakhir */}
                           {isLastBox && hasMore && (
                             <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-[2px]">
                               <span className="text-white text-xs font-black">+{remainingCount}</span>
                             </div>
                           )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <button onClick={() => setActiveVideo(c.video_url)} className="w-full flex items-center bg-[#12141d] border border-[#1f2235] hover:border-red-500/50 hover:bg-[#1a1d29] transition-all p-2 rounded-lg mb-3 group/btn text-left">
                  <div className="w-10 h-10 bg-red-600 flex items-center justify-center rounded shrink-0 shadow-[0_0_10px_rgba(220,38,38,0.3)] group-hover/btn:scale-105 transition-transform">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-white text-xs font-bold uppercase tracking-wider">WATCH VIDEO</div>
                    <div className="text-gray-500 text-[9px] uppercase tracking-widest">Build process & showcase</div>
                  </div>
                </button>

                {/* TOMBOL MENGAKTIFKAN MODAL VOTE */}
                <button
                  onClick={() => setActiveVote({ id: c.id, name: c.name, theme: c.theme, image: mainImg })}
                  className="w-full mt-auto bg-red-600 hover:bg-red-500 text-white py-3 font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 group/vote"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
                >
                  <svg className="w-4 h-4 text-white group-hover/vote:-translate-y-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                  VOTE FOR THIS
                </button>
              </div>

            </motion.div>
          );
        })}
      </motion.div>

      {/* ========================================== */}
      {/* 2. POP-UP MODAL VOTE (Diluar Grid) */}
      {/* ========================================== */}
      <AnimatePresence>
        {activeVote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <div className="absolute inset-0" onClick={() => setActiveVote(null)}></div>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-[450px] bg-[#0a0b10] border border-white/10 rounded-xl p-6 md:p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)] z-10"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
            >
              <button onClick={() => setActiveVote(null)} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Cast Your Vote</h2>
                <p className="text-gray-500 text-sm">XPG ADATA PC Modding Contest 2026</p>
              </div>

              <div className="flex items-center gap-4 bg-[#12141d] border border-white/5 p-4 rounded-lg mb-6">
                <div className="w-16 h-16 relative rounded-md overflow-hidden bg-black flex-shrink-0">
                  <Image src={activeVote.image} alt={activeVote.name} fill className="object-cover" sizes="64px" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">{activeVote.name}</h3>
                  <p className="text-red-500 text-sm font-medium">{activeVote.theme}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">Instagram Username</label>
                <input
                  type="text"
                  placeholder="yourusername"
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value)}
                  className="w-full bg-[#12141d] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                />
                <p className="text-gray-500 text-xs mt-2">Enter without @ symbol</p>
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
                <label htmlFor="consent" className="text-gray-300 text-sm cursor-pointer leading-relaxed">
                  I have read and agree to the <span className="text-red-500 underline">contest rules</span> and confirm I follow XPG ADATA on all required social platforms.
                </label>
              </div>

              <button
                onClick={handleVoteSubmit}
                disabled={loading}
                className="w-full bg-red-900/40 hover:bg-red-600 border border-red-500/50 text-white py-4 font-black tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
              >
                {loading ? 'SUBMITTING...' : 'SUBMIT VOTE'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* 3. POP-UP MODAL GALLERY SLIDER */}
      {/* ========================================== */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
          >
            <div className="absolute inset-0" onClick={() => setActiveGallery(null)}></div>
            
            <button onClick={() => setActiveGallery(null)} className="absolute top-6 right-6 text-white/50 hover:text-red-500 transition-colors p-2 z-[10000]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Tombol Kiri */}
            <button 
              onClick={() => setActiveGallery(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null)}
              className="absolute left-4 md:left-10 text-white/50 hover:text-white p-4 z-[10000] bg-black/50 rounded-full hover:bg-red-600 transition-all"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Gambar yang ditampilkan */}
            <motion.div
              key={activeGallery.index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl z-[9999] border border-white/10"
              onClick={(e) => e.stopPropagation()} 
            >
              <Image src={activeGallery.images[activeGallery.index]} alt="Gallery" fill className="object-contain bg-[#050505]" />
            </motion.div>

            {/* Tombol Kanan */}
            <button 
              onClick={() => setActiveGallery(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null)}
              className="absolute right-4 md:right-10 text-white/50 hover:text-white p-4 z-[10000] bg-black/50 rounded-full hover:bg-red-600 transition-all"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            
            {/* Indikator Titik */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 z-[10000]">
              {activeGallery.images.map((_, i) => (
                 <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === activeGallery.index ? 'bg-red-600 scale-125' : 'bg-white/30'}`}></div>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* 4. POP-UP MODAL VIDEO (Tetap Sama) */}
      {/* ========================================== */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setActiveVideo(null)} 
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-red-500 transition-colors p-2 z-[10000]" onClick={() => setActiveVideo(null)}>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.4)] border border-red-500/20 relative z-[9999]" onClick={(e) => e.stopPropagation()}>
              <iframe width="100%" height="100%" src={activeVideo} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}