'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ContestantGrid({ contestants }: { contestants: any[] }) {
  const router = useRouter();

  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeGallery, setActiveGallery] = useState<{ images: string[], index: number } | null>(null);
  
  const [activeVote, setActiveVote] = useState<{ id: number, name: string, theme: string, image: string } | null>(null);
  const [igUsername, setIgUsername] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [showRules, setShowRules] = useState(false);

  const totalVotes = contestants.reduce((acc, curr) => acc + (curr.vote_count || 0), 0);

  const handleCloseVoteModal = () => {
    setActiveVote(null);
    setTimeout(() => {
      setVoteSuccess(false);
      setShowRules(false); 
      setErrorMessage('');
      setIgUsername('');
      setIsChecked(false);
    }, 500); 
  };

  const handleVoteSubmit = async () => {
    setErrorMessage(''); 
    if (!activeVote) return;
    if (!igUsername.trim()) return setErrorMessage("Tolong masukkan username Instagram kamu.");
    if (!isChecked) return setErrorMessage("Kamu harus menyetujui persyaratan untuk melanjutkan.");

    setLoading(true);
    const cleanIgUsername = igUsername.replace('@', '').trim().toLowerCase();

    try {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('ig_username', cleanIgUsername)
        .single();

      if (existingVote) {
        setErrorMessage('Akun Instagram ini sudah pernah digunakan untuk voting!');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('votes')
        .insert([{ ig_username: cleanIgUsername, contestant_id: activeVote.id }]);

      if (error) throw error;

      setVoteSuccess(true);
      router.refresh(); 
      
    } catch (err) {
      console.error(err);
      setErrorMessage('Gagal mengirim vote. Pastikan koneksi internet stabil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* PERUBAHAN UI: Scroll Vertical (Bawah) -> md:grid-cols-3 xl:grid-cols-5 */}
      <motion.div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8 relative z-10 items-stretch">
        {contestants?.map((c, index) => {
          const votePercentage = totalVotes > 0 ? Math.round((c.vote_count / totalVotes) * 100) : 0;
          const mainImg = c.image_url || `/images/${c.id === 1 ? 'kim.webp' : c.id === 2 ? 'raka.webp' : c.id === 3 ? 'wira.webp' : c.id === 4 ? 'helix.webp' : 'mons.webp'}`;
          
          const dbGallery = [
            c.gallery_1, c.gallery_2, c.gallery_3, c.gallery_4, c.gallery_5,
            c.gallery_6, c.gallery_7, c.gallery_8, c.gallery_9, c.gallery_10,
            c.gallery_11, c.gallery_12, c.gallery_13
          ].filter(Boolean);
          
          const galleryList = dbGallery.length > 0 ? dbGallery : [mainImg];
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              key={c.id} 
              // PERUBAHAN UI CARD: w-full karena sudah jadi vertical scroll
              className="group relative h-full w-full bg-[#0a0b12] border border-[#1f2235] hover:border-red-500/50 flex flex-col transition-all duration-500 shadow-2xl"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%)' }}
            >
              
              {/* h-[350px] agar foto peserta terlihat full body / setengah badan dengan jelas */}
              <div onClick={() => setActiveGallery({ images: galleryList, index: 0 })} className="relative h-[350px] md:h-[280px] xl:h-[350px] w-full bg-black cursor-pointer overflow-hidden shrink-0">
                <div className={`absolute top-0 left-0 z-20 px-3 py-1 font-black text-sm text-white ${index === 0 ? 'bg-red-600' : 'bg-[#1f2235]'}`} style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}>
                  {index === 0 ? '🏆 #1' : `#${index + 1}`}
                </div>
                <Image src={mainImg} alt={c.name} fill sizes="(max-width: 768px) 100vw, 20vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-110" priority={index === 0} />
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
                    <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-1">SUARA</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    <span>Persentase</span>
                    <span className="text-white">{votePercentage}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1f2235] rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${votePercentage}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
                  <button onClick={() => setActiveGallery({ images: galleryList, index: 0 })} className="w-full flex flex-col items-center justify-center bg-[#12141d] border border-[#1f2235] hover:border-red-500/50 hover:bg-[#1a1d29] transition-all p-3 rounded-lg group/btn">
                    <svg className="w-6 h-6 text-red-600 mb-2 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <div className="text-white text-[10px] font-bold uppercase tracking-wider">GALERI</div>
                    <div className="text-gray-500 text-[8px] uppercase tracking-widest">{galleryList.length} Foto</div>
                  </button>

                  <button onClick={() => setActiveVideo(c.video_url)} className="w-full flex flex-col items-center justify-center bg-[#12141d] border border-[#1f2235] hover:border-red-500/50 hover:bg-[#1a1d29] transition-all p-3 rounded-lg group/btn">
                    <svg className="w-6 h-6 text-red-600 mb-2 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div className="text-white text-[10px] font-bold uppercase tracking-wider">VIDEO</div>
                    <div className="text-gray-500 text-[8px] uppercase tracking-widest">Proses Rakit</div>
                  </button>
                </div>

                <button
                  onClick={() => setActiveVote({ id: c.id, name: c.name, theme: c.theme, image: mainImg })}
                  className="w-full mt-auto bg-red-600 hover:bg-red-500 text-white py-3 font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 group/vote shrink-0"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
                >
                  <svg className="w-4 h-4 text-white group-hover/vote:-translate-y-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
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
            <div className="absolute inset-0" onClick={handleCloseVoteModal}></div>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-[450px] bg-[#0a0b10] border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)] z-10 flex flex-col min-h-[350px]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
            >
              <button onClick={handleCloseVoteModal} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors z-50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <AnimatePresence mode="wait">
                {/* --- LAYAR RULES --- */}
                {showRules && !voteSuccess && (
                  <motion.div key="rules" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="p-6 md:p-8 flex-grow flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2 border-b border-white/10 pb-4">Peraturan Resmi</h2>
                    
                    <div className="text-gray-400 text-sm space-y-4 my-4 leading-relaxed">
                      <p><strong className="text-white">1. Kelayakan:</strong> Voting terbuka untuk umum. Kamu wajib menggunakan akun Instagram yang aktif dan asli. Penggunaan akun palsu atau bot akan mengakibatkan diskualifikasi suara.</p>
                      <p><strong className="text-white">2. Satu Akun Satu Vote:</strong> Setiap username Instagram hanya bisa memberikan <strong>SATU</strong> suara selama periode kontes berlangsung. Pilih jagoanmu dengan bijak!</p>
                      <p><strong className="text-white">3. Syarat Sosial Media:</strong> Untuk mengesahkan suaramu dan berhak mengikuti undian hadiah Rp 16 Juta, kamu <strong>WAJIB mem-follow</strong> XPG ADATA Indonesia di Instagram, TikTok, dan Facebook.</p>
                      <p><strong className="text-white">4. Pengumuman Pemenang:</strong> Pemilih beruntung yang memenangkan undian akan dihubungi langsung melalui DM Instagram oleh akun resmi @adataxpgindonesia.</p>
                      <p><strong className="text-white">5. Hak Penyelenggara:</strong> XPG ADATA berhak membatalkan atau mengurangi suara yang terbukti curang. Keputusan juri dan penyelenggara adalah mutlak.</p>
                    </div>

                    <button
                      onClick={() => setShowRules(false)}
                      className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 font-bold tracking-widest uppercase transition-all rounded-lg shrink-0"
                    >
                      Saya Mengerti, Kembali ke Vote
                    </button>
                  </motion.div>
                )}

                {/* --- LAYAR FORM VOTE UTAMA --- */}
                {!showRules && !voteSuccess && (
                  <motion.div key="form" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="p-6 md:p-8 flex-grow flex flex-col">
                    <div className="mb-6">
                      <h2 className="text-2xl font-black text-white uppercase tracking-wider">Berikan Suaramu</h2>
                      <p className="text-gray-500 text-sm">XPG ADATA PC Modding Contest 2026</p>
                    </div>

                    <div className="flex items-center gap-4 bg-[#12141d] border border-white/5 p-4 rounded-lg mb-6 shrink-0">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-black flex-shrink-0">
                        <Image src={activeVote.image} alt={activeVote.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{activeVote.name}</h3>
                        <p className="text-red-500 text-sm font-medium">{activeVote.theme}</p>
                      </div>
                    </div>

                    {errorMessage && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2">
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <p>{errorMessage}</p>
                      </motion.div>
                    )}

                    <div className="mb-6 mt-auto">
                      <label className="block text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">Username Instagram</label>
                      <input
                        type="text"
                        placeholder="usernamekamu"
                        value={igUsername}
                        onChange={(e) => setIgUsername(e.target.value)}
                        className="w-full bg-[#12141d] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                      />
                      <p className="text-gray-500 text-xs mt-2">Masukkan tanpa simbol @</p>
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
                        Saya telah membaca dan menyetujui
                        <button type="button" onClick={() => setShowRules(true)} className="text-red-500 underline hover:text-red-400 mx-1 focus:outline-none">
                          peraturan kontes
                        </button> 
                        serta mengonfirmasi bahwa saya mem-follow XPG ADATA di semua platform media sosial yang disyaratkan.
                      </label>
                    </div>

                    <button
                      onClick={handleVoteSubmit}
                      disabled={loading}
                      className="w-full mt-auto bg-red-900/40 hover:bg-red-600 border border-red-500/50 text-white py-4 font-black tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                      {loading ? 'MENGIRIM...' : 'KIRIM VOTE'}
                    </button>
                  </motion.div>
                )}

                {/* --- LAYAR SUKSES BERHASIL VOTE --- */}
                {voteSuccess && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-8 flex-grow flex flex-col items-center justify-center text-center">
                    
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1, rotate: 360 }} 
                      transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)] relative shrink-0"
                    >
                      <span className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-50"></span>
                      <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </motion.div>

                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">VOTE BERHASIL!</h2>
                    
                    <div className="text-gray-400 text-xs md:text-sm leading-relaxed mb-8 space-y-3">
                      <p>Terima kasih telah berpartisipasi dalam pemungutan suara.</p>
                      <p>Ajak teman-temanmu untuk ikut memilih, pemungutan suara akan tetap dibuka hingga <strong className="text-white">18 Mei 2026.</strong></p>
                      <p>Pemilih yang beruntung akan mendapatkan total hadiah <strong className="text-red-500">Rp 16 Juta</strong> dan akan diumumkan pada tanggal 25 Mei 2026 melalui kanal media sosial resmi XPG ADATA.</p>
                    </div>

                    <button
                      onClick={handleCloseVoteModal}
                      className="w-full mt-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 font-bold tracking-widest uppercase transition-all rounded-lg shrink-0"
                    >
                      KEMBALI KE GALERI
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

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
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
          >
            <div className="absolute inset-0" onClick={() => setActiveGallery(null)}></div>
            
            {/* PERUBAHAN UI GALERI: Tombol silang diperbesar dan diletakkan di posisi paling mudah diakses. Ditambahkan teks "TUTUP" agar lebih jelas di HP */}
            <div className="absolute top-4 right-4 z-[10000] flex gap-2">
               <button onClick={() => setActiveGallery(null)} className="flex items-center gap-2 bg-white/10 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all backdrop-blur-md border border-white/20">
                 <span className="text-xs font-bold uppercase tracking-widest hidden md:block">TUTUP GALERI</span>
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <button 
              onClick={() => setActiveGallery(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null)}
              className="absolute left-2 md:left-10 text-white/50 hover:text-white p-3 z-[10000] bg-black/50 rounded-full hover:bg-red-600 transition-all border border-white/10"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <motion.div
              key={activeGallery.index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl h-[65vh] md:h-[80vh] rounded-xl overflow-hidden shadow-2xl z-[9999] border border-white/10"
              onClick={(e) => e.stopPropagation()} 
            >
              <Image src={activeGallery.images[activeGallery.index]} alt="Gallery" fill sizes="100vw" className="object-contain bg-[#050505]" />
            </motion.div>

            <button 
              onClick={() => setActiveGallery(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null)}
              className="absolute right-2 md:right-10 text-white/50 hover:text-white p-3 z-[10000] bg-black/50 rounded-full hover:bg-red-600 transition-all border border-white/10"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-[10000] max-w-[80vw] overflow-x-auto custom-scrollbar p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
              {activeGallery.images.map((_, i) => (
                 <div key={i} className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${i === activeGallery.index ? 'bg-red-600 scale-125' : 'bg-white/30'}`}></div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* 4. POP-UP MODAL VIDEO */}
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
            {/* Tombol Close Video */}
            <div className="absolute top-4 right-4 z-[10000] flex gap-2">
               <button onClick={() => setActiveVideo(null)} className="flex items-center gap-2 bg-white/10 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all backdrop-blur-md border border-white/20">
                 <span className="text-xs font-bold uppercase tracking-widest hidden md:block">TUTUP VIDEO</span>
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }} 
              className={`w-full bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.4)] border border-red-500/20 relative z-[9999] ${
                activeVideo.includes('instagram') 
                  ? 'max-w-[450px] h-[85vh]' 
                  : 'max-w-6xl aspect-video' 
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}