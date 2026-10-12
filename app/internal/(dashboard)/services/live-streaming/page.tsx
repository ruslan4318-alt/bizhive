import { getAuthUser } from '@/lib/auth';

export default async function LiveStreamingPage() {
  await getAuthUser();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Live Streaming Operations</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
            TikTok & Shopee Live
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Monitoring jam live streaming, performa host, GMV per jam live, dan jadwal shift studio.
        </p>
      </div>

      {/* 4 Preview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total Jam Streaming (Bulan Ini)</p>
          <p className="text-2xl font-black text-white mt-1">342 Jam</p>
          <p className="text-[11px] text-pink-400 mt-2 font-medium">8 Studio Aktif</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total Live GMV</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">Rp 480.200.000</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">↑ +18.5% vs bulan lalu</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Rata-rata GMV / Jam</p>
          <p className="text-2xl font-black text-amber-400 mt-1">Rp 1.404.000</p>
          <p className="text-[11px] text-slate-400 mt-2">Target: Rp 1.200.000/jam</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Peak Concurrent Viewers (PCV)</p>
          <p className="text-2xl font-black text-white mt-1">4.280</p>
          <p className="text-[11px] text-blue-400 mt-2 font-medium">Live Kampanye Payday</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="text-4xl mb-3">🎥</div>
        <h3 className="text-white font-bold text-base">Modul Live Streaming Analytics</h3>
        <p className="text-slate-400 text-xs max-w-md mx-auto mt-1">
          Grafik performa live harian, leaderboard host/streamer, dan log shift studio siap dihubungkan setelah modul Shop Optimization final.
        </p>
      </div>
    </div>
  );
}
