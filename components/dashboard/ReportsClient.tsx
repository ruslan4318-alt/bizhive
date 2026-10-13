'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Icons } from '@/components/ui/Icons';

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

const REPORT_TYPES: { key: ReportType; label: string }[] = [
  { key: 'shopee-daily', label: 'Shopee Daily Report' },
  { key: 'shopee-monthly', label: 'Shopee Monthly Report' },
  { key: 'tiktok', label: 'TikTok Ads Report' },
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pusat Analitik & Laporan</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">Generate dan export laporan performa marketplace & iklan</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1 text-gray-900 font-semibold text-sm">
          <Icons.Filter className="text-amber-500" size={16} />
          <span>Filter Parameter Laporan</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Project *</label>
            {loading ? (
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <select
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-amber-400 transition-colors"
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
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tipe Laporan</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value as ReportType)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            >
              {REPORT_TYPES.map(t => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range */}
        {reportType === 'shopee-monthly' ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Dari Bulan</label>
              <input
                type="month"
                value={monthFrom}
                onChange={e => setMonthFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sampai Bulan</label>
              <input
                type="month"
                value={monthTo}
                onChange={e => setMonthTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Dari Tanggal</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sampai Tanggal</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2.5 pt-1">
          <button
            onClick={generateReport}
            disabled={!selectedProject || generating}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-semibold transition-colors text-sm shadow-sm"
          >
            {generating ? 'Menghasilkan...' : 'Generate Report'}
          </button>
          {reportData && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-emerald-700 font-semibold transition-colors text-sm border border-emerald-200 shadow-sm"
            >
              <Icons.Download size={14} />
              <span>Export CSV</span>
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
              {(() => {
                const summary = getShopeeDailySummary();
                if (!summary) return (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
                    <p className="text-gray-400 text-sm">Tidak ada data untuk periode ini.</p>
                  </div>
                );
                return (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Total Expense</p>
                        <p className="text-xl font-bold font-mono text-gray-900 mt-1">Rp{formatNumber(summary.totalExpense)}</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Total GMV</p>
                        <p className="text-xl font-bold font-mono text-emerald-600 mt-1">Rp{formatNumber(summary.totalGmv)}</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">ROAS</p>
                        <p className={`text-xl font-bold font-mono mt-1 ${summary.roas >= 3 ? 'text-emerald-600' : summary.roas >= 1 ? 'text-amber-600' : 'text-red-600'}`}>
                          {summary.roas.toFixed(2)}x
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Products Sold</p>
                        <p className="text-xl font-bold font-mono text-blue-600 mt-1">{formatNumber(summary.totalSold)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
                        <p className="text-sm font-bold font-mono text-blue-600">{summary.ctr.toFixed(2)}%</p>
                        <p className="text-xs text-gray-400 mt-0.5">Avg CTR</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
                        <p className="text-sm font-bold font-mono text-purple-600">Rp{formatNumber(summary.cpc)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Avg CPC</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
                        <p className="text-sm font-bold font-mono text-teal-600">{summary.cr.toFixed(2)}%</p>
                        <p className="text-xs text-gray-400 mt-0.5">Avg CR</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
                        <p className="text-sm font-bold font-mono text-amber-600">{summary.days}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Data Points</p>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Data Table */}
              {reportData.shopeeDaily.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Detail Data Per Tanggal</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                          <th className="text-left px-3 py-2.5">Date</th>
                          <th className="text-left px-3 py-2.5">Type</th>
                          <th className="text-right px-3 py-2.5">Expense</th>
                          <th className="text-right px-3 py-2.5">Impr.</th>
                          <th className="text-right px-3 py-2.5">Clicks</th>
                          <th className="text-right px-3 py-2.5">Conv.</th>
                          <th className="text-right px-3 py-2.5">Sold</th>
                          <th className="text-right px-3 py-2.5">GMV</th>
                          <th className="text-right px-3 py-2.5">ROAS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {reportData.shopeeDaily.map((r, i) => {
                          const roas = r.expense > 0 ? r.direct_gmv / r.expense : 0;
                          return (
                            <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                              <td className="px-3 py-2 text-gray-800 font-mono">{r.date}</td>
                              <td className="px-3 py-2 text-gray-600 capitalize">{r.ad_type.replace('_', ' ')}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-700">Rp{formatNumber(r.expense)}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-700">{formatNumber(r.impressions)}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-700">{formatNumber(r.clicks)}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-700">{r.conversions}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-700">{r.products_sold}</td>
                              <td className="px-3 py-2 text-right font-mono font-medium text-emerald-600">Rp{formatNumber(r.direct_gmv)}</td>
                              <td className={`px-3 py-2 text-right font-mono font-semibold ${roas >= 3 ? 'text-emerald-600' : roas >= 1 ? 'text-amber-600' : 'text-red-600'}`}>
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
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
                  <p className="text-gray-400 text-sm">Tidak ada data bulanan untuk periode ini.</p>
                </div>
              ) : (
                reportData.shopeeMonthly.map((r, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900">Periode: {r.month_year}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                        r.health_status === 'sangat_baik' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        r.health_status === 'baik' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {r.health_status.replace('_', ' ').replace(/^./, c => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                        <p className="text-xs text-gray-400 font-medium">Placed Order</p>
                        <p className="text-gray-900 font-bold font-mono text-sm mt-0.5">Rp{formatNumber(r.placed_order)}</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                        <p className="text-xs text-gray-400 font-medium">Confirmed Order</p>
                        <p className="text-emerald-600 font-bold font-mono text-sm mt-0.5">Rp{formatNumber(r.confirmed_order)}</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                        <p className="text-xs text-gray-400 font-medium">Ads Spend</p>
                        <p className="text-amber-600 font-bold font-mono text-sm mt-0.5">Rp{formatNumber(r.ads_keyword_spend)}</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                        <p className="text-xs text-gray-400 font-medium">Penalty</p>
                        <p className={`font-bold font-mono text-sm mt-0.5 ${r.penalty_points > 0 ? 'text-red-600' : 'text-gray-500'}`}>{r.penalty_points} pts</p>
                      </div>
                    </div>
                    {r.summary_text && (
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Summary</p>
                        <p className="text-gray-600 text-xs">{r.summary_text}</p>
                      </div>
                    )}
                    {r.next_plan_text && (
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Next Plan</p>
                        <p className="text-gray-600 text-xs">{r.next_plan_text}</p>
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
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
                  <p className="text-gray-400 text-sm">Tidak ada data TikTok untuk periode ini.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Total Budget</p>
                      <p className="text-xl font-bold font-mono text-gray-900 mt-1">
                        Rp{formatNumber(reportData.tiktok.reduce((s, r) => s + r.budget_estimated, 0))}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Total Spend</p>
                      <p className="text-xl font-bold font-mono text-amber-600 mt-1">
                        Rp{formatNumber(reportData.tiktok.reduce((s, r) => s + r.actual_spend, 0))}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Campaigns</p>
                      <p className="text-xl font-bold font-mono text-blue-600 mt-1">{reportData.tiktok.length}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Detail Data Kampanye</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                            <th className="text-left px-3 py-2.5">Date</th>
                            <th className="text-left px-3 py-2.5">Objective</th>
                            <th className="text-right px-3 py-2.5">Budget</th>
                            <th className="text-right px-3 py-2.5">Spend</th>
                            <th className="text-right px-3 py-2.5">KPI 1</th>
                            <th className="text-right px-3 py-2.5">KPI 2</th>
                            <th className="text-center px-3 py-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {reportData.tiktok.map((r, i) => (
                            <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                              <td className="px-3 py-2 font-mono text-gray-800">{r.date}</td>
                              <td className="px-3 py-2 text-gray-600 capitalize">{r.objective.replace('_', ' ')}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-700">Rp{formatNumber(r.budget_estimated)}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-700">Rp{formatNumber(r.actual_spend)}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-700">{r.kpi_1_label}: {r.kpi_1_value?.toFixed(2) || '-'}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-700">{r.kpi_2_label}: {r.kpi_2_value ? formatNumber(r.kpi_2_value) : '-'}</td>
                              <td className="px-3 py-2 text-center">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                                  r.status === 'done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  r.status === 'ongoing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-gray-100 text-gray-600 border-gray-200'
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
