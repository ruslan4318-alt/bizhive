'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

interface DailyDataPoint {
  date: string;
  dayLabel: string;
  spend: number;
  gmv: number;
  targetRoas: number;
  platform: 'shopee' | 'tiktok' | 'tokopedia' | 'lazada';
  brand: string;
}

interface StorePerformance {
  id: string;
  brand: string;
  platform: 'shopee' | 'tiktok' | 'tokopedia' | 'lazada';
  pic: string;
  spend: number;
  gmv: number;
  targetRoas: number;
  actualRoas: number;
  health: 'optimal' | 'stable' | 'needs_review';
  note: string;
}

const RAW_DAILY_METRICS: DailyDataPoint[] = [
  { date: '2026-10-06', dayLabel: 'Sen, 06', spend: 5800000, gmv: 34800000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-07', dayLabel: 'Sel, 07', spend: 6200000, gmv: 39680000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-08', dayLabel: 'Rab, 08', spend: 6500000, gmv: 42250000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-09', dayLabel: 'Kam, 09', spend: 7100000, gmv: 44020000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-10', dayLabel: 'Jum, 10', spend: 7800000, gmv: 53040000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-11', dayLabel: 'Sab, 11', spend: 8900000, gmv: 62300000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-12', dayLabel: 'Min, 12', spend: 8100000, gmv: 55080000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },

  { date: '2026-10-06', dayLabel: 'Sen, 06', spend: 3200000, gmv: 19200000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-07', dayLabel: 'Sel, 07', spend: 3500000, gmv: 21700000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-08', dayLabel: 'Rab, 08', spend: 3800000, gmv: 23560000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-09', dayLabel: 'Kam, 09', spend: 4100000, gmv: 26240000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-10', dayLabel: 'Jum, 10', spend: 4900000, gmv: 33320000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-11', dayLabel: 'Sab, 11', spend: 5200000, gmv: 36400000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-12', dayLabel: 'Min, 12', spend: 4800000, gmv: 31200000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },

  { date: '2026-10-06', dayLabel: 'Sen, 06', spend: 1800000, gmv: 8100000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-07', dayLabel: 'Sel, 07', spend: 1900000, gmv: 9120000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-08', dayLabel: 'Rab, 08', spend: 2000000, gmv: 9400000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-09', dayLabel: 'Kam, 09', spend: 2100000, gmv: 9870000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-10', dayLabel: 'Jum, 10', spend: 2400000, gmv: 11520000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-11', dayLabel: 'Sab, 11', spend: 2600000, gmv: 12220000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-12', dayLabel: 'Min, 12', spend: 2300000, gmv: 10580000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
];

const STORE_PERFORMANCES: StorePerformance[] = [
  {
    id: 'store-1',
    brand: 'Somethinc Official',
    platform: 'shopee',
    pic: 'Rian Pratama',
    spend: 50400000,
    gmv: 331170000,
    targetRoas: 5.0,
    actualRoas: 6.57,
    health: 'optimal',
    note: 'ROAS stabil di atas target. Optimasi bid keyword payday efektif.',
  },
  {
    id: 'store-2',
    brand: 'Buttonscarves Beauty',
    platform: 'tiktok',
    pic: 'Rian Pratama',
    spend: 29500000,
    gmv: 191620000,
    targetRoas: 5.5,
    actualRoas: 6.50,
    health: 'optimal',
    note: 'GMV live shopping + ads katalog meningkat 22%.',
  },
  {
    id: 'store-3',
    brand: 'Cosmax Store',
    platform: 'tokopedia',
    pic: 'Budi Santoso',
    spend: 15100000,
    gmv: 70810000,
    targetRoas: 4.5,
    actualRoas: 4.69,
    health: 'stable',
    note: 'Mencapai target minimum. Perlu ekspansi broad keyword.',
  },
  {
    id: 'store-4',
    brand: 'Biosoop Skincare',
    platform: 'shopee',
    pic: 'Dina Kusuma',
    spend: 18200000,
    gmv: 76440000,
    targetRoas: 5.0,
    actualRoas: 4.20,
    health: 'needs_review',
    note: 'ROAS menurun karena 3 SKU utama kehabisan stok saat weekend.',
  },
  {
    id: 'store-5',
    brand: 'Glint Men Care',
    platform: 'lazada',
    pic: 'Sarah Annisa',
    spend: 9800000,
    gmv: 51940000,
    targetRoas: 4.8,
    actualRoas: 5.30,
    health: 'stable',
    note: 'Creative banner baru meningkatkan CTR iklan 1.4%.',
  },
];

export default function ShopOptimizationAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | 'mtd'>('7d');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Aggregated Daily Metrics
  const aggregatedDaily = useMemo(() => {
    const dates = Array.from(new Set(RAW_DAILY_METRICS.map((d) => d.date))).sort();

    return dates.map((date) => {
      const items = RAW_DAILY_METRICS.filter((d) => {
        const matchDate = d.date === date;
        const matchPlatform = selectedPlatform === 'all' || d.platform === selectedPlatform;
        const matchBrand = selectedBrand === 'all' || d.brand === selectedBrand;
        return matchDate && matchPlatform && matchBrand;
      });

      const totalSpend = items.reduce((acc, curr) => acc + curr.spend, 0);
      const totalGmv = items.reduce((acc, curr) => acc + curr.gmv, 0);
      const avgTarget = items.length > 0 ? items.reduce((acc, curr) => acc + curr.targetRoas, 0) / items.length : 5.0;
      const roas = totalSpend > 0 ? totalGmv / totalSpend : 0;
      const dayLabel = items[0]?.dayLabel || date;

      return {
        date,
        dayLabel,
        totalSpend,
        totalGmv,
        roas: Number(roas.toFixed(2)),
        targetRoas: Number(avgTarget.toFixed(2)),
      };
    });
  }, [selectedPlatform, selectedBrand]);

  // Executive KPI summary
  const kpis = useMemo(() => {
    const totalSpend = aggregatedDaily.reduce((acc, curr) => acc + curr.totalSpend, 0);
    const totalGmv = aggregatedDaily.reduce((acc, curr) => acc + curr.totalGmv, 0);
    const avgRoas = totalSpend > 0 ? totalGmv / totalSpend : 0;
    const avgTarget = aggregatedDaily.length > 0
      ? aggregatedDaily.reduce((acc, curr) => acc + curr.targetRoas, 0) / aggregatedDaily.length
      : 5.0;

    return {
      totalSpend,
      totalGmv,
      avgRoas: Number(avgRoas.toFixed(2)),
      avgTarget: Number(avgTarget.toFixed(2)),
      isAboveTarget: avgRoas >= avgTarget,
    };
  }, [aggregatedDaily]);

  // Filtered Stores
  const filteredStores = useMemo(() => {
    return STORE_PERFORMANCES.filter((s) => {
      const matchPlatform = selectedPlatform === 'all' || s.platform === selectedPlatform;
      const matchBrand = selectedBrand === 'all' || s.brand === selectedBrand;
      return matchPlatform && matchBrand;
    });
  }, [selectedPlatform, selectedBrand]);

  // Platform Breakdown Share
  const platformBreakdown = useMemo(() => {
    const platformTotals: Record<string, number> = { shopee: 0, tiktok: 0, tokopedia: 0, lazada: 0 };
    RAW_DAILY_METRICS.forEach((d) => {
      if (selectedBrand === 'all' || d.brand === selectedBrand) {
        platformTotals[d.platform] = (platformTotals[d.platform] || 0) + d.gmv;
      }
    });
    const grandTotal = Object.values(platformTotals).reduce((a, b) => a + b, 0);
    return {
      shopee: grandTotal > 0 ? Math.round((platformTotals.shopee / grandTotal) * 100) : 0,
      tiktok: grandTotal > 0 ? Math.round((platformTotals.tiktok / grandTotal) * 100) : 0,
      tokopedia: grandTotal > 0 ? Math.round((platformTotals.tokopedia / grandTotal) * 100) : 0,
      lazada: grandTotal > 0 ? Math.round((platformTotals.lazada / grandTotal) * 100) : 0,
      grandTotal,
    };
  }, [selectedBrand]);

  // SVG Chart Geometry
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 24;

  const maxRoas = Math.max(...aggregatedDaily.map((d) => Math.max(d.roas, d.targetRoas)), 8);

  const pointsRoas = useMemo(() => {
    const step = (chartWidth - paddingX * 2) / Math.max(aggregatedDaily.length - 1, 1);
    return aggregatedDaily.map((d, i) => {
      const x = paddingX + i * step;
      const y = chartHeight - paddingY - (d.roas / maxRoas) * (chartHeight - paddingY * 2);
      return { x, y, data: d };
    });
  }, [aggregatedDaily, maxRoas]);

  const targetLineY = chartHeight - paddingY - (kpis.avgTarget / maxRoas) * (chartHeight - paddingY * 2);

  const pathRoas = useMemo(() => {
    if (pointsRoas.length === 0) return '';
    return pointsRoas.reduce((acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), '');
  }, [pointsRoas]);

  const areaRoas = useMemo(() => {
    if (pointsRoas.length === 0) return '';
    const firstX = pointsRoas[0].x;
    const lastX = pointsRoas[pointsRoas.length - 1].x;
    const bottomY = chartHeight - paddingY;
    return `${pathRoas} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [pointsRoas, pathRoas]);

  const formatRupiah = (num: number) => {
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(2)}M`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)} Jt`;
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Shop Optimization Performance</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Monitoring metrik iklan, penjualan direct GMV, dan realisasi target ROAS per platform.
          </p>
        </div>

        <Link
          href="/dashboard/update"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors self-start sm:self-auto shadow-sm"
        >
          <Icons.Plus size={14} />
          <span>Input Data Harian</span>
        </Link>
      </div>

      {/* ─── Filter Bar ─── */}
      <div className="bg-[#0D131F] border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Timeframe */}
        <div className="flex items-center bg-slate-950/60 p-0.5 rounded-lg border border-slate-800/80">
          {(['7d', '30d', 'mtd'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedTimeframe === tf
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf === '7d' && '7 Hari'}
              {tf === '30d' && '30 Hari'}
              {tf === 'mtd' && 'Bulan Ini'}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-slate-950/80 border border-slate-800/90 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-600"
          >
            <option value="all">Semua Platform</option>
            <option value="shopee">Shopee</option>
            <option value="tiktok">TikTok Shop</option>
            <option value="tokopedia">Tokopedia</option>
            <option value="lazada">Lazada</option>
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-slate-950/80 border border-slate-800/90 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-600"
          >
            <option value="all">Semua Brand</option>
            <option value="Somethinc Official">Somethinc Official</option>
            <option value="Buttonscarves Beauty">Buttonscarves Beauty</option>
            <option value="Cosmax Store">Cosmax Store</option>
            <option value="Biosoop Skincare">Biosoop Skincare</option>
            <option value="Glint Men Care">Glint Men Care</option>
          </select>
        </div>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ad Spend */}
        <div className="bg-[#0D131F] border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Ad Spend</span>
            <Icons.Upload size={14} className="text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {formatRupiah(kpis.totalSpend)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <Icons.TrendUp size={12} />
            <span>+8.4% vs periode lalu</span>
          </div>
        </div>

        {/* Direct GMV */}
        <div className="bg-[#0D131F] border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Direct GMV</span>
            <Icons.Download size={14} className="text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {formatRupiah(kpis.totalGmv)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <Icons.TrendUp size={12} />
            <span>+14.2% vs periode lalu</span>
          </div>
        </div>

        {/* Realized ROAS */}
        <div className="bg-[#0D131F] border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rata-Rata ROAS</span>
            <span className="text-[10px] text-slate-400 font-mono">Target: {kpis.avgTarget}x</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {kpis.avgRoas}x
          </div>
          <div className="text-[11px] mt-2">
            {kpis.isAboveTarget ? (
              <span className="text-emerald-400 font-medium">Melampaui target KPI</span>
            ) : (
              <span className="text-red-400 font-medium">Di bawah target KPI</span>
            )}
          </div>
        </div>

        {/* Store Health */}
        <div className="bg-[#0D131F] border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Status Akun Toko</span>
            <Icons.CheckCircle size={14} className="text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {filteredStores.length} Akun
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
            <span className="text-emerald-400 font-medium font-mono">
              {filteredStores.filter((s) => s.health !== 'needs_review').length} Optimal
            </span>
            <span>•</span>
            <span className="text-amber-400 font-medium font-mono">
              {filteredStores.filter((s) => s.health === 'needs_review').length} Evaluasi
            </span>
          </div>
        </div>
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROAS Trend Curve */}
        <div className="lg:col-span-2 bg-[#0D131F] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div>
              <h3 className="font-semibold text-white">Tren ROAS & Garis Target</h3>
              <p className="text-slate-400 text-[11px]">Realisasi harian terhadap ambang batas KPI ({kpis.avgTarget}x)</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-400 inline-block rounded" /> ROAS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-t border-dashed border-red-400 inline-block" /> Target
              </span>
            </div>
          </div>

          <div className="w-full relative overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-52 overflow-visible select-none">
              <defs>
                <linearGradient id="cleanRoasGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[1, 2, 3].map((idx) => {
                const y = chartHeight - paddingY - (idx / 3) * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                );
              })}

              {/* Target Line */}
              <line
                x1={paddingX}
                y1={targetLineY}
                x2={chartWidth - paddingX}
                y2={targetLineY}
                stroke="#ef4444"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />

              {/* Area & Line */}
              <path d={areaRoas} fill="url(#cleanRoasGrad)" />
              <path d={pathRoas} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

              {/* Data points */}
              {pointsRoas.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIndex === i ? 5 : 3.5}
                    fill="#f59e0b"
                    stroke="#0B0F17"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  <text x={p.x} y={chartHeight - 6} fill="#64748b" fontSize="9" textAnchor="middle" className="font-mono">
                    {p.data.dayLabel}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredIndex !== null && pointsRoas[hoveredIndex] && (
              <div
                className="absolute top-1 pointer-events-none bg-slate-950 border border-slate-700 rounded-lg p-2 shadow-xl text-xs z-10"
                style={{
                  left: `${Math.min(Math.max(pointsRoas[hoveredIndex].x - 50, 10), chartWidth - 130)}px`,
                }}
              >
                <div className="font-semibold text-slate-300 text-[11px] mb-0.5">
                  {pointsRoas[hoveredIndex].data.dayLabel}
                </div>
                <div className="text-amber-400 font-mono font-bold">
                  ROAS: {pointsRoas[hoveredIndex].data.roas}x
                </div>
                <div className="text-slate-400 text-[10px] font-mono">
                  Spend: {formatRupiah(pointsRoas[hoveredIndex].data.totalSpend)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Platform Share Breakdown */}
        <div className="bg-[#0D131F] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white text-xs">Porsi Penjualan per Platform</h3>
            <p className="text-slate-400 text-[11px] mt-0.5">Distribusi GMV e-commerce periode aktif</p>
          </div>

          <div className="space-y-3.5 my-3 text-xs">
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">Shopee</span>
                <span className="text-slate-200 font-mono">{platformBreakdown.shopee}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${platformBreakdown.shopee}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">TikTok Shop</span>
                <span className="text-slate-200 font-mono">{platformBreakdown.tiktok}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${platformBreakdown.tiktok}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">Tokopedia</span>
                <span className="text-slate-200 font-mono">{platformBreakdown.tokopedia}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-slate-600 rounded-full" style={{ width: `${platformBreakdown.tokopedia}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">Lazada</span>
                <span className="text-slate-200 font-mono">{platformBreakdown.lazada}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-slate-700 rounded-full" style={{ width: `${platformBreakdown.lazada}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-800/80 text-[11px] flex justify-between text-slate-400">
            <span>Total Akumulasi:</span>
            <span className="text-white font-mono font-semibold">{formatRupiah(platformBreakdown.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* ─── Store Performance Table ─── */}
      <div className="bg-[#0D131F] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div>
            <h3 className="font-semibold text-white">Matriks Akun Toko Klien</h3>
            <p className="text-slate-400 text-[11px] mt-0.5">Rincian performa harian, rasio efisiensi, dan tindakan PIC</p>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">{filteredStores.length} Akun</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800/80">
              <tr>
                <th className="px-4 py-2.5">Brand / Toko</th>
                <th className="px-4 py-2.5">Platform</th>
                <th className="px-4 py-2.5">PIC</th>
                <th className="px-4 py-2.5 text-right">Ad Spend</th>
                <th className="px-4 py-2.5 text-right">Direct GMV</th>
                <th className="px-4 py-2.5 text-center">ROAS (Target)</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5">Catatan Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{store.brand}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300 uppercase">
                      {store.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{store.pic}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">{formatRupiah(store.spend)}</td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-slate-100">{formatRupiah(store.gmv)}</td>
                  <td className="px-4 py-3 text-center font-mono">
                    <span className="font-semibold text-amber-400">{store.actualRoas}x</span>
                    <span className="text-[10px] text-slate-500 ml-1">({store.targetRoas}x)</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {store.health === 'optimal' && (
                      <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium">
                        Optimal
                      </span>
                    )}
                    {store.health === 'stable' && (
                      <span className="text-[10px] px-2 py-0.5 rounded border border-slate-600 bg-slate-800 text-slate-300 font-medium">
                        Stabil
                      </span>
                    )}
                    {store.health === 'needs_review' && (
                      <span className="text-[10px] px-2 py-0.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 font-medium">
                        Evaluasi
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400 max-w-xs truncate" title={store.note}>
                    {store.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
