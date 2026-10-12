import { getAuthUser } from '@/lib/auth';

export default async function ContentProductionPage() {
  await getAuthUser();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Content Production Operations</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            TikTok & Reels Creative
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Tracking output video kreatif, foto produk, engagement rate, dan status delivery konten brand.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total Video Diproduksi</p>
          <p className="text-2xl font-black text-white mt-1">128 Video</p>
          <p className="text-[11px] text-purple-400 mt-2 font-medium">Bulan Ini</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total Views Akumulasi</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">8.4M Views</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">↑ +32% MoM</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Rata-Rata Engagement</p>
          <p className="text-2xl font-black text-amber-400 mt-1">6.8%</p>
          <p className="text-[11px] text-slate-400 mt-2">Benchmark E-Comm: 4.5%</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Winning Creatives</p>
          <p className="text-2xl font-black text-white mt-1">14 Konten</p>
          <p className="text-[11px] text-blue-400 mt-2 font-medium">Digunakan untuk Spark Ads</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="text-4xl mb-3">🎬</div>
        <h3 className="text-white font-bold text-base">Modul Content Production Analytics</h3>
        <p className="text-slate-400 text-xs max-w-md mx-auto mt-1">
          Pipeline status produksi (Scripting, Shooting, Editing, Approved) dan tracking performa views konten per brand.
        </p>
      </div>
    </div>
  );
}
