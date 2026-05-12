import { NextResponse } from 'next/server';

// KITA UBAH JADI POST AGAR BISA MENERIMA DATA TOKEN DENGAN AMAN
export async function POST(request: Request) {
  const isMaintenance = false; 

  if (isMaintenance) {
    return NextResponse.json({ error: "Sistem Sedang Maintenance" }, { status: 503 });
  }

  try {
    // Tangkap data yang dikirim dari frontend (ContestantGrid)
    const body = await request.json();
    const { username, captcha } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }

    if (!captcha) {
      return NextResponse.json({ error: 'CAPTCHA token diperlukan' }, { status: 400 });
    }

    // =========================================================================
    // VERIFIKASI CAPTCHA KE SERVER GOOGLE (LAPIS 2)
    // =========================================================================
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    // Nembak ke server Google pakai metode POST
    const recaptchaRes = await fetch(googleVerifyUrl, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();

    // Kalau Google bilang ini bot atau tokennya palsu, langsung tolak!
    if (!recaptchaData.success) {
      return NextResponse.json({ error: 'Verifikasi CAPTCHA gagal. Kamu terdeteksi sebagai bot!' }, { status: 403 });
    }

    // =========================================================================
    // BYPASS SEARCHAPI (Karena kuota habis, langsung nyalakan lampu hijau)
    // =========================================================================
    return NextResponse.json({ success: true, username: username });

  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}