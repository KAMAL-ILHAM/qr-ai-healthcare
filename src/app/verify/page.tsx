'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  HeartPulse, 
  Stethoscope, 
  Hospital, 
  ShieldCheck, 
  Activity, 
  Pill,
  Loader2,
  CheckCircle2,
  XCircle,
  Shield
} from 'lucide-react';

// Komponen Card Ikon Melayang (Identik dengan halaman utama)
const FloatingIconCard = ({ children, delay, duration, positionClasses }: { children: React.ReactNode, delay: string, duration: string, positionClasses: string }) => (
  <div 
    className={`absolute z-0 flex items-center justify-center w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-[20px] md:rounded-[24px] bg-white/20 backdrop-blur-[16px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.04)] animate-float ${positionClasses}`}
    style={{ animationDelay: delay, animationDuration: duration }}
  >
    {children}
  </div>
);

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Memvalidasi token akses...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token akses tidak valid atau tidak ditemukan.');
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
          setMessage('Akses diizinkan. Mengalihkan ke platform EIOHealth...'); 
          
          setTimeout(() => {
            window.location.href = 'https://ai-healthcare-platform.vercel.app/';
          }, 1500);

        } else {
          setStatus('error');
          setMessage(data.error || 'Akses ditolak oleh sistem.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Gagal terhubung ke server verifikasi.');
      }
    };

    validateToken();
  }, [token]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation-name: float; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
        }
      `}} />

      {/* Kontainer Utama: Fixed 100vh, No Scroll */}
      <main className="relative h-screen w-screen flex items-center justify-center overflow-hidden" 
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.03), rgba(6,182,212,0.03))' }}>
        
        {/* Layer 1: Background & Texture */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
        <div className="absolute inset-0 noise-overlay pointer-events-none mix-blend-overlay" />

        {/* Layer 2: Blur Glow Effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        {/* Layer 3: Floating Medical Icons */}
        <FloatingIconCard delay="0s" duration="7s" positionClasses="top-[12%] left-[8%] max-md:hidden">
          <Stethoscope className="w-8 h-8 text-indigo-500/60" strokeWidth={1.5} />
        </FloatingIconCard>
        <FloatingIconCard delay="1.5s" duration="6s" positionClasses="top-[15%] right-[10%] max-md:hidden">
          <Activity className="w-8 h-8 text-cyan-500/60" strokeWidth={1.5} />
        </FloatingIconCard>
        <FloatingIconCard delay="2.5s" duration="8s" positionClasses="bottom-[15%] left-[10%] max-lg:hidden">
          <ShieldCheck className="w-8 h-8 text-indigo-400/60" strokeWidth={1.5} />
        </FloatingIconCard>
        <FloatingIconCard delay="1s" duration="6.5s" positionClasses="bottom-[12%] right-[8%] max-lg:hidden">
          <HeartPulse className="w-8 h-8 text-cyan-500/60" strokeWidth={1.5} />
        </FloatingIconCard>
        <FloatingIconCard delay="3s" duration="7.5s" positionClasses="top-[45%] left-[4%] max-xl:hidden">
          <Hospital className="w-8 h-8 text-slate-400/50" strokeWidth={1.5} />
        </FloatingIconCard>
        <FloatingIconCard delay="0.5s" duration="5.5s" positionClasses="top-[55%] right-[5%] max-xl:hidden">
          <Pill className="w-8 h-8 text-indigo-300/60" strokeWidth={1.5} />
        </FloatingIconCard>

        {/* Layer 4: Main Verification Card */}
        <section className="relative z-10 w-[92%] max-w-[480px] p-6 md:p-10 rounded-[32px] bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] flex flex-col items-center text-center animate-fade-in">
          
          {/* Header Verifikasi */}
          <div className="flex flex-col items-center space-y-1.5 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-[16px] bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/10 mb-2">
              <Shield className="w-6 h-6 text-indigo-600" strokeWidth={2} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Verifikasi Sistem
            </h1>
          </div>
          
          {/* Status Content Area */}
          <div className="w-full p-6 md:p-8 rounded-[24px] bg-white/80 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-md flex flex-col items-center justify-center min-h-[220px] transition-all duration-300">
            
            {status === 'loading' && (
              <div className="flex flex-col items-center animate-fade-in">
                <Loader2 className="w-14 h-14 text-indigo-500 animate-spin mb-4" strokeWidth={1.5} />
                <p className="text-sm md:text-base font-semibold text-slate-600">{message}</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={2} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-emerald-600 mb-2">Verifikasi Sukses</h2>
                <p className="text-sm text-slate-600 max-w-[260px] leading-relaxed">{message}</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-5">
                  <XCircle className="w-10 h-10 text-rose-500" strokeWidth={2} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-rose-600 mb-2">Akses Ditolak</h2>
                <p className="text-sm text-slate-600 max-w-[260px] leading-relaxed">{message}</p>
              </div>
            )}

          </div>

          {/* Footer Info */}
          <div className="mt-8 w-full text-center">
            <p className="text-[11px] md:text-xs font-medium text-slate-400 tracking-wide max-w-[280px] mx-auto">
              Sistem akan memvalidasi otorisasi perangkat secara otomatis. Mohon tunggu sesaat.
            </p>
          </div>

        </section>
      </main>
    </>
  );
}

// Suspense Boundary untuk useSearchParams
export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}