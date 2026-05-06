import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username dibutuhkan' }, { status: 400 });
  }

  // AMAN: Tidak pakai NEXT_PUBLIC_, jadi kunci ini hanya hidup di dalam Server
  const API_KEY = process.env.SEARCHAPI_KEY; 
  
  if (!API_KEY) {
    return NextResponse.json({ error: 'API Key belum di-setting di server' }, { status: 500 });
  }
  
  const url = `https://www.searchapi.io/api/v1/search?engine=instagram_profile&username=${username}&api_key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Jika API mengembalikan pesan error (biasanya karena akun tidak ada)
    if (data.error) {
      return NextResponse.json({ exists: false, message: 'Akun tidak ditemukan' }, { status: 404 });
    }

    // Jika berhasil menemukan profile
    return NextResponse.json({ exists: true, data: data.user_profile }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memverifikasi ke server IG' }, { status: 500 });
  }
}