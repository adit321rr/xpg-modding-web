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

  // Logika memanggil gambar sesuai ID untuk di dalam Pop-up
  const imageUrl = `/images/${
    contestantId === 1 ? 'kim.jpg' : 
    contestantId === 2 ? 'raka.jpg' : 
    contestantId === 3 ? 'wira.jpg' : 
    contestantId === 4 ? 'helix.jpg' : 
    'mons.jpg'
  }`;

  const handleSubmit = async () => {
    // Validasi input
    if (!igUsername.trim()) {
      alert("Mohon masukkan username Instagram kamu!");
      return;
    }
    if (!isChecked) {
      alert("Kamu harus menyetujui persyaratan (centang kotak) untuk melanjutkan!");
      return;
    }

    setLoading(true);
    // Hilangkan simbol '@' jika user iseng mengetiknya, dan jadikan huruf kecil semua
    const cleanIgUsername = igUsername.replace('@', '').trim().toLowerCase();

    try {
      // 1. Cek apakah IG ini sudah pernah vote
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

      // 2. Masukkan data vote ke database (Otomatis memicu SQL Trigger penambah angka)
      const { error } = await supabase
        .from('votes')
        .insert([{ ig_username: cleanIgUsername, contestant_id: contestantId }]);

      if (error) throw error;

      alert(`Berhasil memberikan vote untuk ${contestantName}!`);
      setIsOpen(false); // Tutup pop-up
      setIgUsername(''); // Kosongkan input
      setIsChecked(false); // Uncheck
      router.refresh(); // Update angka secara real-time
      
    } catch (err) {
      console.error(err);
      alert('Gagal memproses vote. Pastikan koneksi internet stabil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TOMBOL VOTE UTAMA DI GRID */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-red-600 hover:bg-red-500 text-white py-3 font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 group/vote"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
      >
        <svg className="w-4 h-4 text-white group-hover/vote:-translate-y-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
        VOTE FOR THIS
      </button>

      {/* POP-UP MODAL (Hanya muncul jika isOpen === true) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            {/* Area luar untuk klik tutup */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>

            {/* KOTAK MODAL UTAMA */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-[450px] bg-[#0a0b10] border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl z-10"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }} // Efek sudut terpotong ala Cyberpunk
            >
              {/* Tombol X Close */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              {/* Header Modal */}
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Cast Your Vote</h2>
                <p className="text-gray-500 text-sm">XPG ADATA PC Modding Contest 2026</p>
              </div>

              {/* Info Peserta Terpilih */}
              <div className="flex items-center gap-4 bg-[#12141d] border border-white/5 p-4 rounded-lg mb-6">
                <div className="w-16 h-16 relative rounded-md overflow-hidden bg-black flex-shrink-0">
                  <Image src={imageUrl} alt={contestantName} fill className="object-cover" sizes="64px" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">{contestantName}</h3>
                  <p className="text-red-500 text-sm font-medium">{contestantTheme}</p>
                </div>
              </div>

              {/* Form Input IG */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">
                  Instagram Username
                </label>
                <input
                  type="text"
                  placeholder="yourusername"
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value)}
                  className="w-full bg-[#12141d] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                />
                <p className="text-gray-500 text-xs mt-2">Enter without @ symbol</p>
              </div>

              {/* Checkbox Persetujuan */}
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

              {/* Warning Text */}
              <div className="flex items-center gap-3 bg-[#12141d] border border-white/5 p-4 rounded-lg mb-6">
                <svg className="w-6 h-6 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Each Instagram account can only vote once. Multiple votes will be disqualified.
                </p>
              </div>

              {/* Tombol Submit Modal */}
              <button
                onClick={handleSubmit}
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
    </>
  );
}