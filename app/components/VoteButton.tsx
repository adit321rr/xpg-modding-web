'use client'; // Menandakan ini adalah komponen interaktif (Client Component)

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function VoteButton({ contestantId, contestantName }: { contestantId: number, contestantName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVote = async () => {
    setLoading(true);

    try {
      // 1. Cek apakah user sudah login Google
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Kalau belum login, lempar ke halaman Login Google
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });
        return;
      }

      const userEmail = session.user.email;

      // 2. Cek apakah email ini sudah pernah nge-vote
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_email', userEmail)
        .single();

      if (existingVote) {
        alert('Maaf, kamu sudah memberikan vote! 1 Akun Google hanya bisa vote 1 kali.');
        setLoading(false);
        return;
      }

      // 3. Masukkan data vote ke database (Otomatis memicu SQL Trigger tadi)
      const { error } = await supabase
        .from('votes')
        .insert([{ user_email: userEmail, contestant_id: contestantId }]);

      if (error) {
        alert('Gagal memproses vote. Coba lagi.');
        console.error(error);
      } else {
        alert(`Berhasil memberikan vote untuk ${contestantName}!`);
        // Refresh halaman supaya angka vote bertambah secara real-time di layar
        router.refresh(); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'MEMPROSES...' : 'VOTE'}
    </button>
  );
}