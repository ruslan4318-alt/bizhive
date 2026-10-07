'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Project {
  id: string;
  name: string;
  platform: string;
  brand?: { name: string } | any;
}

interface ShopeeDailyRecord {
  date: string;
  ad_type: string;
  expense: number;
  impressions: number;
  clicks: number;
  conversions: number;
  products_sold: number;
  direct_gmv: number;
}

interface ShopeeMonthlyRecord {
  month_year: string;
  placed_order: number;
  confirmed_order: number;
  campaign_target: number;
  campaign_actual: number;
  shop_deco_target: number;
  shop_deco_actual: number;
  flash_sale_target: number;
  flash_sale_actual: number;
  broadcast_target: number;
  broadcast_actual: number;
  voucher_target: number;
  voucher_actual: number;
  ads_keyword_spend: number;
  health_status: string;
  penalty_points: number;
  failed_metrics: number;
  summary_text?: string;
  next_plan_text?: string;
}

interface TikTokRecord {
  date: string;
  objective: string;
  budget_estimated: number;
  actual_spend: number;
  kpi_1_label?: string;
  kpi_1_value?: number;
  kpi_2_label?: string;
  kpi_2_value?: number;
  result?: number;
  status: string;
  note?: string;
}

type ReportType = 'shopee-daily' | 'shopee-monthly' | 'tiktok';

const REPORT_TYPES = [
  { key: 'shopee-daily' as ReportType, label: 'Shopee Daily Report', icon: '📊' },
  { key: 'shopee-monthly' as ReportType, label: 'Shopee Monthly Report', icon: '📅' },
  { key: 'tiktok' as ReportType, label: 'TikTok Report', icon: '🎵' },
];

export default function ReportsClient() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [reportType, setReportType] = useState<ReportType>('shopee-daily');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [monthFrom, setMonthFrom] = useState('');
  const [monthTo, setMonthTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<{
    shopeeDaily?: ShopeeDailyRecord[];
    shopeeMonthly?: ShopeeMonthlyRecord[];
    tiktok?: TikTokRecord[];
  } | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('id, name, platform, brand:brands(name)')
      .order('name');
    setProjects((data as any) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProjects();
    // Set default dates
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setDateFrom(firstDay.toISOString().split('T')[0]);
    setDateTo(now.toISOString().split('T')[0]);
    setMonthFrom(firstDay.toISOString().slice(0, 7));
    setMonthTo(now.toISOString().slice(0, 7));
  }, [fetchProjects]);

  const generateReport = async () => {
    if (!selectedProject) return;
    setGenerating(true);
    setReportData(null);

    try {
      if (reportType === 'shopee-daily') {
        const { data } = await supabase
          .from('shopee_daily')
          .select('*')
          .eq('project_id', selectedProject)
          .gte('date', dateFrom)
          .lte('date', dateTo)
          .order('date', { ascending: true });
        setReportData({ shopeeDaily: data || [] });
      } else if (reportType === 'shopee-monthly') {
        const { data } = await supabase
          .from('shopee_monthly')
          .select('*')
          .eq('project_id', selectedProject)
          .gte('month_year', monthFrom)
          .lte('month_year', monthTo)
          .order('month_year', { ascending: true });
        setReportData({ shopeeMonthly: data || [] });
      } else if (reportType === 'tiktok') {
        const { data } = await supabase
          .from('tiktok_objectives')
          .select('*')
          .eq('project_id', selectedProject)
          .gte('date', dateFrom)
          .lte('date', dateTo)
          .order('date', { ascending: true });
        setReportData({ tiktok: data || [] });
      }
    } catch {
      // handle silently
    } finally {
      setGenerating(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;

    let csvContent = '';
    const projectName = projects.find(p => p.id === selectedProject)?.name || 'report';

    if (reportType === 'shopee-daily' && reportData.shopeeDaily) {
      csvContent = 'Date,Ad Type,Expense,Impressions,Clicks,Conversions,Products Sold,Direct GMV,CTR,CPC,ROAS,CR\n';
      reportData.shopeeDaily.forEach(r => {
        const ctr = r.impressions > 0 ? (r.clicks / r.impressions * 100).toFixed(2) : '0';
        const cpc = r.clicks > 0 ? (r.expense / r.clicks).toFixed(2) : '0';
        const roas = r.expense > 0 ? (r.direct_gmv / r.expense).toFixed(2) : '0';
        const cr = r.clicks > 0 ? (r.conversions / r.clicks * 100).toFixed(2) : '0';
        csvContent += `${r.date},${r.ad_type},${r.expense},${r.impressions},${r.clicks},${r.conversions},${r.products_sold},${r.direct_gmv},${ctr}%,${cpc},${roas}x,${cr}%\n`;
      });
    } else if (reportType === 'shopee-monthly' && reportData.shopeeMonthly) {
      csvContent = 'Month,Placed Order,Confirmed Order,Campaign Target,Campaign Actual,Flash Sale Target,Flash Sale Actual,Broadcast Target,Broadcast Actual,Voucher Target,Voucher Actual,Ads Spend,Health Status,Penalty Points\n';
      reportData.shopeeMonthly.forEach(r => {
        csvContent += `${r.month_year},${r.placed_order},${r.confirmed_order},${r.campaign_target},${r.campaign_actual},${r.flash_sale_target},${r.flash_sale_actual},${r.broadcast_target},${r.broadcast_actual},${r.voucher_target},${r.voucher_actual},${r.ads_keyword_spend},${r.health_status},${r.penalty_points}\n`;
      });
    } else if (reportType === 'tiktok' && reportData.tiktok) {
      csvContent = 'Date,Objective,Budget,Actual Spend,KPI 1 Label,KPI 1 Value,KPI 2 Label,KPI 2 Value,Result,Status,Note\n';
      reportData.tiktok.forEach(r => {
        csvContent += `${r.date},${r.objective},${r.budget_estimated},${r.actual_spend},${r.kpi_1_label || ''},${r.kpi_1_value || ''},${r.kpi_2_label || ''},${r.kpi_2_value || ''},${r.result || ''},${r.status},"${(r.note || '').replace(/"/g, '""')}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${projectName}_${reportType}_${dateFrom || monthFrom}_${dateTo || monthTo}.csv`;
    link.click();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(num % 1 === 0 ? 0 : 2);
  };

  // Calculate summary stats
  const getShopeeDailySummary = () => {
    if (!reportData?.shopeeDaily?.length) return null;
    const data = reportData.shopeeDaily;
    const totalExpense = data.reduce((s, r) => s + r.expense, 0);
    const totalGmv = data.reduce((s, r) => s + r.direct_gmv, 0);
    const totalClicks = data.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = data.reduce((s, r) => s + r.impressions, 0);
    const totalConversions = data.reduce((s, r) => s + r.conversions, 0);
    const totalSold = data.reduce((s, r) => s + r.products_sold, 0);

    return {
      totalExpense, totalGmv, totalClicks, totalImpressions, totalConversions, totalSold,
      roas: totalExpense > 0 ? totalGmv / totalExpense : 0,
      ctr: totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0,
      cr: totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0,
      cpc: totalClicks > 0 ? totalExpense / totalClicks : 0,
      days: data.length,
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Generate dan export laporan performa</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">🔍 Filter Report</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Project *</label>
            {loading ? (
              <div className="h-12 bg-slate-800 rounded-xl animate-pulse" />
            ) : (
              <select
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
              >
                <option value="">-- Pilih Project --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.brand?.name ? `${p.brand.name} — ` : ''}{p.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tipe Report</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value as ReportType)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
            >
              {REPORT_TYPES.map(t => (
                <option key={t.key} value={t.key}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range */}
        {reportType === 'shopee-monthly' ? (
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Dari Bulan</label>
              <input
                type="month"
                value={monthFrom}
                onChange={e => setMonthFrom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Sampai Bulan</label>
              <input
                type="month"
                value={monthTo}
                onChange={e => setMonthTo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Dari Tanggal</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Sampai Tanggal</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={generateReport}
            disabled={!selectedProject || generating}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold transition-colors text-sm"
          >
            {generating ? '⏳ Generating...' : '📊 Generate Report'}
          </button>
          {reportData && (
            <button
              onClick={exportToCSV}
              className="px-6 py-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold transition-colors text-sm border border-green-500/20"
            >
              📥 Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="space-y-6">
          {/* Shopee Daily Report */}
          {reportType === 'shopee-daily' && reportData.shopeeDaily && (
            <>
              {/* Summary Cards */}
              {(() => {
                const summary = getShopeeDailySummary();
                if (!summary) return (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                    <p className="text-slate-500">Tidak ada data untuk periode ini</p>
                  </div>
                );
                return (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Total Expense</p>
                        <p className="text-xl font-bold text-white mt-1">Rp{formatNumber(summary.totalExpense)}</p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Total GMV</p>
                        <p className="text-xl font-bold text-green-400 mt-1">Rp{formatNumber(summary.totalGmv)}</p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-wider">ROAS</p>
                        <p className={`text-xl font-bold mt-1 ${summary.roas >= 3 ? 'text-green-400' : summary.roas >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
                          {summary.roas.toFixed(2)}x
                        </p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Products Sold</p>
                        <p className="text-xl font-bold text-blue-400 mt-1">{formatNumber(summary.totalSold)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-blue-400">{summary.ctr.toFixed(2)}%</p>
                        <p className="text-xs text-slate-500">Avg CTR</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-purple-400">Rp{formatNumber(summary.cpc)}</p>
                        <p className="text-xs text-slate-500">Avg CPC</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-cyan-400">{summary.cr.toFixed(2)}%</p>
                        <p className="text-xs text-slate-500">Avg CR</p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-amber-400">{summary.days}</p>
                        <p className="text-xs text-slate-500">Data Points</p>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Data Table */}
              {reportData.shopeeDaily.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-md font-semibold text-white mb-4">Detail Data</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-xs text-slate-400 uppercase px-3 py-2">Date</th>
                          <th className="text-left text-xs text-slate-400 uppercase px-3 py-2">Type</th>
                          <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Expense</th>
                          <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Impr.</th>
                          <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Clicks</th>
                          <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Conv.</th>
                          <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Sold</th>
                          <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">GMV</th>
                          <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">ROAS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.shopeeDaily.map((r, i) => {
                          const roas = r.expense > 0 ? r.direct_gmv / r.expense : 0;
                          return (
                            <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                              <td className="px-3 py-2 text-white">{r.date}</td>
                              <td className="px-3 py-2 text-slate-300 capitalize">{r.ad_type.replace('_', ' ')}</td>
                              <td className="px-3 py-2 text-right text-slate-300">Rp{formatNumber(r.expense)}</td>
                              <td className="px-3 py-2 text-right text-slate-300">{formatNumber(r.impressions)}</td>
                              <td className="px-3 py-2 text-right text-slate-300">{formatNumber(r.clicks)}</td>
                              <td className="px-3 py-2 text-right text-slate-300">{r.conversions}</td>
                              <td className="px-3 py-2 text-right text-slate-300">{r.products_sold}</td>
                              <td className="px-3 py-2 text-right text-slate-300">Rp{formatNumber(r.direct_gmv)}</td>
                              <td className={`px-3 py-2 text-right font-medium ${roas >= 3 ? 'text-green-400' : roas >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
                                {roas.toFixed(2)}x
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Shopee Monthly Report */}
          {reportType === 'shopee-monthly' && reportData.shopeeMonthly && (
            <>
              {reportData.shopeeMonthly.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                  <p className="text-slate-500">Tidak ada data bulanan untuk periode ini</p>
                </div>
              ) : (
                reportData.shopeeMonthly.map((r, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">📅 {r.month_year}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        r.health_status === 'sangat_baik' ? 'bg-green-500/10 text-green-400' :
                        r.health_status === 'baik' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {r.health_status.replace('_', ' ').replace(/^./, c => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">Placed Order</p>
                        <p className="text-white font-bold">Rp{formatNumber(r.placed_order)}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">Confirmed Order</p>
                        <p className="text-green-400 font-bold">Rp{formatNumber(r.confirmed_order)}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">Ads Spend</p>
                        <p className="text-amber-400 font-bold">Rp{formatNumber(r.ads_keyword_spend)}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">Penalty</p>
                        <p className={`font-bold ${r.penalty_points > 0 ? 'text-red-400' : 'text-slate-500'}`}>{r.penalty_points} pts</p>
                      </div>
                    </div>
                    {r.summary_text && (
                      <div className="bg-slate-800/30 rounded-lg p-3">
                        <p className="text-xs text-slate-500 mb-1">Summary</p>
                        <p className="text-slate-300 text-sm">{r.summary_text}</p>
                      </div>
                    )}
                    {r.next_plan_text && (
                      <div className="bg-slate-800/30 rounded-lg p-3">
                        <p className="text-xs text-slate-500 mb-1">Next Plan</p>
                        <p className="text-slate-300 text-sm">{r.next_plan_text}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {/* TikTok Report */}
          {reportType === 'tiktok' && reportData.tiktok && (
            <>
              {reportData.tiktok.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                  <p className="text-slate-500">Tidak ada data TikTok untuk periode ini</p>
                </div>
              ) : (
                <>
                  {/* TikTok Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <p className="text-slate-400 text-xs uppercase tracking-wider">Total Budget</p>
                      <p className="text-xl font-bold text-white mt-1">
                        Rp{formatNumber(reportData.tiktok.reduce((s, r) => s + r.budget_estimated, 0))}
                      </p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <p className="text-slate-400 text-xs uppercase tracking-wider">Total Spend</p>
                      <p className="text-xl font-bold text-amber-400 mt-1">
                        Rp{formatNumber(reportData.tiktok.reduce((s, r) => s + r.actual_spend, 0))}
                      </p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <p className="text-slate-400 text-xs uppercase tracking-wider">Campaigns</p>
                      <p className="text-xl font-bold text-blue-400 mt-1">{reportData.tiktok.length}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-md font-semibold text-white mb-4">Detail Data</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-800">
                            <th className="text-left text-xs text-slate-400 uppercase px-3 py-2">Date</th>
                            <th className="text-left text-xs text-slate-400 uppercase px-3 py-2">Objective</th>
                            <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Budget</th>
                            <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Spend</th>
                            <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">KPI 1</th>
                            <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">KPI 2</th>
                            <th className="text-center text-xs text-slate-400 uppercase px-3 py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.tiktok.map((r, i) => (
                            <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                              <td className="px-3 py-2 text-white">{r.date}</td>
                              <td className="px-3 py-2 text-slate-300 capitalize">{r.objective.replace('_', ' ')}</td>
                              <td className="px-3 py-2 text-right text-slate-300">Rp{formatNumber(r.budget_estimated)}</td>
                              <td className="px-3 py-2 text-right text-slate-300">Rp{formatNumber(r.actual_spend)}</td>
                              <td className="px-3 py-2 text-right text-slate-300">{r.kpi_1_label}: {r.kpi_1_value?.toFixed(2) || '-'}</td>
                              <td className="px-3 py-2 text-right text-slate-300">{r.kpi_2_label}: {r.kpi_2_value ? formatNumber(r.kpi_2_value) : '-'}</td>
                              <td className="px-3 py-2 text-center">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  r.status === 'done' ? 'bg-green-500/10 text-green-400' :
                                  r.status === 'ongoing' ? 'bg-blue-500/10 text-blue-400' :
                                  'bg-gray-500/10 text-gray-400'
                                }`}>{r.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
