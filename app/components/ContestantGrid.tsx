'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import VoteButton from './VoteButton';

export default function ContestantGrid({ contestants }: { contestants: any[] }) {
  // State untuk menyimpan video yang sedang aktif diputar (jika null = pop-up tertutup)
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // LINK VIDEO SEMENTARA (Kamu bisa ganti ID YouTube-nya nanti)
  // Formatnya harus embed: https://www.youtube.com/embed/ID_VIDEO?autoplay=1
  const dummyVideoUrl = "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1";

  return (
    <>
      <motion.div layout className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {contestants?.map((c, index) => (
          <motion.div
            layout 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            key={c.id} 
            className="group relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-500 flex flex-col justify-between"
          >
            {/* Badge Top Vote */}
            {index === 0 && c.vote_count > 0 && (
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] z-20 flex items-center gap-1 uppercase tracking-wider">
                 🔥 Top Vote
              </div>
            )}

            {/* Gambar (Bisa Di-Klik untuk Membuka Video) */}
            <div 
              onClick={() => setActiveVideo(dummyVideoUrl)} // <-- FUNGSI BUKA VIDEO
              className="relative h-[320px] w-full mb-8 overflow-hidden rounded-2xl bg-black cursor-pointer shadow-inner"
            >
              <Image 
                src={`/images/${c.id === 1 ? 'kim.jpg' : c.id === 2 ? 'raka.jpg' : c.id === 3 ? 'wimodz.jpg' : c.id === 4 ? 'helix.jpg' : 'mons.jpg'}`} 
                alt={c.name} 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:scale-110" 
                sizes="(max-w-7xl) 100vw, 33vw" 
                priority={index === 0} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 z-10 pointer-events-none"></div>
              
              {/* Tombol Play Kaca */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/20 shadow-2xl scale-90 group-hover:scale-100 group-hover:bg-red-600/90 transition-all duration-500 ease-out">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Detail Info */}
            <div className="mt-auto relative z-20">
              <h2 className="text-3xl font-bold text-white mb-1 tracking-tight group-hover:text-red-400 transition-colors">{c.name}</h2>
              <p className="text-red-500 font-medium mb-6 text-sm uppercase tracking-widest">{c.theme}</p>

              <div className="flex justify-between items-center mb-6 bg-black/30 p-4 rounded-xl border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Total Votes</span>
                   <span className="text-4xl font-black text-white leading-none">{c.vote_count}</span>
                 </div>
                 
                 {/* Tombol PLAY VIDEO (Juga bisa diklik) */}
                 <button 
                    onClick={() => setActiveVideo(dummyVideoUrl)} // <-- FUNGSI BUKA VIDEO
                    className="flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg cursor-pointer relative z-30"
                  >
                   ▶ PLAY VIDEO
                 </button>
              </div>

              <VoteButton contestantId={c.id} contestantName={c.name} />
            </div>

          </motion.div>
        ))}
      </motion.div>

      {/* ========================================= */}
      {/* BAGIAN POP-UP MODAL VIDEO (MUNCUL JIKA DIKLIK) */}
      {/* ========================================= */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setActiveVideo(null)} // Tutup kalau background hitam diklik
          >
            {/* Tombol Close (X) */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-red-500 transition-colors p-2 z-[110]"
              onClick={() => setActiveVideo(null)}
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Kotak Video Pemutar */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.4)] border border-red-500/20 relative z-[105]"
              onClick={(e) => e.stopPropagation()} // Supaya klik di area video tidak menutup popup
            >
              <iframe
                width="100%"
                height="100%"
                src={activeVideo}
                title="YouTube video player"
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