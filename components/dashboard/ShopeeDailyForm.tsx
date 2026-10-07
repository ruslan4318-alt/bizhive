'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AdType } from '@/lib/types/dashboard';

interface ShopeeDailyFormProps {
  projectId: string;
}

interface DailyRecord {
  id: string;
  date: string;
  ad_type: AdType;
  expense: number;
  impressions: number;
  clicks: number;
  conversions: number;
  products_sold: number;
  direct_gmv: number;
}

const AD_TYPES: { value: AdType; label: string }[] = [
  { value: 'product_ads', label: 'Product Ads' },
  { value: 'shop_ads', label: 'Shop Ads' },
];

export default function ShopeeDailyForm({ projectId }: ShopeeDailyFormProps) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    ad_type: 'product_ads' as AdType,
    expense: '',
    impressions: '',
    clicks: '',
    conversions: '',
    products_sold: '',
    direct_gmv: '',
  });

  const fetchRecords = useCallback(async () => {
    setLoadingRecords(true);
    const { data } = await supabase
      .from('shopee_daily')
      .select('*')
      .eq('project_id', projectId)
      .order('date', { ascending: false })
      .limit(20);
    setRecords(data || []);
    setLoadingRecords(false);
  }, [projectId, supabase]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('shopee_daily')
        .upsert({
          project_id: projectId,
          date: form.date,
          ad_type: form.ad_type,
          expense: parseFloat(form.expense) || 0,
          impressions: parseInt(form.impressions) || 0,
          clicks: parseInt(form.clicks) || 0,
          conversions: parseInt(form.conversions) || 0,
          products_sold: parseInt(form.products_sold) || 0,
          direct_gmv: parseFloat(form.direct_gmv) || 0,
          created_by: user?.id,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'project_id,date,ad_type',
        });

      if (insertError) throw insertError;

      setSuccess('Data berhasil disimpan!');
      setForm(prev => ({
        ...prev,
        expense: '', impressions: '', clicks: '',
        conversions: '', products_sold: '', direct_gmv: '',
      }));
      fetchRecords();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan data';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // Calculate preview
  const expense = parseFloat(form.expense) || 0;
  const clicks = parseInt(form.clicks) || 0;
  const impressions = parseInt(form.impressions) || 0;
  const conversions = parseInt(form.conversions) || 0;
  const directGmv = parseFloat(form.direct_gmv) || 0;

  const ctr = impressions > 0 ? (clicks / impressions * 100) : 0;
  const cpc = clicks > 0 ? expense / clicks : 0;
  const roas = expense > 0 ? directGmv / expense : 0;
  const cr = clicks > 0 ? (conversions / clicks * 100) : 0;
  const costPerPurchase = conversions > 0 ? expense / conversions : 0;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(num % 1 === 0 ? 0 : 2);
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">📊 Input Shopee Daily</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tanggal *</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tipe Ads *</label>
            <select
              value={form.ad_type}
              onChange={e => setForm({ ...form, ad_type: e.target.value as AdType })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
            >
              {AD_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Expense (Rp)</label>
            <input
              type="number"
              step="0.01"
              value={form.expense}
              onChange={e => setForm({ ...form, expense: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Impressions</label>
            <input
              type="number"
              value={form.impressions}
              onChange={e => setForm({ ...form, impressions: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Clicks</label>
            <input
              type="number"
              value={form.clicks}
              onChange={e => setForm({ ...form, clicks: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Conversions</label>
            <input
              type="number"
              value={form.conversions}
              onChange={e => setForm({ ...form, conversions: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Products Sold</label>
            <input
              type="number"
              value={form.products_sold}
              onChange={e => setForm({ ...form, products_sold: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Direct GMV (Rp)</label>
            <input
              type="number"
              step="0.01"
              value={form.direct_gmv}
              onChange={e => setForm({ ...form, direct_gmv: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Calculated Preview */}
        {(expense > 0 || clicks > 0) && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">Calculasi Otomatis</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">{ctr.toFixed(2)}%</p>
                <p className="text-xs text-slate-500">CTR</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400">Rp{formatNumber(cpc)}</p>
                <p className="text-xs text-slate-500">CPC</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${roas >= 3 ? 'text-green-400' : roas >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
                  {roas.toFixed(2)}x
                </p>
                <p className="text-xs text-slate-500">ROAS</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-cyan-400">{cr.toFixed(2)}%</p>
                <p className="text-xs text-slate-500">CR</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-orange-400">Rp{formatNumber(costPerPurchase)}</p>
                <p className="text-xs text-slate-500">Cost/Purchase</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-900 font-bold transition-colors text-sm"
          >
            {saving ? 'Menyimpan...' : '💾 Simpan Data'}
          </button>
        </div>
      </form>

      {/* Recent Records */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📋 Data Terbaru</h2>
        {loadingRecords ? (
          <div className="h-20 bg-slate-800 rounded-xl animate-pulse" />
        ) : records.length === 0 ? (
          <p className="text-slate-500 text-sm">Belum ada data untuk project ini</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs text-slate-400 uppercase px-3 py-2">Tanggal</th>
                  <th className="text-left text-xs text-slate-400 uppercase px-3 py-2">Type</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Expense</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Impr.</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Clicks</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Conv.</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">GMV</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => {
                  const recordRoas = r.expense > 0 ? (r.direct_gmv / r.expense) : 0;
                  return (
                    <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-3 py-2.5 text-white">{r.date}</td>
                      <td className="px-3 py-2.5 text-slate-300 capitalize">{r.ad_type.replace('_', ' ')}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">Rp{formatNumber(r.expense)}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">{formatNumber(r.impressions)}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">{formatNumber(r.clicks)}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">{r.conversions}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">Rp{formatNumber(r.direct_gmv)}</td>
                      <td className={`px-3 py-2.5 text-right font-medium ${recordRoas >= 3 ? 'text-green-400' : recordRoas >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
                        {recordRoas.toFixed(2)}x
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
