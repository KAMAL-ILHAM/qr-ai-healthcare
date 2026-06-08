'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  HeartPulse, 
  Stethoscope, 
  Hospital, 
  ShieldCheck, 
  Activity, 
  Pill,
  TerminalSquare
} from 'lucide-react';

// Komponen Card Ikon Melayang (Transparansi dinaikkan & Border diperhalus)
const FloatingIconCard = ({ children, delay, duration, positionClasses }: { children: React.ReactNode, delay: string, duration: string, positionClasses: string }) => (
  <div 
    className={`absolute z-0 flex items-center justify-center w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-[20px] md:rounded-[24px] bg-white/65 backdrop-blur-[16px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.04)] animate-float ${positionClasses}`}
    style={{ animationDelay: delay, animationDuration: duration }}
  >
    {children}
  </div>
);

export default function DemoAccessPage() {
  const [token, setToken] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [baseUrl, setBaseUrl] = useState<string>('');

  useEffect(() => {
    const host = window.location.host;
    const protocol = window.location.protocol;
    setBaseUrl(`${protocol}//${host}`);
  }, []);

  const fetchNewToken = async () => {
    try {
      const res = await fetch('/api/qr');
      const data = await res.json();
      setToken(data.token);
      setTimeLeft(45);
    } catch (error) {
      console.error('Gagal memuat token QR');
    }
  };

  useEffect(() => {
    fetchNewToken();
    const tokenInterval = setInterval(fetchNewToken, 45000);
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(tokenInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const targetUrl = `${baseUrl}/verify?token=${token}`;

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

      {/* Full Screen Lock */}
      <main className="relative h-screen w-screen flex items-center justify-center overflow-hidden" 
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.03), rgba(6,182,212,0.03))' }}>
        
        {/* Background Layers */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
        <div className="absolute inset-0 noise-overlay pointer-events-none mix-blend-overlay" />
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        {/* Floating Decorators */}
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

        {/* Main Demo Access Card (Padding disesuaikan untuk 100vh) */}
        <section className="relative z-10 w-[92%] max-w-[540px] p-6 md:p-8 rounded-[32px] bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] flex flex-col items-center animate-fade-in max-h-[95vh] flex-shrink-0">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-1.5 mb-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/10 mb-1">
              <TerminalSquare className="w-5 h-5 text-indigo-600" strokeWidth={2} />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              Demo Access
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-[320px]">
              Scan QR Code untuk mengakses platform demo EIOHealth.
            </p>
          </div>

          {/* QR Code Focus (Ukuran sedikit disesuaikan agar hemat ruang vertikal) */}
          <div className="relative flex items-center justify-center p-4 rounded-[24px] bg-white/90 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-sm">
            {token ? (
              <QRCodeSVG 
                value={targetUrl} 
                className="w-[180px] h-[180px] md:w-[240px] md:h-[240px]" 
                level="H" 
                includeMargin={false}
              />
            ) : (
              <div className="w-[180px] h-[180px] md:w-[240px] md:h-[240px] bg-slate-50 rounded-2xl animate-pulse" />
            )}
          </div>

          {/* Statistik Akses (Grid diubah menjadi 2 kolom rata) */}
          <div className="w-full grid grid-cols-2 gap-3 md:gap-4 mt-6">
            <div className="flex flex-col items-center text-center justify-center p-3 sm:p-4 rounded-2xl bg-white/50 border border-white/80 shadow-sm backdrop-blur-md">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Masa Berlaku</span>
              <span className="text-sm font-bold text-slate-800">45 Detik</span>
            </div>
            <div className="flex flex-col items-center text-center justify-center p-3 sm:p-4 rounded-2xl bg-white/50 border border-white/80 shadow-sm backdrop-blur-md">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Batas Pengguna/QR</span>
              <span className="text-sm font-bold text-slate-800">10 Orang</span>
            </div>
          </div>

          {/* Countdown Progress */}
          <div className="w-full mt-6 space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">QR Akan Diperbarui Dalam</span>
              <span className="text-sm sm:text-base font-bold text-slate-800 tabular-nums">{timeLeft} Detik</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(timeLeft / 45) * 100}%`, backgroundSize: '200% 100%' }}
              />
            </div>
          </div>

          {/* Informasi Ringkas Footer */}
          <div className="mt-5 pt-4 w-full border-t border-slate-200/50 text-center">
            <p className="text-[10px] md:text-xs font-medium text-slate-400 tracking-wide">
              QR diperbarui otomatis untuk menjaga stabilitas server demo.
            </p>
          </div>

        </section>
      </main>
    </>
  );
}