'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

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
  health: 'sangat_baik' | 'baik' | 'perlu_perbaikan';
  note: string;
}

// Demo Dataset for Analytics
const RAW_DAILY_METRICS: DailyDataPoint[] = [
  { date: '2026-10-06', dayLabel: 'Sen (06)', spend: 5800000, gmv: 34800000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-07', dayLabel: 'Sel (07)', spend: 6200000, gmv: 39680000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-08', dayLabel: 'Rab (08)', spend: 6500000, gmv: 42250000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-09', dayLabel: 'Kam (09)', spend: 7100000, gmv: 44020000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-10', dayLabel: 'Jum (10)', spend: 7800000, gmv: 53040000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-11', dayLabel: 'Sab (11)', spend: 8900000, gmv: 62300000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },
  { date: '2026-10-12', dayLabel: 'Min (12)', spend: 8100000, gmv: 55080000, targetRoas: 5.0, platform: 'shopee', brand: 'Somethinc Official' },

  { date: '2026-10-06', dayLabel: 'Sen (06)', spend: 3200000, gmv: 19200000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-07', dayLabel: 'Sel (07)', spend: 3500000, gmv: 21700000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-08', dayLabel: 'Rab (08)', spend: 3800000, gmv: 23560000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-09', dayLabel: 'Kam (09)', spend: 4100000, gmv: 26240000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-10', dayLabel: 'Jum (10)', spend: 4900000, gmv: 33320000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-11', dayLabel: 'Sab (11)', spend: 5200000, gmv: 36400000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },
  { date: '2026-10-12', dayLabel: 'Min (12)', spend: 4800000, gmv: 31200000, targetRoas: 5.5, platform: 'tiktok', brand: 'Buttonscarves Beauty' },

  { date: '2026-10-06', dayLabel: 'Sen (06)', spend: 1800000, gmv: 8100000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-07', dayLabel: 'Sel (07)', spend: 1900000, gmv: 9120000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-08', dayLabel: 'Rab (08)', spend: 2000000, gmv: 9400000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-09', dayLabel: 'Kam (09)', spend: 2100000, gmv: 9870000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-10', dayLabel: 'Jum (10)', spend: 2400000, gmv: 11520000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-11', dayLabel: 'Sab (11)', spend: 2600000, gmv: 12220000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
  { date: '2026-10-12', dayLabel: 'Min (12)', spend: 2300000, gmv: 10580000, targetRoas: 4.5, platform: 'tokopedia', brand: 'Cosmax Store' },
];

const STORE_PERFORMANCES: StorePerformance[] = [
  {
    id: 'store-1',
    brand: 'Somethinc Official',
    platform: 'shopee',
    pic: 'Rian (Ads Specialist)',
    spend: 50400000,
    gmv: 331170000,
    targetRoas: 5.0,
    actualRoas: 6.57,
    health: 'sangat_baik',
    note: 'ROAS stabil di atas target. Optimasi bid kata kunci payday berhasil.',
  },
  {
    id: 'store-2',
    brand: 'Buttonscarves Beauty',
    platform: 'tiktok',
    pic: 'Rian (Ads Specialist)',
    spend: 29500000,
    gmv: 191620000,
    targetRoas: 5.5,
    actualRoas: 6.50,
    health: 'sangat_baik',
    note: 'GMV live shopping + ads katalog meningkat 22%.',
  },
  {
    id: 'store-3',
    brand: 'Cosmax Store',
    platform: 'tokopedia',
    pic: 'Budi (Operations)',
    spend: 15100000,
    gmv: 70810000,
    targetRoas: 4.5,
    actualRoas: 4.69,
    health: 'baik',
    note: 'Mencapai target minimum. Perlu ekspansi ke keyword baru.',
  },
  {
    id: 'store-4',
    brand: 'Biosoop Skincare',
    platform: 'shopee',
    pic: 'Dina (Store Ops)',
    spend: 18200000,
    gmv: 76440000,
    targetRoas: 5.0,
    actualRoas: 4.20,
    health: 'perlu_perbaikan',
    note: 'ROAS di bawah target karena 3 SKU utama kehabisan stok saat weekend.',
  },
  {
    id: 'store-5',
    brand: 'Glint Men Care',
    platform: 'lazada',
    pic: 'Sarah (Creative/Ads)',
    spend: 9800000,
    gmv: 51940000,
    targetRoas: 4.8,
    actualRoas: 5.30,
    health: 'baik',
    note: 'Creative banner baru meningkatkan CTR iklan sebesar 1.4%.',
  },
];

export default function ShopOptimizationAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | 'mtd'>('7d');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [chartMetric, setChartMetric] = useState<'roas' | 'gmv_spend'>('roas');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filtered daily metrics
  const aggregatedDaily = useMemo(() => {
    // Unique dates
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

  // Executive KPIs
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

  // Filtered Store Performances
  const filteredStores = useMemo(() => {
    return STORE_PERFORMANCES.filter((s) => {
      const matchPlatform = selectedPlatform === 'all' || s.platform === selectedPlatform;
      const matchBrand = selectedBrand === 'all' || s.brand === selectedBrand;
      return matchPlatform && matchBrand;
    });
  }, [selectedPlatform, selectedBrand]);

  // Platform breakdown percentages
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

  // Chart Dimensions & Math (SVG)
  const chartHeight = 240;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 30;

  const maxRoas = Math.max(...aggregatedDaily.map((d) => Math.max(d.roas, d.targetRoas)), 8);
  const minRoas = 0;

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

  // Format IDR Helper
  const formatRupiah = (num: number) => {
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(2)}M`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)} Jt`;
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6">
      {/* ─── Page Header & Direct Action ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Shop Optimization Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              E-Commerce Performance
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Monitoring performa ROAS, Ad Spend, dan GMV penjualan toko per platform secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/update"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <span>+</span> Input Data Harian
          </Link>
        </div>
      </div>

      {/* ─── Control Bar (Timeframe, Platform, Brand) ─── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Timeframe switch */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['7d', '30d', 'mtd'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTimeframe === tf
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf === '7d' && '7 Hari Terakhir'}
              {tf === '30d' && '30 Hari'}
              {tf === 'mtd' && 'Bulan Ini (MTD)'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Platform Pills */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">🌐 Semua Platform</option>
            <option value="shopee">Shopee</option>
            <option value="tiktok">TikTok Shop</option>
            <option value="tokopedia">Tokopedia</option>
            <option value="lazada">Lazada</option>
          </select>

          {/* Brand Selector */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">🏢 Semua Brand</option>
            <option value="Somethinc Official">Somethinc Official</option>
            <option value="Buttonscarves Beauty">Buttonscarves Beauty</option>
            <option value="Cosmax Store">Cosmax Store</option>
            <option value="Biosoop Skincare">Biosoop Skincare</option>
            <option value="Glint Men Care">Glint Men Care</option>
          </select>
        </div>
      </div>

      {/* ─── 4 Executive KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spend */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Ad Spend</span>
            <span className="text-amber-400 font-bold">💸 Biaya Iklan</span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatRupiah(kpis.totalSpend)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2">
            <span>↑ +8.4%</span>
            <span className="text-slate-500">vs periode lalu</span>
          </div>
        </div>

        {/* Direct GMV */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Direct GMV</span>
            <span className="text-emerald-400 font-bold">🛍️ Penjualan</span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatRupiah(kpis.totalGmv)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2">
            <span>↑ +14.2%</span>
            <span className="text-slate-500">vs periode lalu</span>
          </div>
        </div>

        {/* Average ROAS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Rata-Rata ROAS</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              kpis.isAboveTarget ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}>
              Target: {kpis.avgTarget}x
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-400">{kpis.avgRoas}x</span>
            <span className="text-xs text-slate-400">Return on Ad Spend</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            {kpis.isAboveTarget ? (
              <span className="text-emerald-400 font-semibold">✓ Melampaui target KPI</span>
            ) : (
              <span className="text-red-400 font-semibold">⚠️ Di bawah target KPI</span>
            )}
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Kesehatan Toko</span>
            <span className="text-blue-400 font-bold">🏥 Status</span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {filteredStores.length} Akun Toko
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
            <span className="text-emerald-400 font-semibold">
              🟢 {filteredStores.filter((s) => s.health !== 'perlu_perbaikan').length} Sehat
            </span>
            <span>•</span>
            <span className="text-red-400 font-semibold">
              🔴 {filteredStores.filter((s) => s.health === 'perlu_perbaikan').length} Issue
            </span>
          </div>
        </div>
      </div>

      {/* ─── Interactive Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main ROAS Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📈</span> Tren ROAS & Target Threshold
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Garis putus-putus merah menandakan target KPI minimum ({kpis.avgTarget}x)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3 h-0.5 bg-amber-400 inline-block rounded" /> ROAS Aktual
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3 h-0.5 border-t border-dashed border-red-400 inline-block" /> Target
              </span>
            </div>
          </div>

          {/* SVG Interactive Chart */}
          <div className="w-full relative overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="roasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[1, 2, 3, 4].map((gridIndex) => {
                const y = chartHeight - paddingY - (gridIndex / 4) * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={gridIndex}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1"
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
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={chartWidth - paddingX - 10}
                y={targetLineY - 6}
                fill="#ef4444"
                fontSize="10"
                textAnchor="end"
                fontWeight="bold"
              >
                Target {kpis.avgTarget}x
              </text>

              {/* Area & Line */}
              <path d={areaRoas} fill="url(#roasGradient)" />
              <path d={pathRoas} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />

              {/* Data Points */}
              {pointsRoas.map((p, i) => {
                const isHovered = hoveredIndex === i;
                return (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6 : 4}
                      fill="#f59e0b"
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                    {/* Day label */}
                    <text
                      x={p.x}
                      y={chartHeight - 8}
                      fill="#64748b"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {p.data.dayLabel}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Box */}
            {hoveredIndex !== null && pointsRoas[hoveredIndex] && (
              <div
                className="absolute top-2 pointer-events-none bg-slate-950 border border-amber-500/40 rounded-xl p-2.5 shadow-2xl text-xs z-10 transition-all"
                style={{
                  left: `${Math.min(Math.max(pointsRoas[hoveredIndex].x - 60, 10), chartWidth - 140)}px`,
                }}
              >
                <div className="font-bold text-white mb-1">
                  {pointsRoas[hoveredIndex].data.dayLabel}
                </div>
                <div className="text-amber-400 font-extrabold text-sm">
                  ROAS: {pointsRoas[hoveredIndex].data.roas}x
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Spend: {formatRupiah(pointsRoas[hoveredIndex].data.totalSpend)}
                </div>
                <div className="text-emerald-400 text-[11px]">
                  GMV: {formatRupiah(pointsRoas[hoveredIndex].data.totalGmv)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Platform Share Breakdown (1 Col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🥧</span> Porsi Penjualan per Platform
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Kontribusi GMV ads e-commerce
            </p>
          </div>

          <div className="space-y-4 my-4">
            {/* Shopee */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#ff6a48] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ee4d2d]" /> Shopee
                </span>
                <span className="text-white font-mono font-bold">{platformBreakdown.shopee}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-[#ee4d2d] rounded-full transition-all duration-500"
                  style={{ width: `${platformBreakdown.shopee}%` }}
                />
              </div>
            </div>

            {/* TikTok */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-pink-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> TikTok Shop
                </span>
                <span className="text-white font-mono font-bold">{platformBreakdown.tiktok}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${platformBreakdown.tiktok}%` }}
                />
              </div>
            </div>

            {/* Tokopedia */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Tokopedia
                </span>
                <span className="text-white font-mono font-bold">{platformBreakdown.tokopedia}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${platformBreakdown.tokopedia}%` }}
                />
              </div>
            </div>

            {/* Lazada */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-blue-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Lazada
                </span>
                <span className="text-white font-mono font-bold">{platformBreakdown.lazada}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${platformBreakdown.lazada}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
            <span>Total GMV Periode Ini:</span>
            <span className="text-white font-mono font-bold">
              {formatRupiah(platformBreakdown.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Store Performance Health Matrix (Table) ─── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🏪</span> Matriks Performa & Kesehatan Toko Klien
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Evaluasi target ROAS vs realisasi lapangan serta catatan tindak lanjut PIC.
            </p>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Menampilkan <strong className="text-white">{filteredStores.length}</strong> Toko
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Brand / Toko</th>
                <th className="px-4 py-3.5">Platform</th>
                <th className="px-4 py-3.5">PIC Ads</th>
                <th className="px-4 py-3.5">Ad Spend</th>
                <th className="px-4 py-3.5">Direct GMV</th>
                <th className="px-4 py-3.5">Target vs Aktual ROAS</th>
                <th className="px-4 py-3.5">Status Kesehatan</th>
                <th className="px-4 py-3.5">Catatan Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStores.map((store) => {
                const isGood = store.actualRoas >= store.targetRoas;
                return (
                  <tr key={store.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white text-xs">
                      {store.brand}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        store.platform === 'shopee'
                          ? 'bg-[#ee4d2d]/20 text-[#ff6a48] border border-[#ee4d2d]/30'
                          : store.platform === 'tiktok'
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                          : store.platform === 'tokopedia'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {store.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-300 font-medium">
                      {store.pic}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-300">
                      {formatRupiah(store.spend)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-emerald-400 font-bold">
                      {formatRupiah(store.gmv)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400 font-mono text-xs">
                          {store.actualRoas}x
                        </span>
                        <span className="text-[10px] text-slate-500">
                          (Target {store.targetRoas}x)
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {store.health === 'sangat_baik' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          🟢 Sangat Baik
                        </span>
                      )}
                      {store.health === 'baik' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          🔵 Baik
                        </span>
                      )}
                      {store.health === 'perlu_perbaikan' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
                          🔴 Perlu Optimasi
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-300 max-w-xs truncate" title={store.note}>
                      {store.note}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
