"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PopupAnnouncement() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Membuka pop-up otomatis saat web pertama kali dimuat
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0b10] border border-red-500/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)] z-[100000] flex flex-col"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
            }}
          >
            <div className="p-6 md:p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4">
                PENGUMUMAN PENTING
              </h2>

              <div className="text-gray-300 text-sm md:text-base space-y-4 mb-8 leading-relaxed">
                <p>
                  Voting XPG ADATA PC Modding Contest resmi{" "}
                  <strong className="text-red-500">DITUTUP</strong>.
                </p>
                <p>
                  Terima kasih untuk puluhan ribu suara yang sudah masuk. Nantikan
                  pengumuman undian pemenang pada <strong>25 Mei 2026</strong> di
                  media sosial Instagram{" "}
                  <span className="text-red-500">@adataxpgindonesia</span>.
                </p>
                <p className="text-xs text-gray-500 italic mt-4">
                  Klik "Tutup" untuk melihat hasil akhir perolehan suara.
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-4 font-black tracking-widest uppercase transition-all rounded-lg active:scale-95 shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
              >
                TUTUP
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}