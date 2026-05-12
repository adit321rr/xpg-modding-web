import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const isMaintenance = true; 

  if (isMaintenance) {
    // Kalau maintenance nyala, langsung tendang bot-nya, JANGAN TERUSIN ke SearchApi!
    return NextResponse.json(
      { error: "Sistem Sedang Maintenance" },
      { status: 503 }
    );
  }
 // =========================================================================
  // KODE ASLI ABANG DI BAWAH SINI (Baru jalan kalau isMaintenance = false)
  // =========================================================================
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
  }

  try {
    // Ambil kunci API dari Environment Variable
    const apiKey = process.env.SEARCHAPI_KEY; 
    
    // Nembak ke SearchApi (ini yang nyedot kuota kalau nggak dilindungi)
    const res = await fetch(`https://www.searchapi.io/api/v1/search?engine=instagram_profile&username=${username}&api_key=${apiKey}`);

    if (!res.ok) {
       return NextResponse.json({ error: 'Akun IG tidak ditemukan atau private' }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}