'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { ProjectStatus, DivisionType } from '@/lib/types/dashboard';
import Link from 'next/link';

const STATUS_OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'hold', label: 'Hold', color: 'bg-gray-500' },
  { value: 'ongoing', label: 'On Going', color: 'bg-blue-500' },
  { value: 'review', label: 'Review', color: 'bg-amber-500' },
  { value: 'revisi', label: 'Revisi', color: 'bg-orange-500' },
  { value: 'done', label: 'Done', color: 'bg-green-500' },
];

const DIVISION_OPTIONS: { value: DivisionType; label: string; icon: string }[] = [
  { value: 'ads', label: 'Ads', icon: '📢' },
  { value: 'content_creator', label: 'Content Creator', icon: '🎬' },
  { value: 'affiliate', label: 'Affiliate', icon: '🤝' },
  { value: 'kol', label: 'KOL', icon: '⭐' },
];

interface ProjectDetailClientProps {
  projectId: string;
}

interface Division {
  id: string;
  division: DivisionType;
  pic_name?: string;
  status: ProjectStatus;
}

interface Project {
  id: string;
  brand_id: string;
  name: string;
  platform: string;
  status: ProjectStatus;
  start_date?: string;
  deadline?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  brand?: { id: string; name: string; logo_url?: string };
  divisions?: Division[];
}

export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Edit form state
  const [form, setForm] = useState({
    name: '',
    platform: 'shopee',
    status: 'ongoing' as ProjectStatus,
    start_date: '',
    deadline: '',
    notes: '',
  });

  const [divisions, setDivisions] = useState<{
    division: DivisionType;
    pic_name: string;
    status: ProjectStatus;
    enabled: boolean;
    id?: string;
  }[]>([]);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*, brand:brands(*), divisions:project_divisions(*)')
      .eq('id', projectId)
      .single();

    if (fetchError || !data) {
      setError('Project tidak ditemukan');
      setLoading(false);
      return;
    }

    setProject(data);
    setForm({
      name: data.name,
      platform: data.platform,
      status: data.status,
      start_date: data.start_date || '',
      deadline: data.deadline || '',
      notes: data.notes || '',
    });

    // Map divisions
    const divMap = DIVISION_OPTIONS.map(d => {
      const existing = (data.divisions || []).find((ed: Division) => ed.division === d.value);
      return {
        division: d.value,
        pic_name: existing?.pic_name || '',
        status: existing?.status || 'ongoing' as ProjectStatus,
        enabled: !!existing,
        id: existing?.id,
      };
    });
    setDivisions(divMap);
    setLoading(false);
  }, [projectId, supabase]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Update project
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          name: form.name,
          platform: form.platform,
          status: form.status,
          start_date: form.start_date || null,
          deadline: form.deadline || null,
          notes: form.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Handle divisions
      // Delete removed divisions
      const existingDivIds = divisions.filter(d => d.id && !d.enabled).map(d => d.id!);
      if (existingDivIds.length > 0) {
        await supabase.from('project_divisions').delete().in('id', existingDivIds);
      }

      // Update existing divisions
      for (const div of divisions.filter(d => d.enabled && d.id)) {
        await supabase
          .from('project_divisions')
          .update({
            pic_name: div.pic_name || null,
            status: div.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', div.id!);
      }

      // Insert new divisions
      const newDivisions = divisions.filter(d => d.enabled && !d.id);
      if (newDivisions.length > 0) {
        await supabase.from('project_divisions').insert(
          newDivisions.map(d => ({
            project_id: projectId,
            division: d.division,
            pic_name: d.pic_name || null,
            status: d.status,
          }))
        );
      }

      setSuccess('Project berhasil diupdate!');
      setEditing(false);
      fetchProject();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengupdate project';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const { error: delError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (delError) throw delError;
      router.push('/dashboard/projects');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus project';
      setError(message);
      setSaving(false);
    }
  };

  const toggleDivision = (index: number) => {
    const updated = [...divisions];
    updated[index].enabled = !updated[index].enabled;
    setDivisions(updated);
  };

  const updateDivision = (index: number, field: string, value: string) => {
    const updated = [...divisions];
    if (field === 'pic_name') {
      updated[index].pic_name = value;
    } else if (field === 'status') {
      updated[index].status = value as ProjectStatus;
    }
    setDivisions(updated);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/3 mb-4" />
          <div className="h-4 bg-slate-800 rounded w-1/2 mb-8" />
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-slate-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg mb-4">Project tidak ditemukan</p>
        <Link href="/dashboard/projects" className="text-amber-400 hover:text-amber-300 text-sm">
          ← Kembali ke Projects
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_OPTIONS.find(s => s.value === project.status);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/projects"
            className="text-slate-400 hover:text-white transition-colors mt-1"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-slate-400 text-sm">{project.brand?.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-sm capitalize">{project.platform}</span>
              <span className="text-slate-600">•</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                statusConfig?.value === 'done' ? 'bg-green-500/10 text-green-400' :
                statusConfig?.value === 'ongoing' ? 'bg-blue-500/10 text-blue-400' :
                statusConfig?.value === 'review' ? 'bg-amber-500/10 text-amber-400' :
                statusConfig?.value === 'revisi' ? 'bg-orange-500/10 text-orange-400' :
                'bg-gray-500/10 text-gray-400'
              }`}>
                {statusConfig?.label}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-10 sm:ml-0">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors text-sm border border-slate-700"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors text-sm border border-red-500/20"
              >
                🗑️ Hapus
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setEditing(false); fetchProject(); }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors text-sm border border-slate-700"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-900 font-bold transition-colors text-sm"
              >
                {saving ? 'Menyimpan...' : '💾 Simpan'}
              </button>
            </>
          )}
        </div>
      </div>

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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm mb-3">⚠️ Yakin ingin menghapus project &quot;{project.name}&quot;? Semua data terkait akan ikut terhapus.</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-400 transition-colors"
            >
              {saving ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Project Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">Informasi Project</h2>

        {editing ? (
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nama Project</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
              <select
                value={form.platform}
                onChange={e => setForm({ ...form, platform: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
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
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
              <input
                type="date"
                value={form.start_date}
                onChange={e => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Catatan</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 outline-none transition-all resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Brand</p>
              <p className="text-white text-sm">{project.brand?.name || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Platform</p>
              <p className="text-white text-sm capitalize">{project.platform}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Start Date</p>
              <p className="text-white text-sm">{project.start_date || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Deadline</p>
              <p className="text-white text-sm">{project.deadline || '-'}</p>
            </div>
            <div className="md:col-span-2 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Catatan</p>
              <p className="text-slate-300 text-sm">{project.notes || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Dibuat</p>
              <p className="text-slate-400 text-sm">{new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Terakhir Update</p>
              <p className="text-slate-400 text-sm">{new Date(project.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        )}
      </div>

      {/* Divisions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">Divisi & PIC</h2>

        {editing ? (
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
                  <span className="text-lg">{DIVISION_OPTIONS.find(d => d.value === div.division)?.icon}</span>
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
                        className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm placeholder-slate-500 focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                      <select
                        value={div.status}
                        onChange={e => updateDivision(index, 'status', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:border-amber-500 outline-none"
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
        ) : (
          <div className="space-y-3">
            {(project.divisions || []).length === 0 ? (
              <p className="text-slate-500 text-sm">Belum ada divisi ditugaskan</p>
            ) : (
              (project.divisions || []).map((div) => {
                const divConfig = DIVISION_OPTIONS.find(d => d.value === div.division);
                const divStatus = STATUS_OPTIONS.find(s => s.value === div.status);
                return (
                  <div key={div.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{divConfig?.icon}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{divConfig?.label}</p>
                        <p className="text-slate-400 text-xs">PIC: {div.pic_name || '-'}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      divStatus?.value === 'done' ? 'bg-green-500/10 text-green-400' :
                      divStatus?.value === 'ongoing' ? 'bg-blue-500/10 text-blue-400' :
                      divStatus?.value === 'review' ? 'bg-amber-500/10 text-amber-400' :
                      divStatus?.value === 'revisi' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {divStatus?.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {!editing && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link
              href={`/dashboard/update?project=${projectId}&type=shopee-daily`}
              className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-colors text-center"
            >
              <span className="text-2xl">📊</span>
              <span className="text-white text-xs font-medium">Input Shopee Daily</span>
            </Link>
            <Link
              href={`/dashboard/update?project=${projectId}&type=shopee-monthly`}
              className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-colors text-center"
            >
              <span className="text-2xl">📅</span>
              <span className="text-white text-xs font-medium">Input Shopee Monthly</span>
            </Link>
            <Link
              href={`/dashboard/update?project=${projectId}&type=tiktok`}
              className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-colors text-center"
            >
              <span className="text-2xl">🎵</span>
              <span className="text-white text-xs font-medium">Input TikTok Data</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
