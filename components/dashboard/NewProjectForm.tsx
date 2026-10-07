'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { ProjectStatus, DivisionType } from '@/lib/types/dashboard';

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'hold', label: 'Hold' },
  { value: 'ongoing', label: 'On Going' },
  { value: 'review', label: 'Review' },
  { value: 'revisi', label: 'Revisi' },
  { value: 'done', label: 'Done' },
];

const DIVISION_OPTIONS: { value: DivisionType; label: string }[] = [
  { value: 'ads', label: 'Ads' },
  { value: 'content_creator', label: 'Content Creator' },
  { value: 'affiliate', label: 'Affiliate' },
  { value: 'kol', label: 'KOL' },
];

interface Brand {
  id: string;
  name: string;
}

interface DivisionInput {
  division: DivisionType;
  pic_name: string;
  status: ProjectStatus;
  enabled: boolean;
}

export default function NewProjectForm({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    brand_id: '',
    name: '',
    platform: 'shopee',
    status: 'ongoing' as ProjectStatus,
    start_date: new Date().toISOString().split('T')[0],
    deadline: '',
    notes: '',
  });

  const [divisions, setDivisions] = useState<DivisionInput[]>(
    DIVISION_OPTIONS.map(d => ({
      division: d.value,
      pic_name: '',
      status: 'ongoing' as ProjectStatus,
      enabled: false,
    }))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          ...form,
          created_by: user?.id,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create divisions
      const activeDivisions = divisions.filter(d => d.enabled);
      if (activeDivisions.length > 0) {
        const { error: divError } = await supabase
          .from('project_divisions')
          .insert(
            activeDivisions.map(d => ({
              project_id: project.id,
              division: d.division,
              pic_name: d.pic_name || null,
              status: d.status,
            }))
          );
        if (divError) throw divError;
      }

      router.push('/dashboard/projects');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal membuat project';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDivision = (index: number) => {
    const updated = [...divisions];
    updated[index].enabled = !updated[index].enabled;
    setDivisions(updated);
  };

  const updateDivision = (index: number, field: keyof DivisionInput, value: string) => {
    const updated = [...divisions];
    if (field === 'pic_name') {
      updated[index].pic_name = value;
    } else if (field === 'status') {
      updated[index].status = value as ProjectStatus;
    } else if (field === 'division') {
      updated[index].division = value as DivisionType;
    }
    setDivisions(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">Informasi Project</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Brand *</label>
            <select
              value={form.brand_id}
              onChange={e => setForm({ ...form, brand_id: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
            >
              <option value="">Pilih Brand</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nama Project *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Shop Optimization Q3 2026"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
            <select
              value={form.platform}
              onChange={e => setForm({ ...form, platform: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
            >
              <option value="shopee">Shopee</option>
              <option value="tiktok">TikTok Shop</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as ProjectStatus })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tanggal Mulai</label>
            <input
              type="date"
              value={form.start_date}
              onChange={e => setForm({ ...form, start_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Catatan / Kendala</label>
          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            rows={3}
            placeholder="Catatan tambahan tentang project ini..."
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Divisions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">Divisi & PIC</h2>
        <p className="text-slate-400 text-sm">Pilih divisi yang terlibat dalam project ini</p>

        <div className="space-y-3">
          {divisions.map((div, index) => (
            <div key={div.division} className={`border rounded-xl p-4 transition-colors ${
              div.enabled 
                ? 'bg-slate-800/50 border-amber-500/30' 
                : 'bg-slate-800/20 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleDivision(index)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    div.enabled 
                      ? 'bg-amber-500 border-amber-500 text-slate-900' 
                      : 'border-slate-600 text-transparent'
                  }`}
                >
                  ✓
                </button>
                <span className="text-white font-medium text-sm flex-1">
                  {DIVISION_OPTIONS.find(d => d.value === div.division)?.label}
                </span>
              </div>

              {div.enabled && (
                <div className="grid md:grid-cols-2 gap-4 mt-4 pl-9">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">PIC</label>
                    <input
                      type="text"
                      value={div.pic_name}
                      onChange={e => updateDivision(index, 'pic_name', e.target.value)}
                      placeholder="Nama PIC"
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm placeholder-slate-500 focus:border-amber-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                    <select
                      value={div.status}
                      onChange={e => updateDivision(index, 'status', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:border-amber-500 outline-none transition-all"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors text-sm border border-slate-700"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-900 font-bold transition-colors text-sm"
        >
          {loading ? 'Menyimpan...' : 'Buat Project'}
        </button>
      </div>
    </form>
  );
}
