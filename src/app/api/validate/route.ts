import { NextResponse } from 'next/server';
import { redis } from '../../lib/redis'; // <-- Gunakan relative path ini

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid.' }, { status: 400 });
    }

    const key = `qr_token:${token}`;

    // 1. Validasi Expired: Cek apakah token masih ada di Redis
    const exists = await redis.exists(key);
    if (!exists) {
      return NextResponse.json({ 
        error: 'QR Code sudah tidak berlaku. Silakan scan QR Code terbaru.' 
      }, { status: 410 }); // 410 Gone
    }

    // 2. Increment: Tambah jumlah pengguna yang mengakses
    const count = await redis.incr(key);

    // 3. Validasi Kuota: Maksimal 10 pengguna
    if (count > 5) {
      return NextResponse.json({ 
        error: 'Kuota akses QR Code telah penuh. Silakan tunggu QR Code berikutnya.' 
      }, { status: 429 }); // 429 Too Many Requests
    }

    return NextResponse.json({ success: true, message: 'Akses Diterima!' });

  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}