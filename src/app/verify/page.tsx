'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Memvalidasi akses...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token tidak ditemukan.');
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          // Pesan diubah agar pengguna tahu mereka akan dialihkan
          setMessage('Akses Diterima! Mengalihkan ke halaman utama...'); 
          
          // Fitur Redirect Otomatis: Pindah ke URL target setelah jeda 1,5 detik
          setTimeout(() => {
            window.location.href = 'https://ai-healthcare-platform.vercel.app/';
          }, 1500);

        } else {
          setStatus('error');
          setMessage(data.error);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Gagal terhubung ke server.');
      }
    };

    validateToken();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Akses Berhasil!</h1>
            <p className="text-gray-700">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h1>
            <p className="text-gray-700 font-medium">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

// Dibungkus Suspense agar Next.js bisa build route ini dengan benar (karena menggunakan useSearchParams)
export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <VerifyContent />
    </Suspense>
  );
}