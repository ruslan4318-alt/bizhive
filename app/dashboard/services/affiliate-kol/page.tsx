import { getAuthUser } from '@/lib/auth';

export default async function AffiliateKolPage() {
  await getAuthUser();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">KOL & Affiliate Operations</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Creator Network & Endorsements
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Monitoring jaringan 5.000+ creator afiliasi, sample produk terkirim, dan omset GMV afiliasi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Total Creator Aktif</p>
          <p className="text-2xl font-black text-white mt-1">1.420 Creator</p>
          <p className="text-[11px] text-cyan-400 mt-2 font-medium">Posting bulan ini</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">GMV Penjualan Afiliasi</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">Rp 640.800.000</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">↑ +24.1% vs bulan lalu</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Sample Produk Terkirim</p>
          <p className="text-2xl font-black text-amber-400 mt-1">380 Paket</p>
          <p className="text-[11px] text-slate-400 mt-2">Conversion rate sample: 78%</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Top Tier KOL Endorse</p>
          <p className="text-2xl font-black text-white mt-1">24 Influencers</p>
          <p className="text-[11px] text-purple-400 mt-2 font-medium">Kampanye aktif</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="text-4xl mb-3">🤝</div>
        <h3 className="text-white font-bold text-base">Modul KOL & Affiliate Analytics</h3>
        <p className="text-slate-400 text-xs max-w-md mx-auto mt-1">
          Tracking ROI per endorsement, daftar creator terafiliasi, dan pengiriman sample produk antar brand.
        </p>
      </div>
    </div>
  );
}
