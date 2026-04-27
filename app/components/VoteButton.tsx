'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function VoteButton({ contestantId, contestantName, contestantTheme }: { contestantId: number, contestantName: string, contestantTheme: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [igUsername, setIgUsername] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // STATE BARU UNTUK UI/UX ELEGAN
  const [voteSuccess, setVoteSuccess] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [showRules, setShowRules] = useState(false);

  // Logika memanggil gambar sesuai ID
  const imageUrl = `/images/${
    contestantId === 1 ? 'kim.webp' : 
    contestantId === 2 ? 'raka.webp' : 
    contestantId === 3 ? 'wira.webp' : 
    contestantId === 4 ? 'helix.webp' : 
    'mons.webp'
  }`;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setVoteSuccess(false);
      setShowRules(false); 
      setErrorMessage('');
      setIgUsername('');
      setIsChecked(false);
    }, 500); 
  };

  const handleSubmit = async () => {
    setErrorMessage(''); 
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
        .insert([{ ig_username: cleanIgUsername, contestant_id: contestantId }]);

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
      {/* TOMBOL VOTE UTAMA */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-red-600 hover:bg-red-500 text-white py-3 font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 group/vote shrink-0"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
      >
        <svg className="w-4 h-4 text-white group-hover/vote:-translate-y-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
        VOTE PESERTA INI
      </button>

      {/* POP-UP MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <div className="absolute inset-0" onClick={handleClose}></div>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-[450px] bg-[#0a0b10] border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)] z-10 flex flex-col min-h-[350px]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
            >
              <button onClick={handleClose} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors z-50">
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
                        <Image src={imageUrl} alt={contestantName} fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{contestantName}</h3>
                        <p className="text-red-500 text-sm font-medium">{contestantTheme}</p>
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
                      onClick={handleSubmit}
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
                      onClick={handleClose}
                      className="w-full mt-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 font-bold tracking-widest uppercase transition-all rounded-lg shrink-0"
                    >
                      TUTUP
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}