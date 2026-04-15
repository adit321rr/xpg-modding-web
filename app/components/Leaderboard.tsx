'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Leaderboard({ contestants }: { contestants: any[] }) {
  const maxVotes = Math.max(...contestants.map(c => c.vote_count), 1); 

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-4">
      {contestants.map((c, index) => {
        const percentage = c.vote_count === 0 ? 0 : (c.vote_count / maxVotes) * 100;

        return (
          <motion.div 
            layout
            key={c.id}
            className={`flex items-center gap-4 p-4 rounded-xl border ${
              index === 0 && c.vote_count > 0 
                ? 'bg-gradient-to-r from-[#2a0e0e] to-[#1a1a1a] border-red-900/50' 
                : 'bg-[#121212] border-gray-800'
            }`}
          >
            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border ${
              index === 0 && c.vote_count > 0 ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-gray-700 text-gray-500 bg-gray-800/50'
            }`}>
              {index === 0 && c.vote_count > 0 ? '🏆' : `#${index + 1}`}
            </div>

            {/* PERUBAHAN: URUTAN GAMBAR KECIL JUGA SUDAH DISESUAIKAN */}
            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-black flex-shrink-0">
              <Image 
                src={`/images/${
                  c.id === 1 ? 'kim.jpg' : 
                  c.id === 2 ? 'raka.jpg' : 
                  c.id === 3 ? 'wira.jpg' : 
                  c.id === 4 ? 'helix.jpg' : 
                  'mons.jpg'
                }`} 
                alt={c.name} fill className="object-cover" sizes="48px"
              />
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">{c.name}</h3>
                  <p className="text-gray-400 text-xs">{c.theme}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xl text-white">{c.vote_count}</span>
                  <span className="text-gray-500 text-xs ml-1 uppercase">Votes</span>
                </div>
              </div>
              
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${index === 0 && c.vote_count > 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-red-600'}`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}