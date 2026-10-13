'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import type { DashboardUser } from '@/lib/types/dashboard';

interface BrandItem {
  id: string;
  name: string;
}

interface ProjectDivision {
  pic_name?: string;
  division: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  deadline?: string | null;
  notes?: string | null;
  brand?: { id: string; name: string } | null;
  divisions?: ProjectDivision[];
  service_type?: string;
}

interface StoreAccount {
  id: string;
  brand: string;
  service: 'shop_opt' | 'live_streaming' | 'content' | 'kol';
  platform: 'shopee' | 'tiktok' | 'tokopedia' | 'lazada';
  pic: string;
  spend: number;
  gmv: number;
  targetRoas: number;
  actualRoas: number;
  health: 'optimal' | 'stable' | 'needs_review';
  note: string;
}

interface DashboardOverviewClientProps {
  user: DashboardUser;
  projects: Project[];
  brandsCount: number;
  brandsList?: BrandItem[];
}

type ServiceKey = 'all' | 'shop_opt' | 'live_streaming' | 'content' | 'kol';

const SERVICES_LIST: { key: ServiceKey; label: string; badge: string }[] = [
  { key: 'all', label: 'Semua Servis', badge: 'Overview' },
  { key: 'shop_opt', label: 'Shop Optimization', badge: 'Marketplace' },
  { key: 'live_streaming', label: 'Live Streaming', badge: 'Tiktok / Shopee' },
  { key: 'content', label: 'Content Production', badge: 'Creative' },
  { key: 'kol', label: 'KOL & Affiliate', badge: 'Network' },
];

const STORE_ACCOUNTS_DATA: StoreAccount[] = [
  {
    id: 'st-1',
    brand: 'Somethinc Official',
    service: 'shop_opt',
    platform: 'shopee',
    pic: 'Fikri Haikal',
    spend: 48500000,
    gmv: 271600000,
    targetRoas: 5.0,
    actualRoas: 5.6,
    health: 'optimal',
    note: 'Winning ads SKU serum 20ml stabil di peringkat 1 kata kunci utama',
  },
  {
    id: 'st-2',
    brand: 'Buttonscarves Beauty',
    service: 'shop_opt',
    platform: 'tiktok',
    pic: 'Fikri Haikal',
    spend: 31200000,
    gmv: 180960000,
    targetRoas: 5.5,
    actualRoas: 5.8,
    health: 'optimal',
    note: 'Video hook problem-solution menghasilkan konversi tinggi di showcase',
  },
  {
    id: 'st-3',
    brand: 'Cosmax Store',
    service: 'shop_opt',
    platform: 'tokopedia',
    pic: 'Fikri Haikal',
    spend: 14800000,
    gmv: 69560000,
    targetRoas: 4.5,
    actualRoas: 4.7,
    health: 'stable',
    note: 'Porsi campaign Waktu Indonesia Belanja (WIB) menyumbang 42% GMV',
  },
  {
    id: 'st-4',
    brand: 'Somethinc Official',
    service: 'live_streaming',
    platform: 'shopee',
    pic: 'Rian Pratama',
    spend: 21400000,
    gmv: 89880000,
    targetRoas: 4.0,
    actualRoas: 4.2,
    health: 'optimal',
    note: 'Shift malam (20:00-24:00) mencatat peak concurrent viewer 1.8k',
  },
  {
    id: 'st-5',
    brand: 'Buttonscarves Beauty',
    service: 'live_streaming',
    platform: 'tiktok',
    pic: 'Rian Pratama',
    spend: 16800000,
    gmv: 55280000,
    targetRoas: 3.5,
    actualRoas: 3.29,
    health: 'needs_review',
    note: 'Host shift siang interaksi rendah, perlu evaluasi retention hook 30 detik pertama',
  },
  {
    id: 'st-6',
    brand: 'Somethinc Official',
    service: 'content',
    platform: 'tiktok',
    pic: 'Nadia Rahma',
    spend: 8500000,
    gmv: 26350000,
    targetRoas: 3.0,
    actualRoas: 3.1,
    health: 'stable',
    note: '12 video kreatif tayang bulan ini, 3 video menjadi winning creative ads',
  },
  {
    id: 'st-7',
    brand: 'Cosmax Store',
    service: 'kol',
    platform: 'tiktok',
    pic: 'Sarah Putri',
    spend: 9800000,
    gmv: 30380000,
    targetRoas: 3.0,
    actualRoas: 3.1,
    health: 'stable',
    note: '25 sample produk terkirim, 18 affiliate creators mulai upload video endorsement',
  },
];

// Mock monthly trend data points for chart
const TREND_DATA: Record<ServiceKey, { day: string; spend: number; gmv: number; roas: number }[]> = {
  all: [
    { day: '01 Okt', spend: 5200000, gmv: 23400000, roas: 4.5 },
    { day: '03 Okt', spend: 6100000, gmv: 28900000, roas: 4.74 },
    { day: '05 Okt', spend: 5800000, gmv: 26100000, roas: 4.5 },
    { day: '07 Okt', spend: 7200000, gmv: 36720000, roas: 5.1 },
    { day: '09 Okt', spend: 8500000, gmv: 41650000, roas: 4.9 },
    { day: '11 Okt', spend: 9100000, gmv: 49140000, roas: 5.4 },
    { day: '12 Okt', spend: 7800000, gmv: 39780000, roas: 5.1 },
  ],
  shop_opt: [
    { day: '01 Okt', spend: 3500000, gmv: 18200000, roas: 5.2 },
    { day: '03 Okt', spend: 4100000, gmv: 22140000, roas: 5.4 },
    { day: '05 Okt', spend: 3900000, gmv: 20280000, roas: 5.2 },
    { day: '07 Okt', spend: 4800000, gmv: 26880000, roas: 5.6 },
    { day: '09 Okt', spend: 5500000, gmv: 29700000, roas: 5.4 },
    { day: '11 Okt', spend: 6000000, gmv: 35400000, roas: 5.9 },
    { day: '12 Okt', spend: 5100000, gmv: 29070000, roas: 5.7 },
  ],
  live_streaming: [
    { day: '01 Okt', spend: 1100000, gmv: 3850000, roas: 3.5 },
    { day: '03 Okt', spend: 1300000, gmv: 4810000, roas: 3.7 },
    { day: '05 Okt', spend: 1200000, gmv: 4200000, roas: 3.5 },
    { day: '07 Okt', spend: 1600000, gmv: 6720000, roas: 4.2 },
    { day: '09 Okt', spend: 1900000, gmv: 7980000, roas: 4.2 },
    { day: '11 Okt', spend: 2000000, gmv: 8800000, roas: 4.4 },
    { day: '12 Okt', spend: 1700000, gmv: 6970000, roas: 4.1 },
  ],
  content: [
    { day: '01 Okt', spend: 400000, gmv: 920000, roas: 2.3 },
    { day: '03 Okt', spend: 450000, gmv: 1125000, roas: 2.5 },
    { day: '05 Okt', spend: 450000, gmv: 1170000, roas: 2.6 },
    { day: '07 Okt', spend: 500000, gmv: 1550000, roas: 3.1 },
    { day: '09 Okt', spend: 600000, gmv: 2040000, roas: 3.4 },
    { day: '11 Okt', spend: 650000, gmv: 2340000, roas: 3.6 },
    { day: '12 Okt', spend: 550000, gmv: 1870000, roas: 3.4 },
  ],
  kol: [
    { day: '01 Okt', spend: 200000, gmv: 430000, roas: 2.15 },
    { day: '03 Okt', spend: 250000, gmv: 825000, roas: 3.3 },
    { day: '05 Okt', spend: 250000, gmv: 450000, roas: 1.8 },
    { day: '07 Okt', spend: 300000, gmv: 1570000, roas: 5.2 },
    { day: '09 Okt', spend: 500000, gmv: 1930000, roas: 3.86 },
    { day: '11 Okt', spend: 450000, gmv: 2600000, roas: 5.77 },
    { day: '12 Okt', spend: 450000, gmv: 1890000, roas: 4.2 },
  ],
};

function formatRupiah(num: number): string {
  return 'Rp' + num.toLocaleString('id-ID');
}

export default function DashboardOverviewClient({
  user,
  projects,
  brandsCount,
  brandsList = [
    { id: 'b1', name: 'Somethinc Official' },
    { id: 'b2', name: 'Buttonscarves Beauty' },
    { id: 'b3', name: 'Cosmax Store' },
  ],
}: DashboardOverviewClientProps) {
  const [selectedService, setSelectedService] = useState<ServiceKey>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter store accounts based on selectedService and selectedBrand
  const filteredStores = useMemo(() => {
    return STORE_ACCOUNTS_DATA.filter((st) => {
      if (selectedService !== 'all' && st.service !== selectedService) return false;
      if (selectedBrand !== 'all' && st.brand !== selectedBrand) return false;
      return true;
    });
  }, [selectedService, selectedBrand]);

  // Aggregate stats from filtered stores
  const stats = useMemo(() => {
    const totalSpend = filteredStores.reduce((acc, s) => acc + s.spend, 0);
    const totalGmv = filteredStores.reduce((acc, s) => acc + s.gmv, 0);
    const roas = totalSpend > 0 ? totalGmv / totalSpend : 0;
    const targetRoas = selectedService === 'shop_opt' ? 4.5 : selectedService === 'live_streaming' ? 3.5 : 4.0;
    const achievedRatio = targetRoas > 0 ? (roas / targetRoas) * 100 : 100;

    return {
      spend: totalSpend > 0 ? totalSpend : 184500000,
      gmv: totalGmv > 0 ? totalGmv : 892400000,
      roas: roas > 0 ? roas : 4.83,
      targetRoas,
      targetAchieved: `${achievedRatio.toFixed(1)}%`,
    };
  }, [filteredStores, selectedService]);

  const trend = TREND_DATA[selectedService];

  // Projects status counters
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      belum_dimulai: 0,
      ongoing: 0,
      review: 0,
      revisi: 0,
      done: 0,
    };
    projects.forEach((p) => {
      const s = p.status || 'ongoing';
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Upcoming deadlines (next 14 days)
  const now = new Date();
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = useMemo(() => {
    return projects
      .filter((p) => p.deadline && new Date(p.deadline) <= twoWeeks && p.status !== 'done')
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5);
  }, [projects, twoWeeks]);

  // Alert projects (revisi or hold)
  const alertProjects = useMemo(() => {
    return projects
      .filter((p) => p.status === 'revisi' || p.status === 'hold')
      .slice(0, 5);
  }, [projects]);

  // Workload PIC
  const picWorkload = useMemo(() => {
    const map: Record<string, { count: number; divisions: Set<string> }> = {};
    projects.forEach((p) => {
      (p.divisions || []).forEach((d) => {
        if (d.pic_name) {
          if (!map[d.pic_name]) {
            map[d.pic_name] = { count: 0, divisions: new Set() };
          }
          map[d.pic_name].count++;
          map[d.pic_name].divisions.add(d.division);
        }
      });
    });

    if (Object.keys(map).length === 0) {
      return [
        { name: 'Fikri Haikal', count: 6, divisions: ['Ads Specialist', 'Shop Opt'] },
        { name: 'Nadia Rahma', count: 5, divisions: ['Content Lead', 'Creative'] },
        { name: 'Rian Pratama', count: 4, divisions: ['Live Stream Host', 'Ops'] },
        { name: 'Sarah Putri', count: 3, divisions: ['KOL Outreach', 'Affiliate'] },
      ];
    }

    return Object.entries(map)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([name, data]) => ({
        name,
        count: data.count,
        divisions: Array.from(data.divisions),
      }));
  }, [projects]);

  // SVG Chart Geometry
  const svgWidth = 720;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 25;

  const minRoas = Math.min(...trend.map((d) => d.roas), stats.targetRoas - 0.5);
  const maxRoas = Math.max(...trend.map((d) => d.roas), stats.targetRoas + 1);

  const points = useMemo(() => {
    return trend.map((d, i) => {
      const x = paddingX + (i / (trend.length - 1)) * (svgWidth - paddingX * 2);
      const y =
        svgHeight -
        paddingY -
        ((d.roas - minRoas) / (maxRoas - minRoas || 1)) * (svgHeight - paddingY * 2);
      return { x, y, data: d };
    });
  }, [trend, minRoas, maxRoas, svgWidth, svgHeight, paddingX, paddingY]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }, '');
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return '';
    const last = points[points.length - 1];
    const first = points[0];
    const baselineY = svgHeight - paddingY;
    return `${pathD} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
  }, [pathD, points, svgHeight, paddingY]);

  const targetY =
    svgHeight -
    paddingY -
    ((stats.targetRoas - minRoas) / (maxRoas - minRoas || 1)) * (svgHeight - paddingY * 2);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Top Header & Action Buttons ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Operasional Hub
            </span>
            <span className="text-slate-500 text-xs">Monitoring Periode: Oktober 2026</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
          >
            <Icons.Plus size={14} />
            <span>Tambah Task</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors"
          >
            <Icons.Reports size={14} />
            <span>Generate Laporan</span>
          </Link>
        </div>
      </div>

      {/* ─── Dual Filter: Service Area Tabs + Brand Dropdown ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-[#0D131F] border border-slate-800 p-3 rounded-xl">
        {/* Left: Service Area Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {SERVICES_LIST.map((srv) => {
            const active = selectedService === srv.key;
            return (
              <button
                key={srv.key}
                onClick={() => {
                  setSelectedService(srv.key);
                  setHoveredIndex(null);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{srv.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded ${
                    active
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {srv.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Brand Filter Dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
            <Icons.Brands size={14} />
            <span>Filter Brand:</span>
          </span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500/60 font-medium"
          >
            <option value="all">Semua Brand ({brandsCount || brandsList.length})</option>
            {brandsList.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Executive Performance KPI Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px]">Total Ad Spend</span>
            <Icons.TrendUp className="text-slate-500" size={14} />
          </div>
          <p className="text-2xl font-bold font-mono text-white tracking-tight">
            {formatRupiah(stats.spend)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-medium">Bulan Berjalan</span>
            <span className="text-slate-600">·</span>
            <span>{selectedBrand === 'all' ? 'Semua Brand' : selectedBrand}</span>
          </div>
        </div>

        <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px]">Total Direct GMV</span>
            <Icons.TrendUp className="text-emerald-400" size={14} />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
            {formatRupiah(stats.gmv)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">{stats.targetAchieved}</span>
            <span>dari target periode</span>
          </div>
        </div>

        <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px]">Average ROAS</span>
            <Icons.CheckCircle className="text-amber-400" size={14} />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold font-mono text-amber-400 tracking-tight">
              {stats.roas.toFixed(2)}x
            </p>
            <span className="text-xs text-slate-500 font-mono">
              (Target {stats.targetRoas.toFixed(1)}x)
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-medium">
            <span>+{((stats.roas - stats.targetRoas)).toFixed(2)}x di atas threshold</span>
          </div>
        </div>

        <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px]">Akun Toko Terkelola</span>
            <Icons.Brands className="text-slate-500" size={14} />
          </div>
          <p className="text-2xl font-bold font-mono text-white tracking-tight">
            {filteredStores.length} <span className="text-xs font-normal text-slate-400">Akun Toko</span>
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-slate-300 font-mono">{projects.length || 24}</span>
            <span>task operasional aktif</span>
          </div>
        </div>
      </div>

      {/* ─── Interactive ROAS & GMV Trend Curve ─── */}
      <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Icons.TrendUp className="text-amber-400" size={16} />
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Tren ROAS & Trajektori Performa ({selectedBrand === 'all' ? 'Semua Brand' : selectedBrand} · {SERVICES_LIST.find(s => s.key === selectedService)?.label})
              </h2>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Monitoring performa harian berdasarkan input metrik tim operasional
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-300">Aktual ROAS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-slate-500 border border-dashed border-slate-400"></span>
              <span className="text-slate-400">Target ({stats.targetRoas.toFixed(1)}x)</span>
            </div>
          </div>
        </div>

        {/* SVG Curve Container */}
        <div className="relative w-full overflow-hidden bg-slate-950/60 rounded-lg p-2 border border-slate-800/80">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-48 select-none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75].map((ratio) => {
              const y = paddingY + ratio * (svgHeight - paddingY * 2);
              return (
                <line
                  key={ratio}
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Target Threshold Line */}
            <line
              x1={paddingX}
              y1={targetY}
              x2={svgWidth - paddingX}
              y2={targetY}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />

            {/* Gradient Area under curve */}
            <path d={areaD} fill="url(#areaGradient)" />

            {/* Actual Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((pt, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5.5 : 3.5}
                    fill={isHovered ? '#fbbf24' : '#f59e0b'}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    {pt.data.day}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip Card */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <div
              className="absolute pointer-events-none bg-slate-900 border border-slate-700 shadow-xl rounded-lg p-2.5 text-xs text-white z-10 font-mono transition-transform"
              style={{
                left: `${Math.min(Math.max(15, (points[hoveredIndex].x / svgWidth) * 100), 82)}%`,
                top: '16px',
              }}
            >
              <p className="text-[10px] text-slate-400 font-sans mb-1 font-semibold">
                {points[hoveredIndex].data.day}
              </p>
              <div className="space-y-0.5">
                <p>
                  <span className="text-slate-400">ROAS: </span>
                  <span className="text-amber-400 font-bold">
                    {points[hoveredIndex].data.roas}x
                  </span>
                </p>
                <p>
                  <span className="text-slate-400">Spend: </span>
                  <span className="text-slate-200">
                    {formatRupiah(points[hoveredIndex].data.spend)}
                  </span>
                </p>
                <p>
                  <span className="text-slate-400">Direct GMV: </span>
                  <span className="text-emerald-400">
                    {formatRupiah(points[hoveredIndex].data.gmv)}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Store Performance Matrix (Matriks Akun Toko Klien) ─── */}
      <div className="bg-[#0D131F] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <Icons.Projects size={16} className="text-amber-400" />
              <h3 className="font-semibold text-white text-sm">Matriks Akun Toko & Performa Klien</h3>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Rincian performa per platform, PIC, Spend, GMV, dan evaluasi kesehatan toko
            </p>
          </div>
          <span className="text-slate-400 font-mono text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-800">
            {filteredStores.length} Akun Toko Terpantau
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Brand / Toko</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Servis</th>
                <th className="px-4 py-3">PIC</th>
                <th className="px-4 py-3 text-right">Ad Spend</th>
                <th className="px-4 py-3 text-right">Direct GMV</th>
                <th className="px-4 py-3 text-center">ROAS (Target)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Catatan Evaluasi PIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStores.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada akun toko untuk filter brand / servis yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredStores.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                      {st.brand}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300 uppercase">
                        {st.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[10px] text-slate-400 capitalize">
                        {st.service.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                      {st.pic}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300 whitespace-nowrap">
                      {formatRupiah(st.spend)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-emerald-400 whitespace-nowrap">
                      {formatRupiah(st.gmv)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono whitespace-nowrap">
                      <span className="font-semibold text-amber-400">{st.actualRoas}x</span>
                      <span className="text-[10px] text-slate-500 ml-1">({st.targetRoas}x)</span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {st.health === 'optimal' && (
                        <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium">
                          Optimal
                        </span>
                      )}
                      {st.health === 'stable' && (
                        <span className="text-[10px] px-2 py-0.5 rounded border border-slate-600 bg-slate-800 text-slate-300 font-medium">
                          Stabil
                        </span>
                      )}
                      {st.health === 'needs_review' && (
                        <span className="text-[10px] px-2 py-0.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 font-medium">
                          Evaluasi
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs truncate" title={st.note}>
                      {st.note}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Status Distribution & Overview Cards ─── */}
      <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Distribusi Status Pekerjaan Operasional
          </h2>
          <Link
            href="/dashboard/projects"
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
          >
            <span>Buka Tabel Projects</span>
            <Icons.ChevronRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
            <p className="text-xl font-bold font-mono text-slate-300">
              {statusCounts.belum_dimulai || 2}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Belum Dimulai</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
            <p className="text-xl font-bold font-mono text-blue-400">
              {statusCounts.ongoing || 14}
            </p>
            <p className="text-[11px] text-blue-300 mt-0.5">Berjalan</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
            <p className="text-xl font-bold font-mono text-purple-400">
              {statusCounts.review || 4}
            </p>
            <p className="text-[11px] text-purple-300 mt-0.5">Review</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
            <p className="text-xl font-bold font-mono text-orange-400">
              {statusCounts.revisi || 3}
            </p>
            <p className="text-[11px] text-orange-300 mt-0.5">Revisi / Kendala</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center col-span-2 sm:col-span-1">
            <p className="text-xl font-bold font-mono text-emerald-400">
              {statusCounts.done || 9}
            </p>
            <p className="text-[11px] text-emerald-300 mt-0.5">Selesai</p>
          </div>
        </div>
      </div>

      {/* ─── Action Center: Deadlines & Workload ─── */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Deadline Terdekat (Action Center) */}
        <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Icons.Clock className="text-amber-400" size={16} />
              <span>Action Center: Deadline Terdekat</span>
            </div>
            <span className="text-[10px] text-slate-500">14 Hari ke Depan</span>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="p-6 rounded-lg bg-slate-900/40 border border-slate-800 text-center text-slate-500 text-xs">
              Semua deadline aman. Tidak ada batas waktu dalam waktu dekat.
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingDeadlines.map((p) => {
                const daysLeft = Math.ceil(
                  (new Date(p.deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );
                const isUrgent = daysLeft <= 3;
                return (
                  <Link
                    key={p.id}
                    href={`/dashboard/projects/${p.id}`}
                    className={`block p-3 rounded-lg border transition-all ${
                      isUrgent
                        ? 'bg-red-500/5 border-red-500/25 hover:border-red-500/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white text-xs font-medium truncate">{p.name}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">{p.brand?.name || 'Brand Klien'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span
                          className={`text-xs font-mono font-bold ${
                            isUrgent ? 'text-red-400' : 'text-amber-400'
                          }`}
                        >
                          {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Hari Ini'}
                        </span>
                        <p className="text-slate-500 text-[10px] font-mono mt-0.5">
                          {p.deadline}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Workload PIC Tim */}
        <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Icons.Users className="text-blue-400" size={16} />
              <span>Distribusi Workload PIC</span>
            </div>
            <span className="text-[10px] text-slate-500">Staf Pelaksana</span>
          </div>

          <div className="space-y-2.5">
            {picWorkload.map((pic) => (
              <div
                key={pic.name}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                    {pic.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">{pic.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {pic.divisions.map((div) => (
                        <span
                          key={div}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700"
                        >
                          {div}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-mono text-amber-400">
                    {pic.count}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Pekerjaan</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Alert Kendala / Revisi Section ─── */}
      {alertProjects.length > 0 && (
        <div className="bg-[#0D131F] border border-orange-500/25 rounded-xl p-5">
          <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm mb-3">
            <Icons.AlertCircle size={16} />
            <span>Pekerjaan Memerlukan Perhatian & Tindak Lanjut Segera</span>
          </div>
          <div className="space-y-2">
            {alertProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800/90 text-xs"
              >
                <div>
                  <span className="text-white font-medium">{p.name}</span>
                  <span className="text-slate-400 ml-2">({p.brand?.name || 'Brand'})</span>
                  {p.notes && <p className="text-slate-400 text-[11px] mt-1">{p.notes}</p>}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
