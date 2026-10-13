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
  since: string;
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
  category: string;
  pic_account: string;
  since: string;
  status: BrandStatus;
  services: ServiceEntry[];
  channels: StoreChannel[];
  tasks: TaskSummary;
  gmv_last_month: number;
  roas_avg: number;
  notes?: string;
}

// ─── Config ────────────────────────────────────────────────────────────
const SERVICE_CONFIG: Record<ServiceKey, { label: string; color: string; bg: string }> = {
  shop_opt:       { label: 'Shop Opt',      color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  live_streaming: { label: 'Live Stream',   color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  content:        { label: 'Content',       color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200' },
  kol:            { label: 'KOL & Afiliasi',color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
};

const PLATFORM_CONFIG: Record<PlatformKey, { label: string; color: string }> = {
  shopee:    { label: 'Shopee',      color: 'text-orange-600' },
  tiktok:    { label: 'TikTok Shop', color: 'text-gray-800' },
  tokopedia: { label: 'Tokopedia',   color: 'text-green-700' },
  lazada:    { label: 'Lazada',      color: 'text-blue-600' },
};

const STATUS_CONFIG: Record<BrandStatus, { label: string; color: string; bg: string }> = {
  active:     { label: 'Aktif',       color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  inactive:   { label: 'Nonaktif',    color: 'text-gray-500',    bg: 'bg-gray-100 border-gray-200' },
  onboarding: { label: 'Onboarding',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
};

const ALL_SERVICES: ServiceKey[] = ['shop_opt', 'live_streaming', 'content', 'kol'];

// ─── Default Brands Data ────────────────────────────────────────────────
const DEFAULT_BRANDS: BrandEntry[] = [
  {
    id: 'b-1',
    name: 'Somethinc Official',
    category: 'Kecantikan & Skincare',
    pic_account: 'Fikri Haikal',
    since: '2024-03',
    status: 'active',
    services: [
      { key: 'shop_opt',       pic: 'Fikri Haikal', since: '2024-03', note: 'Full marketplace management Shopee & Tokopedia' },
      { key: 'live_streaming', pic: 'Rian Pratama',  since: '2024-06', note: 'Live harian 20.00–22.00 WIB' },
      { key: 'content',        pic: 'Nadia Rahma',   since: '2024-06', note: '8 video/bulan + 30 konten feed' },
      { key: 'kol',            pic: 'Dimas Ananta',  since: '2024-09', note: 'Managed 12 KOL tier mikro' },
    ],
    channels: [
      { platform: 'shopee',    store_name: 'Somethinc Official Store', url: 'https://shopee.co.id/somethinc' },
      { platform: 'tiktok',    store_name: 'Somethinc TikTok Shop',    url: 'https://tiktok.com/@somethinc' },
      { platform: 'tokopedia', store_name: 'Somethinc Official',       url: 'https://tokopedia.com/somethinc' },
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
      { key: 'shop_opt',       pic: 'Fikri Haikal', since: '2024-01', note: 'Audit bulanan skor toko & iklan' },
      { key: 'live_streaming', pic: 'Rian Pratama',  since: '2024-04', note: '3x seminggu live hijab & modest fashion' },
    ],
    channels: [
      { platform: 'shopee', store_name: 'Buttonscarves Official',  url: 'https://shopee.co.id/buttonscarves' },
      { platform: 'tiktok', store_name: 'Buttonscarves.id',        url: 'https://tiktok.com/@buttonscarves.id' },
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
      { key: 'content',  pic: 'Nadia Rahma',  since: '2024-08', note: 'Fotografi produk & reels' },
    ],
    channels: [
      { platform: 'shopee',    store_name: 'Cosmax Official ID', url: 'https://shopee.co.id/cosmax' },
      { platform: 'tokopedia', store_name: 'Cosmax Store',       url: 'https://tokopedia.com/cosmax' },
      { platform: 'lazada',    store_name: 'Cosmax Lazada',      url: 'https://lazada.co.id/cosmax' },
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
      { key: 'kol',            pic: 'Dimas Ananta', since: '2025-01', note: 'Onboarding 8 KOL tier nano' },
    ],
    channels: [
      { platform: 'tiktok', store_name: 'Wardah TikTok Shop',    url: 'https://tiktok.com/@wardah.id' },
      { platform: 'shopee', store_name: 'Wardah Official Store',  url: 'https://shopee.co.id/wardah' },
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

// ─── Blank form ────────────────────────────────────────────────────────
const blankForm = (): Omit<BrandEntry, 'id' | 'tasks' | 'services' | 'channels'> & {
  services: ServiceKey[];
  channels: { platform: PlatformKey; store_name: string; url: string }[];
} => ({
  name: '',
  category: '',
  pic_account: '',
  since: new Date().toISOString().slice(0, 7),
  status: 'active',
  gmv_last_month: 0,
  roas_avg: 0,
  notes: '',
  services: [],
  channels: [],
});

// ─── Helpers ───────────────────────────────────────────────────────────
function formatRupiah(v: number) {
  if (v === 0) return '—';
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}M`;
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${v.toLocaleString('id-ID')}`;
}

function taskPct(t: TaskSummary) {
  return t.total === 0 ? 0 : Math.round((t.done / t.total) * 100);
}

// ─── Component ──────────────────────────────────────────────────────────
export default function BrandsHubClient() {
  const [brands, setBrands] = useState<BrandEntry[]>(DEFAULT_BRANDS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BrandStatus>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | ServiceKey>('all');

  // Detail modal
  const [selectedBrand, setSelectedBrand] = useState<BrandEntry | null>(null);

  // Add / Edit modal
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm());

  // ── Filter ──
  const filtered = useMemo(() => {
    return brands.filter((b) => {
      const matchSearch =
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase()) ||
        b.pic_account.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchService =
        serviceFilter === 'all' || b.services.some((s) => s.key === serviceFilter);
      return matchSearch && matchStatus && matchService;
    });
  }, [brands, search, statusFilter, serviceFilter]);

  // ── Summary ──
  const totalActive = brands.filter((b) => b.status === 'active').length;
  const totalOnboarding = brands.filter((b) => b.status === 'onboarding').length;
  const totalServices = brands
    .filter((b) => b.status === 'active')
    .reduce((acc, b) => acc + b.services.length, 0);
  const totalGmv = brands
    .filter((b) => b.status === 'active')
    .reduce((acc, b) => acc + b.gmv_last_month, 0);

  // ── Open Add Modal ──
  const openAdd = () => {
    setForm(blankForm());
    setEditingId(null);
    setModalMode('add');
  };

  // ── Open Edit Modal ──
  const openEdit = (brand: BrandEntry) => {
    setForm({
      name: brand.name,
      category: brand.category,
      pic_account: brand.pic_account,
      since: brand.since,
      status: brand.status,
      gmv_last_month: brand.gmv_last_month,
      roas_avg: brand.roas_avg,
      notes: brand.notes || '',
      services: brand.services.map((s) => s.key),
      channels: brand.channels.map((c) => ({
        platform: c.platform,
        store_name: c.store_name,
        url: c.url || '',
      })),
    });
    setEditingId(brand.id);
    setModalMode('edit');
    setSelectedBrand(null); // close detail modal
  };

  // ── Toggle service checkbox ──
  const toggleService = (key: ServiceKey) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(key)
        ? prev.services.filter((s) => s !== key)
        : [...prev.services, key],
    }));
  };

  // ── Save (Add or Edit) ──
  const handleSave = () => {
    if (!form.name.trim()) return;

    if (editingId) {
      // Edit
      setBrands((prev) =>
        prev.map((b) =>
          b.id !== editingId
            ? b
            : {
                ...b,
                name: form.name,
                category: form.category,
                pic_account: form.pic_account,
                since: form.since,
                status: form.status,
                gmv_last_month: form.gmv_last_month,
                roas_avg: form.roas_avg,
                notes: form.notes,
                services: form.services.map((key) => ({
                  key,
                  pic: b.services.find((s) => s.key === key)?.pic || '-',
                  since: b.services.find((s) => s.key === key)?.since || form.since,
                  note: b.services.find((s) => s.key === key)?.note || '',
                })),
                channels: form.channels.map((c) => ({
                  platform: c.platform,
                  store_name: c.store_name,
                  url: c.url,
                })),
              }
        )
      );
    } else {
      // Add
      const newBrand: BrandEntry = {
        id: `b-${Date.now()}`,
        name: form.name,
        category: form.category,
        pic_account: form.pic_account,
        since: form.since,
        status: form.status,
        gmv_last_month: form.gmv_last_month,
        roas_avg: form.roas_avg,
        notes: form.notes,
        services: form.services.map((key) => ({
          key,
          pic: form.pic_account || '-',
          since: form.since,
        })),
        channels: form.channels.map((c) => ({
          platform: c.platform,
          store_name: c.store_name,
          url: c.url,
        })),
        tasks: { total: 0, ongoing: 0, review: 0, done: 0 },
      };
      setBrands((prev) => [newBrand, ...prev]);
    }
    setModalMode(null);
    setEditingId(null);
  };

  // ── Delete ──
  const handleDelete = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    setSelectedBrand(null);
  };

  // ── Channel helpers ──
  const addChannel = () => {
    setForm((prev) => ({
      ...prev,
      channels: [...prev.channels, { platform: 'shopee', store_name: '', url: '' }],
    }));
  };

  const updateChannel = (
    idx: number,
    field: 'platform' | 'store_name' | 'url',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      ),
    }));
  };

  const removeChannel = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.filter((_, i) => i !== idx),
    }));
  };

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Direktori Brand Partner</p>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Profil brand, servis aktif, channel toko, dan overview progres operasional
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm transition-colors"
        >
          <Icons.Plus size={14} />
          Tambah Brand
        </button>
      </div>

      {/* ─── KPI Strip ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Brand Aktif',       value: totalActive,              accent: 'text-emerald-600' },
          { label: 'Onboarding',        value: totalOnboarding,          accent: 'text-amber-600' },
          { label: 'Total Servis Aktif',value: totalServices,            accent: 'text-blue-600' },
          { label: 'GMV Bulan Ini',     value: formatRupiah(totalGmv),   accent: 'text-gray-900' },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-gray-400 text-xs font-medium mb-1">{k.label}</p>
            <p className={`text-2xl font-bold tabular-nums ${k.accent}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* ─── Filters ─── */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama brand, kategori, atau PIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="onboarding">Onboarding</option>
          <option value="inactive">Nonaktif</option>
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value as typeof serviceFilter)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">Semua Servis</option>
          <option value="shop_opt">Shop Optimization</option>
          <option value="live_streaming">Live Streaming</option>
          <option value="content">Content Production</option>
          <option value="kol">KOL & Afiliasi</option>
        </select>
      </div>

      {/* ─── Brand Grid ─── */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <p className="text-gray-400 text-sm">Tidak ada brand yang cocok dengan filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((brand) => {
            const st = STATUS_CONFIG[brand.status];
            const pct = taskPct(brand.tasks);
            return (
              <div
                key={brand.id}
                className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => setSelectedBrand(brand)}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-600 font-bold text-base">{brand.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{brand.name}</h3>
                      <p className="text-gray-400 text-xs">{brand.category}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${st.color} ${st.bg} flex-shrink-0`}>
                    {st.label}
                  </span>
                </div>

                {/* Services */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">Servis</p>
                  <div className="flex flex-wrap gap-1.5">
                    {brand.services.map((s) => {
                      const sc = SERVICE_CONFIG[s.key];
                      return (
                        <span key={s.key} className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sc.color} ${sc.bg}`}>
                          {sc.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Channels */}
                <div className="flex items-center gap-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mr-1">Channel:</p>
                  {brand.channels.map((ch) => (
                    <span key={ch.platform} className={`text-xs font-medium ${PLATFORM_CONFIG[ch.platform].color}`}>
                      {PLATFORM_CONFIG[ch.platform].label}
                    </span>
                  )).reduce<React.ReactNode[]>((acc, el, i) =>
                    i === 0 ? [el] : [...acc, <span key={`sep-${i}`} className="text-gray-300">·</span>, el], []
                  )}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">Task Progres</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-gray-700">{pct}%</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{brand.tasks.done}/{brand.tasks.total}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">GMV Bulan Ini</p>
                    <p className="text-sm font-bold tabular-nums text-gray-900">{formatRupiah(brand.gmv_last_month)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">ROAS</p>
                    <p className={`text-sm font-bold tabular-nums ${brand.roas_avg >= 3 ? 'text-emerald-600' : brand.roas_avg > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {brand.roas_avg > 0 ? `${brand.roas_avg}x` : '—'}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Icons.User size={12} className="text-gray-400" />
                    <span>{brand.pic_account}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {brand.tasks.ongoing > 0 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {brand.tasks.ongoing} Berjalan
                      </span>
                    )}
                    {brand.tasks.review > 0 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        {brand.tasks.review} Review
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Brand Detail Modal ─── */}
      {selectedBrand && !modalMode && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-lg">{selectedBrand.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-base font-bold text-gray-900">{selectedBrand.name}</h2>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_CONFIG[selectedBrand.status].color} ${STATUS_CONFIG[selectedBrand.status].bg}`}>
                      {STATUS_CONFIG[selectedBrand.status].label}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{selectedBrand.category} · Partner sejak {selectedBrand.since}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBrand(null)} className="text-gray-400 hover:text-gray-700 p-1 transition-colors">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* KPI Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Task',    value: selectedBrand.tasks.total },
                  { label: 'GMV Bulan Ini', value: formatRupiah(selectedBrand.gmv_last_month) },
                  { label: 'ROAS Avg',      value: selectedBrand.roas_avg > 0 ? `${selectedBrand.roas_avg}x` : '—' },
                ].map((k) => (
                  <div key={k.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">{k.label}</p>
                    <p className="text-xl font-bold tabular-nums text-gray-900">{k.value}</p>
                  </div>
                ))}
              </div>

              {/* Task Status */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-3">Status Task</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Total',    count: selectedBrand.tasks.total,   color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200' },
                    { label: 'Berjalan', count: selectedBrand.tasks.ongoing, color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
                    { label: 'Review',   count: selectedBrand.tasks.review,  color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
                    { label: 'Selesai',  count: selectedBrand.tasks.done,    color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-200' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-xl p-3 border text-center ${item.bg}`}>
                      <p className={`text-lg font-bold tabular-nums ${item.color}`}>{item.count}</p>
                      <p className="text-xs text-gray-400">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progres</span>
                    <span className="tabular-nums">{taskPct(selectedBrand.tasks)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${taskPct(selectedBrand.tasks)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Servis */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-3">Servis & Tim</p>
                <div className="space-y-2">
                  {selectedBrand.services.map((s) => {
                    const sc = SERVICE_CONFIG[s.key];
                    return (
                      <div key={s.key} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sc.color} ${sc.bg} flex-shrink-0`}>
                          {sc.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-800">PIC: {s.pic}</p>
                            <p className="text-xs text-gray-400">{s.since}</p>
                          </div>
                          {s.note && <p className="text-xs text-gray-500 mt-0.5">{s.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Channels */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-3">Channel Toko</p>
                <div className="space-y-2">
                  {selectedBrand.channels.map((ch) => {
                    const pc = PLATFORM_CONFIG[ch.platform];
                    return (
                      <div key={ch.platform} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold ${pc.color}`}>{pc.label}</span>
                          <span className="text-xs text-gray-700">{ch.store_name}</span>
                        </div>
                        {ch.url ? (
                          <a
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-amber-600 hover:text-amber-500 font-medium transition-colors"
                          >
                            Buka →
                          </a>
                        ) : <span className="text-xs text-gray-300">—</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              {selectedBrand.notes && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Catatan</p>
                  <p className="text-xs text-gray-700">{selectedBrand.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">AM: <span className="text-gray-800 font-medium">{selectedBrand.pic_account}</span></p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus brand "${selectedBrand.name}"?`)) {
                        handleDelete(selectedBrand.id);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => openEdit(selectedBrand)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-colors"
                  >
                    Edit Brand
                  </button>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-400 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Modal ─── */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">
                {modalMode === 'edit' ? 'Edit Brand' : 'Tambah Brand Baru'}
              </h2>
              <button onClick={() => setModalMode(null)} className="text-gray-400 hover:text-gray-700 p-1">✕</button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              {/* Nama */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Brand *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Somethinc Official"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Kategori + PIC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Kecantikan & Skincare"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Account Manager</label>
                  <input
                    type="text"
                    value={form.pic_account}
                    onChange={(e) => setForm({ ...form, pic_account: e.target.value })}
                    placeholder="Nama PIC"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Status + Since */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as BrandStatus })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="active">Aktif</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Partner Sejak</label>
                  <input
                    type="month"
                    value={form.since}
                    onChange={(e) => setForm({ ...form, since: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Servis */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Servis Aktif</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SERVICES.map((key) => {
                    const sc = SERVICE_CONFIG[key];
                    const checked = form.services.includes(key);
                    return (
                      <label
                        key={key}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          checked ? `${sc.bg} ${sc.color}` : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleService(key)}
                          className="w-3.5 h-3.5 accent-amber-500"
                        />
                        <span className="text-xs font-medium">{sc.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Channels */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">Channel Toko</label>
                  <button
                    type="button"
                    onClick={addChannel}
                    className="text-xs text-amber-600 hover:text-amber-500 font-medium"
                  >
                    + Tambah Channel
                  </button>
                </div>
                <div className="space-y-2">
                  {form.channels.map((ch, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <select
                        value={ch.platform}
                        onChange={(e) => updateChannel(idx, 'platform', e.target.value)}
                        className="px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-amber-400 w-32"
                      >
                        <option value="shopee">Shopee</option>
                        <option value="tiktok">TikTok Shop</option>
                        <option value="tokopedia">Tokopedia</option>
                        <option value="lazada">Lazada</option>
                      </select>
                      <input
                        type="text"
                        value={ch.store_name}
                        onChange={(e) => updateChannel(idx, 'store_name', e.target.value)}
                        placeholder="Nama toko"
                        className="flex-1 px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeChannel(idx)}
                        className="text-gray-400 hover:text-red-500 px-1 transition-colors text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {form.channels.length === 0 && (
                    <p className="text-xs text-gray-400 italic">Belum ada channel. Klik "+ Tambah Channel".</p>
                  )}
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Catatan Internal</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Catatan tentang brand..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setModalMode(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim()}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white transition-colors"
              >
                {modalMode === 'edit' ? 'Simpan Perubahan' : 'Tambah Brand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
