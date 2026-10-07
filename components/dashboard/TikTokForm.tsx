'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { TikTokObjective, ProjectStatus } from '@/lib/types/dashboard';

interface TikTokFormProps {
  projectId: string;
}

interface TikTokRecord {
  id: string;
  date: string;
  objective: TikTokObjective;
  budget_estimated: number;
  actual_spend: number;
  kpi_1_label?: string;
  kpi_1_value?: number;
  kpi_2_label?: string;
  kpi_2_value?: number;
  result?: number;
  status: ProjectStatus;
  note?: string;
}

const OBJECTIVE_OPTIONS: { value: TikTokObjective; label: string; icon: string; defaultKpi1: string; defaultKpi2: string }[] = [
  { value: 'reach', label: 'Reach', icon: '📡', defaultKpi1: 'CPM', defaultKpi2: 'Reach' },
  { value: 'views', label: 'Video Views', icon: '👁️', defaultKpi1: 'CPV', defaultKpi2: 'Views' },
  { value: 'traffics', label: 'Traffics', icon: '🔗', defaultKpi1: 'CPC', defaultKpi2: 'Clicks' },
  { value: 'product_live', label: 'Product / Live', icon: '🛍️', defaultKpi1: 'CPA', defaultKpi2: 'Conversions' },
];

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'hold', label: 'Hold' },
  { value: 'ongoing', label: 'On Going' },
  { value: 'review', label: 'Review' },
  { value: 'revisi', label: 'Revisi' },
  { value: 'done', label: 'Done' },
];

export default function TikTokForm({ projectId }: TikTokFormProps) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [records, setRecords] = useState<TikTokRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    objective: 'reach' as TikTokObjective,
    budget_estimated: '',
    actual_spend: '',
    kpi_1_label: 'CPM',
    kpi_1_value: '',
    kpi_2_label: 'Reach',
    kpi_2_value: '',
    result: '',
    status: 'ongoing' as ProjectStatus,
    note: '',
  });

  const fetchRecords = useCallback(async () => {
    setLoadingRecords(true);
    const { data } = await supabase
      .from('tiktok_objectives')
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

  // Update KPI labels when objective changes
  const handleObjectiveChange = (objective: TikTokObjective) => {
    const config = OBJECTIVE_OPTIONS.find(o => o.value === objective);
    setForm(prev => ({
      ...prev,
      objective,
      kpi_1_label: config?.defaultKpi1 || '',
      kpi_2_label: config?.defaultKpi2 || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: upsertError } = await supabase
        .from('tiktok_objectives')
        .upsert({
          project_id: projectId,
          date: form.date,
          objective: form.objective,
          budget_estimated: parseFloat(form.budget_estimated) || 0,
          actual_spend: parseFloat(form.actual_spend) || 0,
          kpi_1_label: form.kpi_1_label || null,
          kpi_1_value: form.kpi_1_value ? parseFloat(form.kpi_1_value) : null,
          kpi_2_label: form.kpi_2_label || null,
          kpi_2_value: form.kpi_2_value ? parseFloat(form.kpi_2_value) : null,
          result: form.result ? parseFloat(form.result) : null,
          status: form.status,
          note: form.note || null,
          created_by: user?.id,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'project_id,date,objective',
        });

      if (upsertError) throw upsertError;

      setSuccess('Data TikTok berhasil disimpan!');
      setForm(prev => ({
        ...prev,
        budget_estimated: '', actual_spend: '',
        kpi_1_value: '', kpi_2_value: '', result: '', note: '',
      }));
      fetchRecords();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan data';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(num % 1 === 0 ? 0 : 2);
  };

  // Calculate budget usage
  const budgetEst = parseFloat(form.budget_estimated) || 0;
  const actualSpend = parseFloat(form.actual_spend) || 0;
  const budgetUsage = budgetEst > 0 ? (actualSpend / budgetEst * 100) : 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">🎵 Input TikTok Data</h2>

        <div className="grid md:grid-cols-3 gap-5">
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Objective *</label>
            <select
              value={form.objective}
              onChange={e => handleObjectiveChange(e.target.value as TikTokObjective)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
            >
              {OBJECTIVE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.icon} {o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as ProjectStatus })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Budget Estimated (Rp)</label>
            <input
              type="number" step="0.01"
              value={form.budget_estimated}
              onChange={e => setForm({ ...form, budget_estimated: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Actual Spend (Rp)
              {budgetEst > 0 && (
                <span className={`ml-2 ${budgetUsage > 100 ? 'text-red-400' : budgetUsage > 80 ? 'text-amber-400' : 'text-green-400'}`}>
                  ({budgetUsage.toFixed(0)}% of budget)
                </span>
              )}
            </label>
            <input
              type="number" step="0.01"
              value={form.actual_spend}
              onChange={e => setForm({ ...form, actual_spend: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              KPI 1: {form.kpi_1_label || 'Label'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.kpi_1_label}
                onChange={e => setForm({ ...form, kpi_1_label: e.target.value })}
                placeholder="Label"
                className="w-1/3 px-2 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white text-xs focus:border-amber-500 outline-none"
              />
              <input
                type="number" step="0.0001"
                value={form.kpi_1_value}
                onChange={e => setForm({ ...form, kpi_1_value: e.target.value })}
                placeholder="Value"
                className="w-2/3 px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              KPI 2: {form.kpi_2_label || 'Label'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.kpi_2_label}
                onChange={e => setForm({ ...form, kpi_2_label: e.target.value })}
                placeholder="Label"
                className="w-1/3 px-2 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white text-xs focus:border-amber-500 outline-none"
              />
              <input
                type="number" step="0.0001"
                value={form.kpi_2_value}
                onChange={e => setForm({ ...form, kpi_2_value: e.target.value })}
                placeholder="Value"
                className="w-2/3 px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Result</label>
            <input
              type="number" step="0.0001"
              value={form.result}
              onChange={e => setForm({ ...form, result: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Catatan</label>
          <textarea
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            rows={2}
            placeholder="Catatan tambahan..."
            className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none resize-none"
          />
        </div>

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
          <p className="text-slate-500 text-sm">Belum ada data TikTok</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs text-slate-400 uppercase px-3 py-2">Tanggal</th>
                  <th className="text-left text-xs text-slate-400 uppercase px-3 py-2">Objective</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Budget</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">Spend</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">KPI 1</th>
                  <th className="text-right text-xs text-slate-400 uppercase px-3 py-2">KPI 2</th>
                  <th className="text-center text-xs text-slate-400 uppercase px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => {
                  const objConfig = OBJECTIVE_OPTIONS.find(o => o.value === r.objective);
                  return (
                    <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-3 py-2.5 text-white">{r.date}</td>
                      <td className="px-3 py-2.5 text-slate-300">
                        <span className="mr-1">{objConfig?.icon}</span>
                        {objConfig?.label}
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-300">Rp{formatNumber(r.budget_estimated)}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">Rp{formatNumber(r.actual_spend)}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">
                        {r.kpi_1_label}: {r.kpi_1_value?.toFixed(2) || '-'}
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-300">
                        {r.kpi_2_label}: {r.kpi_2_value ? formatNumber(r.kpi_2_value) : '-'}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          r.status === 'done' ? 'bg-green-500/10 text-green-400' :
                          r.status === 'ongoing' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {STATUS_OPTIONS.find(s => s.value === r.status)?.label}
                        </span>
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
