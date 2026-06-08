import { NextResponse } from 'next/server';
import { redis } from '../../lib/redis'; // <-- Gunakan relative path ini

export async function GET() {
  // Menggunakan crypto bawaan Edge/Node untuk UUID
  const token = crypto.randomUUID();
  
  // Simpan di Redis dengan inisialisasi jumlah akses = 0, dan expired dalam 30 detik
  await redis.set(`qr_token:${token}`, 0, { ex: 30 });
  
  return NextResponse.json({ token });
}