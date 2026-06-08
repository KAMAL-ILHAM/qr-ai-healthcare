'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [token, setToken] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Fungsi untuk mengambil token baru dari API
  const fetchNewToken = async () => {
    try {
      const res = await fetch('/api/qr');
      const data = await res.json();
      setToken(data.token);
      setTimeLeft(30); // Reset timer
    } catch (error) {
      console.error('Gagal memuat token QR');
    }
  };

  useEffect(() => {
    // Jalankan pertama kali saat halaman dibuka
    fetchNewToken();

    // Set interval untuk meminta token baru tiap 30 detik
    const tokenInterval = setInterval(fetchNewToken, 30000);

    // Set interval untuk hitung mundur visual UI
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(tokenInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  // URL hardcoded sesuai permintaan
  const baseUrl = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}` 
  : 'https://ai-healthcare-platform.vercel.app';

  const targetUrl = `${baseUrl}/verify?token=${token}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Platform AI Healthcare</h1>
        
        {token ? (
          <div className="p-4 bg-white border rounded-xl">
            <QRCodeSVG value={targetUrl} size={250} />
          </div>
        ) : (
          <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-100 rounded-xl">
            <p className="text-gray-500 animate-pulse">Memuat QR Code...</p>
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500 font-medium">
          QR Code akan diperbarui dalam <span className="text-blue-600 font-bold text-lg">{timeLeft}</span> detik
        </p>
      </div>
    </div>
  );
}