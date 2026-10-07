'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HealthStatus } from '@/lib/types/dashboard';

interface ShopeeMonthlyFormProps {
  projectId: string;
}

interface MonthlyRecord {
  id: string;
  month_year: string;
  placed_order: number;
  confirmed_order: number;
  roi_target?: number;
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
  health_status: HealthStatus;
  penalty_points: number;
  penalty_detail?: string;
  failed_metrics: number;
  summary_text?: string;
  next_plan_text?: string;
}

const HEALTH_OPTIONS: { value: HealthStatus; label: string; color: string }[] = [
  { value: 'sangat_baik', label: 'Sangat Baik', color: 'text-green-400' },
  { value: 'baik', label: 'Baik', color: 'text-blue-400' },
  { value: 'perlu_perbaikan', label: 'Perlu Perbaikan', color: 'text-red-400' },
];

const MARKETING_FIELDS = [
  { key: 'campaign', label: 'Campaign' },
  { key: 'shop_deco', label: 'Shop Decoration' },
  { key: 'flash_sale', label: 'Flash Sale' },
  { key: 'broadcast', label: 'Broadcast' },
  { key: 'voucher', label: 'Voucher' },
];

export default function ShopeeMonthlyForm({ projectId }: ShopeeMonthlyFormProps) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [records, setRecords] = useState<MonthlyRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [form, setForm] = useState({
    month_year: currentMonth,
    placed_order: '',
    confirmed_order: '',
    roi_target: '',
    campaign_target: '', campaign_actual: '',
    shop_deco_target: '', shop_deco_actual: '',
    flash_sale_target: '', flash_sale_actual: '',
    broadcast_target: '', broadcast_actual: '',
    voucher_target: '', voucher_actual: '',
    ads_keyword_spend: '',
    health_status: 'sangat_baik' as HealthStatus,
    penalty_points: '0',
    penalty_detail: '',
    failed_metrics: '0',
    summary_text: '',
    next_plan_text: '',
  });

  const fetchRecords = useCallback(async () => {
    setLoadingRecords(true);
    const { data } = await supabase
      .from('shopee_monthly')
      .select('*')
      .eq('project_id', projectId)
      .order('month_year', { ascending: false })
      .limit(12);
    setRecords(data || []);
    setLoadingRecords(false);
  }, [projectId, supabase]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Load existing data when month changes
  useEffect(() => {
    const loadMonthData = async () => {
      const { data } = await supabase
        .from('shopee_monthly')
        .select('*')
        .eq('project_id', projectId)
        .eq('month_year', form.month_year)
        .single();

      if (data) {
        setForm(prev => ({
          ...prev,
          placed_order: data.placed_order?.toString() || '',
          confirmed_order: data.confirmed_order?.toString() || '',
          roi_target: data.roi_target?.toString() || '',
          campaign_target: data.campaign_target?.toString() || '',
          campaign_actual: data.campaign_actual?.toString() || '',
          shop_deco_target: data.shop_deco_target?.toString() || '',
          shop_deco_actual: data.shop_deco_actual?.toString() || '',
          flash_sale_target: data.flash_sale_target?.toString() || '',
          flash_sale_actual: data.flash_sale_actual?.toString() || '',
          broadcast_target: data.broadcast_target?.toString() || '',
          broadcast_actual: data.broadcast_actual?.toString() || '',
          voucher_target: data.voucher_target?.toString() || '',
          voucher_actual: data.voucher_actual?.toString() || '',
          ads_keyword_spend: data.ads_keyword_spend?.toString() || '',
          health_status: data.health_status || 'sangat_baik',
          penalty_points: data.penalty_points?.toString() || '0',
          penalty_detail: data.penalty_detail || '',
          failed_metrics: data.failed_metrics?.toString() || '0',
          summary_text: data.summary_text || '',
          next_plan_text: data.next_plan_text || '',
        }));
      }
    };
    if (form.month_year) loadMonthData();
  }, [form.month_year, projectId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: upsertError } = await supabase
        .from('shopee_monthly')
        .upsert({
          project_id: projectId,
          month_year: form.month_year,
          placed_order: parseFloat(form.placed_order) || 0,
          confirmed_order: parseFloat(form.confirmed_order) || 0,
          roi_target: form.roi_target ? parseFloat(form.roi_target) : null,
          campaign_target: parseInt(form.campaign_target) || 0,
          campaign_actual: parseInt(form.campaign_actual) || 0,
          shop_deco_target: parseInt(form.shop_deco_target) || 0,
          shop_deco_actual: parseInt(form.shop_deco_actual) || 0,
          flash_sale_target: parseInt(form.flash_sale_target) || 0,
          flash_sale_actual: parseInt(form.flash_sale_actual) || 0,
          broadcast_target: parseInt(form.broadcast_target) || 0,
          broadcast_actual: parseInt(form.broadcast_actual) || 0,
          voucher_target: parseInt(form.voucher_target) || 0,
          voucher_actual: parseInt(form.voucher_actual) || 0,
          ads_keyword_spend: parseFloat(form.ads_keyword_spend) || 0,
          health_status: form.health_status,
          penalty_points: parseInt(form.penalty_points) || 0,
          penalty_detail: form.penalty_detail || null,
          failed_metrics: parseInt(form.failed_metrics) || 0,
          summary_text: form.summary_text || null,
          next_plan_text: form.next_plan_text || null,
          created_by: user?.id,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'project_id,month_year',
        });

      if (upsertError) throw upsertError;

      setSuccess('Data bulanan berhasil disimpan!');
      fetchRecords();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan data';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) return 'Rp' + (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return 'Rp' + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return 'Rp' + (num / 1000).toFixed(1) + 'K';
    return 'Rp' + num.toFixed(0);
  };

  const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Period */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">📅 Shopee Monthly Summary</h2>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-slate-300 mb-2">Bulan *</label>
            <input
              type="month"
              value={form.month_year}
              onChange={e => updateField('month_year', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-md font-semibold text-white">📦 Order Data</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Placed Order (Rp)</label>
              <input
                type="number" step="0.01"
                value={form.placed_order}
                onChange={e => updateField('placed_order', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirmed Order (Rp)</label>
              <input
                type="number" step="0.01"
                value={form.confirmed_order}
                onChange={e => updateField('confirmed_order', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">ROI Target</label>
              <input
                type="number" step="0.01"
                value={form.roi_target}
                onChange={e => updateField('roi_target', e.target.value)}
                placeholder="Target ROI"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Marketing Activities */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-md font-semibold text-white">📣 Marketing Activities</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-xs text-slate-500 font-medium uppercase tracking-wider px-1">
              <span>Aktivitas</span>
              <span className="text-center">Target</span>
              <span className="text-center">Actual</span>
            </div>
            {MARKETING_FIELDS.map(field => {
              const targetVal = parseInt((form as Record<string, string>)[`${field.key}_target`]) || 0;
              const actualVal = parseInt((form as Record<string, string>)[`${field.key}_actual`]) || 0;
              const percentage = targetVal > 0 ? (actualVal / targetVal * 100) : 0;
              return (
                <div key={field.key} className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-sm">{field.label}</span>
                    {targetVal > 0 && (
                      <span className={`text-xs font-medium ${percentage >= 100 ? 'text-green-400' : percentage >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={(form as Record<string, string>)[`${field.key}_target`]}
                    onChange={e => updateField(`${field.key}_target`, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm text-center focus:border-amber-500 outline-none"
                  />
                  <input
                    type="number"
                    value={(form as Record<string, string>)[`${field.key}_actual`]}
                    onChange={e => updateField(`${field.key}_actual`, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm text-center focus:border-amber-500 outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Ads + Shop Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-md font-semibold text-white">🏥 Shop Health & Ads</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Ads Keyword Spend (Rp)</label>
              <input
                type="number" step="0.01"
                value={form.ads_keyword_spend}
                onChange={e => updateField('ads_keyword_spend', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Health Status</label>
              <select
                value={form.health_status}
                onChange={e => updateField('health_status', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              >
                {HEALTH_OPTIONS.map(h => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Penalty Points</label>
              <input
                type="number"
                value={form.penalty_points}
                onChange={e => updateField('penalty_points', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Failed Metrics</label>
              <input
                type="number"
                value={form.failed_metrics}
                onChange={e => updateField('failed_metrics', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Penalty Detail</label>
            <textarea
              value={form.penalty_detail}
              onChange={e => updateField('penalty_detail', e.target.value)}
              rows={2}
              placeholder="Detail penalti jika ada..."
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Summary & Next Plan */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-md font-semibold text-white">📝 Summary & Plan</h3>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Summary Bulan Ini</label>
            <textarea
              value={form.summary_text}
              onChange={e => updateField('summary_text', e.target.value)}
              rows={3}
              placeholder="Ringkasan performa bulan ini..."
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Next Month Plan</label>
            <textarea
              value={form.next_plan_text}
              onChange={e => updateField('next_plan_text', e.target.value)}
              rows={3}
              placeholder="Rencana untuk bulan depan..."
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-900 font-bold transition-colors text-sm"
          >
            {saving ? 'Menyimpan...' : '💾 Simpan Data Bulanan'}
          </button>
        </div>
      </form>

      {/* Records Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📋 Riwayat Bulanan</h2>
        {loadingRecords ? (
          <div className="h-20 bg-slate-800 rounded-xl animate-pulse" />
        ) : records.length === 0 ? (
          <p className="text-slate-500 text-sm">Belum ada data bulanan</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs text-slate-400 uppercase px-3 py-2">Bulan</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Placed</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Confirmed</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Ads Spend</th>
                  <th className="text-center text-xs text-slate-400 uppercase px-3 py-2">Health</th>
                  <th className="text-center text-xs text-slate-400 uppercase px-3 py-2">Penalty</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => {
                  const healthConfig = HEALTH_OPTIONS.find(h => h.value === r.health_status);
                  return (
                    <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-3 py-2.5 text-white font-medium">{r.month_year}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">{formatCurrency(r.placed_order)}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">{formatCurrency(r.confirmed_order)}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">{formatCurrency(r.ads_keyword_spend)}</td>
                      <td className={`px-3 py-2.5 text-center text-xs font-medium ${healthConfig?.color || 'text-slate-400'}`}>
                        {healthConfig?.label || r.health_status}
                      </td>
                      <td className={`px-3 py-2.5 text-center ${r.penalty_points > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                        {r.penalty_points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
