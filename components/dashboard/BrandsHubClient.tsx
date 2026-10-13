'use client';

import { useState, useMemo } from 'react';
import { Icons } from '@/components/ui/Icons';

// ─── Types ─────────────────────────────────────────────────────────────
type ServiceKey = 'shop_opt' | 'live_streaming' | 'content' | 'kol';
type PlatformKey = 'shopee' | 'tiktok' | 'tokopedia' | 'lazada';
type BrandStatus = 'active' | 'inactive' | 'onboarding';

interface ServiceEntry {
  key: ServiceKey;
  pic: string;
  since: string; // YYYY-MM
  note?: string;
}

interface StoreChannel {
  platform: PlatformKey;
  store_name: string;
  url?: string;
}

interface TaskSummary {
  total: number;
  ongoing: number;
  review: number;
  done: number;
}

interface BrandEntry {
  id: string;
  name: string;
  category: string; // e.g. "Kecantikan & Skincare"
  pic_account: string; // Account Manager / PIC internal
  since: string; // YYYY-MM
  status: BrandStatus;
  services: ServiceEntry[];
  channels: StoreChannel[];
  tasks: TaskSummary;
  gmv_last_month: number; // Rp
  roas_avg: number;
  notes?: string;
}

// ─── Config ────────────────────────────────────────────────────────────
const SERVICE_CONFIG: Record<ServiceKey, { label: string; color: string; bg: string }> = {
  shop_opt: { label: 'Shop Opt', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25' },
  live_streaming: { label: 'Live Stream', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/25' },
  content: { label: 'Content', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/25' },
  kol: { label: 'KOL & Afiliasi', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
};

const PLATFORM_CONFIG: Record<PlatformKey, { label: string; color: string }> = {
  shopee: { label: 'Shopee', color: 'text-orange-400' },
  tiktok: { label: 'TikTok Shop', color: 'text-pink-400' },
  tokopedia: { label: 'Tokopedia', color: 'text-green-400' },
  lazada: { label: 'Lazada', color: 'text-blue-400' },
};

const STATUS_CONFIG: Record<BrandStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Aktif', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
  inactive: { label: 'Nonaktif', color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' },
  onboarding: { label: 'Onboarding', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25' },
};

// ─── Dummy Data ─────────────────────────────────────────────────────────
const BRANDS_DATA: BrandEntry[] = [
  {
    id: 'b-1',
    name: 'Somethinc Official',
    category: 'Kecantikan & Skincare',
    pic_account: 'Fikri Haikal',
    since: '2024-03',
    status: 'active',
    services: [
      { key: 'shop_opt', pic: 'Fikri Haikal', since: '2024-03', note: 'Full marketplace management Shopee & Tokopedia' },
      { key: 'live_streaming', pic: 'Rian Pratama', since: '2024-06', note: 'Live harian 20.00–22.00 WIB' },
      { key: 'content', pic: 'Nadia Rahma', since: '2024-06', note: '8 video/bulan + 30 konten feed' },
      { key: 'kol', pic: 'Dimas Ananta', since: '2024-09', note: 'Managed 12 KOL tier mikro' },
    ],
    channels: [
      { platform: 'shopee', store_name: 'Somethinc Official Store', url: 'https://shopee.co.id/somethinc' },
      { platform: 'tiktok', store_name: 'Somethinc TikTok Shop', url: 'https://tiktok.com/@somethinc' },
      { platform: 'tokopedia', store_name: 'Somethinc Official', url: 'https://tokopedia.com/somethinc' },
    ],
    tasks: { total: 18, ongoing: 7, review: 3, done: 8 },
    gmv_last_month: 287500000,
    roas_avg: 4.8,
    notes: 'Brand prioritas, rilis produk serum baru Oktober 2026.',
  },
  {
    id: 'b-2',
    name: 'Buttonscarves Beauty',
    category: 'Fashion & Beauty',
    pic_account: 'Fikri Haikal',
    since: '2024-01',
    status: 'active',
    services: [
      { key: 'shop_opt', pic: 'Fikri Haikal', since: '2024-01', note: 'Audit bulanan skor toko & iklan' },
      { key: 'live_streaming', pic: 'Rian Pratama', since: '2024-04', note: '3x seminggu live hijab & modest fashion' },
    ],
    channels: [
      { platform: 'shopee', store_name: 'Buttonscarves Official', url: 'https://shopee.co.id/buttonscarves' },
      { platform: 'tiktok', store_name: 'Buttonscarves.id', url: 'https://tiktok.com/@buttonscarves.id' },
    ],
    tasks: { total: 11, ongoing: 4, review: 2, done: 5 },
    gmv_last_month: 193000000,
    roas_avg: 3.9,
    notes: 'Fokus live flash sale di TikTok setiap Jumat malam.',
  },
  {
    id: 'b-3',
    name: 'Cosmax Store',
    category: 'OEM Kosmetik',
    pic_account: 'Dimas Ananta',
    since: '2024-07',
    status: 'active',
    services: [
      { key: 'shop_opt', pic: 'Dimas Ananta', since: '2024-07', note: 'Optimasi produk private label' },
      { key: 'content', pic: 'Nadia Rahma', since: '2024-08', note: 'Fotografi produk & reels' },
    ],
    channels: [
      { platform: 'shopee', store_name: 'Cosmax Official ID', url: 'https://shopee.co.id/cosmax' },
      { platform: 'tokopedia', store_name: 'Cosmax Store', url: 'https://tokopedia.com/cosmax' },
      { platform: 'lazada', store_name: 'Cosmax Lazada', url: 'https://lazada.co.id/cosmax' },
    ],
    tasks: { total: 8, ongoing: 3, review: 1, done: 4 },
    gmv_last_month: 112000000,
    roas_avg: 3.2,
    notes: 'Onboarding Lazada baru selesai September 2026.',
  },
  {
    id: 'b-4',
    name: 'Wardah Cosmetics',
    category: 'Kecantikan Halal',
    pic_account: 'Nadia Rahma',
    since: '2025-01',
    status: 'onboarding',
    services: [
      { key: 'live_streaming', pic: 'Rian Pratama', since: '2025-01', note: 'Pilot live 3x per minggu' },
      { key: 'kol', pic: 'Dimas Ananta', since: '2025-01', note: 'Onboarding 8 KOL tier nano' },
    ],
    channels: [
      { platform: 'tiktok', store_name: 'Wardah TikTok Shop', url: 'https://tiktok.com/@wardah.id' },
      { platform: 'shopee', store_name: 'Wardah Official Store', url: 'https://shopee.co.id/wardah' },
    ],
    tasks: { total: 6, ongoing: 4, review: 2, done: 0 },
    gmv_last_month: 0,
    roas_avg: 0,
    notes: 'Masih onboarding, target GMV pertama Oktober 2026.',
  },
  {
    id: 'b-5',
    name: 'Erha Dermatology',
    category: 'Dermatologi & Medis',
    pic_account: 'Fikri Haikal',
    since: '2023-08',
    status: 'inactive',
    services: [
      { key: 'shop_opt', pic: '-', since: '2023-08', note: 'Kontrak tidak diperpanjang' },
    ],
    channels: [
      { platform: 'shopee', store_name: 'Erha Official Store', url: '' },
    ],
    tasks: { total: 3, ongoing: 0, review: 0, done: 3 },
    gmv_last_month: 0,
    roas_avg: 0,
    notes: 'Kontrak selesai Agustus 2026. Kemungkinan re-engagement Q1 2027.',
  },
];

// ─── Helper ─────────────────────────────────────────────────────────────
function formatRupiah(v: number) {
  if (v === 0) return '—';
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}M`;
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${v.toLocaleString('id-ID')}`;
}

function taskProgressPct(t: TaskSummary) {
  if (t.total === 0) return 0;
  return Math.round((t.done / t.total) * 100);
}

// ─── Component ──────────────────────────────────────────────────────────
export default function BrandsHubClient() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BrandStatus>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | ServiceKey>('all');
  const [selectedBrand, setSelectedBrand] = useState<BrandEntry | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    return BRANDS_DATA.filter((b) => {
      const matchSearch =
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase()) ||
        b.pic_account.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchService = serviceFilter === 'all' || b.services.some((s) => s.key === serviceFilter);
      return matchSearch && matchStatus && matchService;
    });
  }, [search, statusFilter, serviceFilter]);

  const totalActive = BRANDS_DATA.filter((b) => b.status === 'active').length;
  const totalOnboarding = BRANDS_DATA.filter((b) => b.status === 'onboarding').length;
  const totalServices = BRANDS_DATA.filter((b) => b.status === 'active').reduce((acc, b) => acc + b.services.length, 0);
  const totalGmv = BRANDS_DATA.filter((b) => b.status === 'active').reduce((acc, b) => acc + b.gmv_last_month, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Direktori Brand Partner
            </span>
            <span className="text-slate-500 text-xs font-mono">{BRANDS_DATA.length} Brand Terdaftar</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Brands</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Profil brand partner, servis yang berjalan, channel toko, dan overview progres pengerjaan
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
        >
          <Icons.Plus size={14} />
          <span>Tambah Brand</span>
        </button>
      </div>

      {/* ─── Summary KPI Strip ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Brand Aktif', value: totalActive, color: 'text-emerald-400', bar: 'bg-emerald-500' },
          { label: 'Onboarding', value: totalOnboarding, color: 'text-amber-400', bar: 'bg-amber-500' },
          { label: 'Total Servis Aktif', value: totalServices, color: 'text-blue-400', bar: 'bg-blue-500' },
          { label: 'GMV Bulan Ini', value: formatRupiah(totalGmv), color: 'text-slate-200', bar: 'bg-slate-500' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#0D131F] border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mb-1">{kpi.label}</p>
            <p className={`text-2xl font-bold font-mono tabular-nums ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* ─── Filters ─── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama brand, kategori, atau PIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-xs bg-[#0D131F] border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-3 py-2 text-xs bg-[#0D131F] border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-amber-500/50 transition-colors"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="onboarding">Onboarding</option>
          <option value="inactive">Nonaktif</option>
        </select>
        {/* Service Filter */}
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value as typeof serviceFilter)}
          className="px-3 py-2 text-xs bg-[#0D131F] border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-amber-500/50 transition-colors"
        >
          <option value="all">Semua Servis</option>
          <option value="shop_opt">Shop Optimization</option>
          <option value="live_streaming">Live Streaming</option>
          <option value="content">Content Production</option>
          <option value="kol">KOL & Afiliasi</option>
        </select>
      </div>

      {/* ─── Brand Cards Grid ─── */}
      {filtered.length === 0 ? (
        <div className="bg-[#0D131F] border border-slate-800 rounded-2xl p-16 text-center">
          <p className="text-slate-400 text-sm">Tidak ada brand yang cocok dengan filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((brand) => {
            const st = STATUS_CONFIG[brand.status];
            const pct = taskProgressPct(brand.tasks);
            return (
              <div
                key={brand.id}
                className="bg-[#0D131F] border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors cursor-pointer"
                onClick={() => setSelectedBrand(brand)}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-400 font-bold text-base">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{brand.name}</h3>
                      <p className="text-slate-500 text-[11px]">{brand.category}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${st.color} ${st.bg} flex-shrink-0`}>
                    {st.label}
                  </span>
                </div>

                {/* Services */}
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Servis Berjalan</p>
                  <div className="flex flex-wrap gap-1.5">
                    {brand.services.map((s) => {
                      const sc = SERVICE_CONFIG[s.key];
                      return (
                        <span
                          key={s.key}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded border ${sc.color} ${sc.bg}`}
                        >
                          {sc.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Channel Toko</p>
                  <div className="flex flex-wrap gap-2">
                    {brand.channels.map((ch) => {
                      const pc = PLATFORM_CONFIG[ch.platform];
                      return (
                        <span key={ch.platform} className={`text-[11px] font-medium ${pc.color}`}>
                          {pc.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Progress & KPIs */}
                <div className="grid grid-cols-3 gap-3 pt-1 border-t border-slate-800/60">
                  {/* Task Progress */}
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Task Progres</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-300">{pct}%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {brand.tasks.done}/{brand.tasks.total} selesai
                    </p>
                  </div>
                  {/* GMV */}
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">GMV (Bln Ini)</p>
                    <p className="text-sm font-bold font-mono text-slate-200">{formatRupiah(brand.gmv_last_month)}</p>
                  </div>
                  {/* ROAS */}
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">ROAS Avg</p>
                    <p className={`text-sm font-bold font-mono ${brand.roas_avg >= 3 ? 'text-emerald-400' : brand.roas_avg > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                      {brand.roas_avg > 0 ? `${brand.roas_avg}x` : '—'}
                    </p>
                  </div>
                </div>

                {/* PIC & Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <Icons.User size={12} className="text-slate-500" />
                    <span className="text-[11px] text-slate-400">PIC: <span className="text-slate-200">{brand.pic_account}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    {brand.tasks.ongoing > 0 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {brand.tasks.ongoing} Berjalan
                      </span>
                    )}
                    {brand.tasks.review > 0 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {brand.tasks.review} Review
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedBrand(brand); }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5 transition-colors"
                    >
                      Detail <Icons.ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Brand Detail Modal ─── */}
      {selectedBrand && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-8 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0D131F] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-lg">{selectedBrand.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-base font-bold text-white">{selectedBrand.name}</h2>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${STATUS_CONFIG[selectedBrand.status].color} ${STATUS_CONFIG[selectedBrand.status].bg}`}>
                      {STATUS_CONFIG[selectedBrand.status].label}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{selectedBrand.category} · Partner sejak {selectedBrand.since}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBrand(null)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* KPI Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Task', value: selectedBrand.tasks.total },
                  { label: 'GMV Bulan Ini', value: formatRupiah(selectedBrand.gmv_last_month) },
                  { label: 'ROAS Avg', value: selectedBrand.roas_avg > 0 ? `${selectedBrand.roas_avg}x` : '—' },
                ].map((k) => (
                  <div key={k.label} className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{k.label}</p>
                    <p className="text-xl font-bold font-mono text-slate-200">{k.value}</p>
                  </div>
                ))}
              </div>

              {/* Task Status Breakdown */}
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-3">Status Task Operasional</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Total', count: selectedBrand.tasks.total, color: 'text-slate-300', bg: 'bg-slate-800 border-slate-700' },
                    { label: 'Berjalan', count: selectedBrand.tasks.ongoing, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/25' },
                    { label: 'Review', count: selectedBrand.tasks.review, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/25' },
                    { label: 'Selesai', count: selectedBrand.tasks.done, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-xl p-3 border text-center ${item.bg}`}>
                      <p className={`text-lg font-bold font-mono ${item.color}`}>{item.count}</p>
                      <p className="text-[10px] text-slate-500">{item.label}</p>
                    </div>
                  ))}
                </div>
                {/* Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Progres Keseluruhan</span>
                    <span className="font-mono">{taskProgressPct(selectedBrand.tasks)}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all"
                      style={{ width: `${taskProgressPct(selectedBrand.tasks)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Servis Detail */}
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-3">Servis & Tim Pengerjaan</p>
                <div className="space-y-2">
                  {selectedBrand.services.map((s) => {
                    const sc = SERVICE_CONFIG[s.key];
                    return (
                      <div key={s.key} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${sc.color} ${sc.bg} flex-shrink-0 mt-0.5`}>
                          {sc.label}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-slate-200">PIC: {s.pic}</p>
                            <p className="text-[10px] text-slate-500 flex-shrink-0">Sejak {s.since}</p>
                          </div>
                          {s.note && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{s.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Channel Toko */}
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-3">Channel Toko Dikelola</p>
                <div className="space-y-2">
                  {selectedBrand.channels.map((ch) => {
                    const pc = PLATFORM_CONFIG[ch.platform];
                    return (
                      <div key={ch.platform} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold ${pc.color}`}>{pc.label}</span>
                          <span className="text-xs text-slate-300">{ch.store_name}</span>
                        </div>
                        {ch.url ? (
                          <a
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            Buka →
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-600">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              {selectedBrand.notes && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold mb-1">Catatan</p>
                  <p className="text-xs text-slate-300">{selectedBrand.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Icons.User size={12} className="text-slate-500" />
                  <span className="text-[11px] text-slate-400">Account Manager: <span className="text-slate-200">{selectedBrand.pic_account}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700">
                    Edit Profil Brand
                  </button>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors border border-amber-500/25"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Brand Modal (Placeholder) ─── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0D131F] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Tambah Brand Baru</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nama Brand *</label>
                <input
                  type="text"
                  placeholder="Contoh: Somethinc Official"
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Kategori</label>
                <input
                  type="text"
                  placeholder="Contoh: Kecantikan & Skincare"
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Account Manager</label>
                  <input
                    type="text"
                    placeholder="Nama PIC"
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500">
                    <option value="active">Aktif</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Catatan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan internal tentang brand..."
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
              >
                Simpan Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
