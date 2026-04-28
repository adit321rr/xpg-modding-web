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
      {/* CONTAINER: 100% Vertical Scroll (grid-cols-1 di HP) */}
      <motion.div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8 px-4 md:px-0 relative z-10 items-stretch pb-12">
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
              // PERUBAHAN UI CARD: w-full (Penuh layar ke bawah)
              className="group relative h-full w-full bg-[#0a0b12] border border-[#1f2235] rounded-[1.5rem] overflow-hidden flex flex-col transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-red-500/50"
            >
              
              <div onClick={() => setActiveGallery({ images: galleryList, index: 0 })} className="relative h-[350px] md:h-[300px] xl:h-[350px] w-full bg-black cursor-pointer overflow-hidden shrink-0">
                
                {/* REVISI BADGE NOMOR URUT: Potongan Polygon Merah Keren */}
                <div className={`absolute top-0 left-0 z-20 pl-4 pr-6 py-2 font-black text-sm text-white ${index === 0 ? 'bg-red-600' : 'bg-[#1f2235]'}`} style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%)' }}>
                  {index === 0 ? '🏆 #1' : `#${index + 1}`}
                </div>

                <Image src={mainImg} alt={c.name} fill sizes="(max-width: 768px) 100vw, 20vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" priority={index === 0} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b12] via-[#0a0b12]/60 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute bottom-4 left-5 right-5 z-20">
                  <h2 className="text-3xl font-black text-white leading-tight tracking-wide mb-1">{c.name}</h2>
                  <p className="text-[#00ffff] font-medium text-xs md:text-sm uppercase tracking-widest">{c.theme}</p>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col z-20">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex-grow mr-4">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      <span>Persentase</span>
                      <span className="text-white">{votePercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1f2235] rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${votePercentage}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl md:text-2xl font-black text-white leading-none">{c.vote_count}</span>
                    <p className="text-gray-500 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-0.5">SUARA</p>
                  </div>
                </div>

                {/* ========================================== */}
                {/* PERUBAHAN UI: 3D STACK GALLERY (SCREENSHOT 3) */}
                {/* ========================================== */}
                <div className="mb-5 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-[1px] bg-red-600"></div>
                    <span className="text-red-600 text-[10px] font-bold uppercase tracking-widest">GALERI TUMPANG</span>
                  </div>

                  <div 
                    onClick={() => setActiveGallery({ images: galleryList, index: 0 })}
                    className="relative w-full h-[140px] flex justify-center items-center cursor-pointer group/stack"
                  >
                    {/* Gambar Kiri */}
                    {galleryList.length > 1 && (
                      <div className="absolute left-[5%] w-[40%] h-[70%] rounded-xl overflow-hidden shadow-xl opacity-60 group-hover/stack:opacity-100 group-hover/stack:-translate-x-4 transition-all duration-500 z-10 grayscale-[50%] border border-white/5">
                        <Image src={galleryList[1]} alt="Gallery 2" fill className="object-cover" />
                      </div>
                    )}
                    
                    {/* Gambar Kanan */}
                    {galleryList.length > 2 && (
                      <div className="absolute right-[5%] w-[40%] h-[70%] rounded-xl overflow-hidden shadow-xl opacity-60 group-hover/stack:opacity-100 group-hover/stack:translate-x-4 transition-all duration-500 z-10 grayscale-[50%] border border-white/5">
                        <Image src={galleryList[2]} alt="Gallery 3" fill className="object-cover" />
                      </div>
                    )}

                    {/* Gambar Tengah */}
                    <div className="absolute w-[50%] h-[90%] rounded-xl overflow-hidden shadow-2xl z-20 border-2 border-[#0a0b12] group-hover/stack:border-red-500/50 transition-all duration-500 group-hover/stack:scale-105">
                      <Image src={galleryList[0]} alt="Gallery 1" fill className="object-cover" />
                      <div className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md">
                        {galleryList.length} Foto
                      </div>
                    </div>
                  </div>
                </div>
                {/* ========================================== */}

                <button onClick={() => setActiveVideo(c.video_url)} className="w-full flex items-center bg-[#12141d] border border-[#1f2235] hover:border-red-500/50 hover:bg-[#1a1d29] transition-all p-3 rounded-xl mb-4 group/btn text-left mt-auto">
                  <div className="w-10 h-10 bg-red-600 flex items-center justify-center rounded-lg shrink-0 shadow-[0_0_10px_rgba(220,38,38,0.3)] group-hover/btn:scale-105 transition-transform">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-white text-xs md:text-sm font-bold uppercase tracking-wider">TONTON VIDEO</div>
                    <div className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest mt-0.5">Proses Rakit & Pameran</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveVote({ id: c.id, name: c.name, theme: c.theme, image: mainImg })}
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
                    <button onClick={() => setShowRules(false)} className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 font-bold tracking-widest uppercase transition-all rounded-lg shrink-0">
                      Saya Mengerti, Kembali ke Vote
                    </button>
                  </motion.div>
                )}

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
                      KEMBALI
                    </button>
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
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
          >
            <div className="absolute inset-0" onClick={() => setActiveGallery(null)}></div>
            
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[10000] flex gap-2">
               <button onClick={() => setActiveGallery(null)} className="flex items-center gap-2 bg-[#12141d]/80 hover:bg-red-600 text-white px-5 py-3 rounded-full transition-all backdrop-blur-xl border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                 <span className="text-xs font-bold uppercase tracking-widest">TUTUP GALERI</span>
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
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
              className="relative w-full max-w-5xl h-[75vh] md:h-[85vh] rounded-xl overflow-hidden shadow-2xl z-[9999] border border-white/10"
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

      {/* POP-UP MODAL VIDEO */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setActiveVideo(null)} 
          >
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[10000] flex gap-2">
               <button onClick={() => setActiveVideo(null)} className="flex items-center gap-2 bg-[#12141d]/80 hover:bg-red-600 text-white px-5 py-3 rounded-full transition-all backdrop-blur-xl border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                 <span className="text-xs font-bold uppercase tracking-widest">TUTUP VIDEO</span>
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
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