'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types/dashboard';

export type TaskPlatform = 'shopee' | 'tiktok' | 'tokopedia' | 'lazada' | 'instagram' | 'other';
export type TaskPillar = 'listing' | 'ads' | 'promo' | 'other';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'revision' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  brand_name: string;
  platform: TaskPlatform;
  pillar: TaskPillar;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_name: string;
  deadline?: string;
  has_issue: boolean;
  issue_notes?: string;
  external_link?: string;
  created_at?: string;
}

const INITIAL_DEMO_TASKS: TaskItem[] = [
  {
    id: 'demo-1',
    title: 'Revamp Foto Etalase & Copywriting 10 Hero Skincare',
    brand_name: 'Somethinc Official',
    platform: 'shopee',
    pillar: 'listing',
    status: 'in_progress',
    priority: 'high',
    assigned_name: 'Sarah (Designer)',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_issue: true,
    issue_notes: 'Menunggu foto botol baru resolusi tinggi dari tim klien',
    external_link: 'https://drive.google.com',
  },
  {
    id: 'demo-2',
    title: 'Optimasi Bid Kata Kunci & Target ROAS 6.0',
    brand_name: 'Somethinc Official',
    platform: 'shopee',
    pillar: 'ads',
    status: 'in_progress',
    priority: 'urgent',
    assigned_name: 'Rian (Ads Specialist)',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_issue: false,
  },
  {
    id: 'demo-3',
    title: 'Setup Voucher Payday 10% & Combo Hemat Bundling',
    brand_name: 'Buttonscarves Beauty',
    platform: 'tiktok',
    pillar: 'promo',
    status: 'backlog',
    priority: 'normal',
    assigned_name: 'Dina (Store Ops)',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_issue: false,
  },
  {
    id: 'demo-4',
    title: 'Audit Listing & Spesifikasi Produk Terkena Warning',
    brand_name: 'Cosmax Store',
    platform: 'tokopedia',
    pillar: 'listing',
    status: 'review',
    priority: 'normal',
    assigned_name: 'Budi (Operations)',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_issue: false,
  },
  {
    id: 'demo-5',
    title: 'Daftar Flash Sale Toko & Mega Campaign 11.11',
    brand_name: 'Buttonscarves Beauty',
    platform: 'tiktok',
    pillar: 'promo',
    status: 'done',
    priority: 'high',
    assigned_name: 'Dina (Store Ops)',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_issue: false,
  },
  {
    id: 'demo-6',
    title: 'A/B Testing Thumbnail Video Etalase Produk Serum',
    brand_name: 'Somethinc Official',
    platform: 'lazada',
    pillar: 'listing',
    status: 'revision',
    priority: 'normal',
    assigned_name: 'Sarah (Designer)',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_issue: true,
    issue_notes: 'Warna font terlalu kontras, minta di-tone down sesuai brand guideline',
  },
];

const COLUMNS: { key: TaskStatus; label: string; dotColor: string }[] = [
  { key: 'backlog', label: 'To-Do / Backlog', dotColor: 'bg-slate-400' },
  { key: 'in_progress', label: 'In Progress', dotColor: 'bg-blue-400' },
  { key: 'review', label: 'Review / QC', dotColor: 'bg-amber-400' },
  { key: 'revision', label: 'Revisi', dotColor: 'bg-orange-400' },
  { key: 'done', label: 'Done / Live', dotColor: 'bg-emerald-400' },
];

export default function ProjectBoardClient({ currentUser }: { currentUser: Profile }) {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_DEMO_TASKS);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [onlyIssues, setOnlyIssues] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTaskDetail, setActiveTaskDetail] = useState<TaskItem | null>(null);

  // Form State for New Task
  const [formData, setFormData] = useState({
    title: '',
    brand_name: '',
    platform: 'shopee' as TaskPlatform,
    pillar: 'listing' as TaskPillar,
    priority: 'normal' as TaskPriority,
    status: 'backlog' as TaskStatus,
    assigned_name: currentUser.full_name || '',
    deadline: '',
    external_link: '',
    has_issue: false,
    issue_notes: '',
  });

  // Fetch tasks from Supabase
  useEffect(() => {
    async function loadTasks() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setTasks(data as TaskItem[]);
        }
      } catch (err) {
        console.error('Failed to fetch tasks, using demo tasks', err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  // Quick move status handler
  const handleMoveStatus = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const supabase = createClient();
      await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    } catch {
      // In-memory fallback
    }
  };

  // Create new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.brand_name) return;

    const newTask: TaskItem = {
      id: 'task-' + Date.now(),
      title: formData.title,
      brand_name: formData.brand_name,
      platform: formData.platform,
      pillar: formData.pillar,
      priority: formData.priority,
      status: formData.status,
      assigned_name: formData.assigned_name || currentUser.full_name,
      deadline: formData.deadline || undefined,
      external_link: formData.external_link || undefined,
      has_issue: formData.has_issue,
      issue_notes: formData.has_issue ? formData.issue_notes : undefined,
      created_at: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsModalOpen(false);

    // Reset Form
    setFormData({
      title: '',
      brand_name: '',
      platform: 'shopee',
      pillar: 'listing',
      priority: 'normal',
      status: 'backlog',
      assigned_name: currentUser.full_name || '',
      deadline: '',
      external_link: '',
      has_issue: false,
      issue_notes: '',
    });

    try {
      const supabase = createClient();
      await supabase.from('tasks').insert([newTask]);
    } catch (err) {
      console.log('Saved to state (Supabase sync in background)', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setActiveTaskDetail(null);
    try {
      const supabase = createClient();
      await supabase.from('tasks').delete().eq('id', id);
    } catch {
      // silent
    }
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assigned_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPlatform = selectedPlatform === 'all' || t.platform === selectedPlatform;
      const matchPillar = selectedPillar === 'all' || t.pillar === selectedPillar;
      const matchIssues = !onlyIssues || t.has_issue;

      return matchSearch && matchPlatform && matchPillar && matchIssues;
    });
  }, [tasks, searchQuery, selectedPlatform, selectedPillar, onlyIssues]);

  // Pillar styling helper
  const getPillarBadge = (pillar: TaskPillar) => {
    switch (pillar) {
      case 'listing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">🖼️ Listing</span>;
      case 'ads':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">🎯 Ads Setting</span>;
      case 'promo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">🎟️ Promo</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-slate-300">Lainnya</span>;
    }
  };

  // Platform styling helper
  const getPlatformBadge = (platform: TaskPlatform) => {
    switch (platform) {
      case 'shopee':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ee4d2d]/20 text-[#ff6a48] border border-[#ee4d2d]/30">Shopee</span>;
      case 'tiktok':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">TikTok</span>;
      case 'tokopedia':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Tokopedia</span>;
      case 'lazada':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Lazada</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 uppercase">{platform}</span>;
    }
  };

  // Priority styling helper
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse">🔥 Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">High</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Header & Actions ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Shop Optimization Board</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              3 Pilar E-Commerce
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Tracking eksekusi Listing, Ads Setting, dan Promo per platform toko.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <span>+</span> Tambah Task
          </button>
        </div>
      </div>

      {/* ─── Filter & Search Bar ─── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari task, brand, atau PIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Platform & Pillar Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Platform Pills */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Semua Platform</option>
            <option value="shopee">Shopee</option>
            <option value="tiktok">TikTok Shop</option>
            <option value="tokopedia">Tokopedia</option>
            <option value="lazada">Lazada</option>
          </select>

          {/* Pillar Selector */}
          <select
            value={selectedPillar}
            onChange={(e) => setSelectedPillar(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Semua Pilar</option>
            <option value="listing">🖼️ Product Listing</option>
            <option value="ads">🎯 Ads Setting</option>
            <option value="promo">🎟️ Promo Setup</option>
          </select>

          {/* Filter Issue Radar */}
          <button
            onClick={() => setOnlyIssues(!onlyIssues)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              onlyIssues
                ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-md shadow-red-500/20'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <span>⚠️</span> Hanya Ada Issue ({tasks.filter((t) => t.has_issue).length})
          </button>
        </div>
      </div>

      {/* ─── KANBAN VIEW ─── */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.key);
            const colIndex = COLUMNS.findIndex((c) => c.key === col.key);

            return (
              <div key={col.key} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 min-h-[500px] flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider">{col.label}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setActiveTaskDetail(task)}
                      className={`group bg-slate-950/90 border rounded-xl p-3.5 transition-all cursor-pointer hover:border-amber-500/50 hover:shadow-xl ${
                        task.has_issue
                          ? 'border-red-500/40 bg-red-950/10 hover:border-red-500'
                          : 'border-slate-800'
                      }`}
                    >
                      {/* Tags Bar */}
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getPlatformBadge(task.platform)}
                          {getPillarBadge(task.pillar)}
                        </div>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {/* Brand Name */}
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        {task.brand_name}
                      </p>

                      {/* Title */}
                      <h4 className="text-white text-sm font-semibold mt-1 leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {task.title}
                      </h4>

                      {/* Issue Box (if exists) */}
                      {task.has_issue && task.issue_notes && (
                        <div className="mt-2.5 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] flex items-start gap-1.5">
                          <span className="flex-shrink-0">🚨</span>
                          <span className="line-clamp-2">{task.issue_notes}</span>
                        </div>
                      )}

                      {/* Footer: PIC & Deadline */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-300">
                            {task.assigned_name.charAt(0)}
                          </div>
                          <span className="truncate max-w-[90px]">{task.assigned_name}</span>
                        </div>

                        {task.deadline && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            📅 {task.deadline.slice(5)}
                          </span>
                        )}
                      </div>

                      {/* Quick Move Status Buttons */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          disabled={colIndex === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStatus(task.id, COLUMNS[colIndex - 1].key);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                        >
                          ← Geser
                        </button>
                        <button
                          disabled={colIndex === COLUMNS.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStatus(task.id, COLUMNS[colIndex + 1].key);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                        >
                          Geser →
                        </button>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-xs">
                      Kosong
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TABLE VIEW ─── */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Brand & Platform</th>
                  <th className="px-4 py-3.5">Pilar</th>
                  <th className="px-4 py-3.5">Task Title</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">PIC</th>
                  <th className="px-4 py-3.5">Deadline</th>
                  <th className="px-4 py-3.5">Kendala (Issue)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => setActiveTaskDetail(task)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getPlatformBadge(task.platform)}
                        <span className="font-bold text-white text-xs">{task.brand_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getPillarBadge(task.pillar)}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{task.title}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs font-semibold text-slate-300">
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getPriorityBadge(task.priority) || <span className="text-slate-500 text-xs">Normal</span>}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">{task.assigned_name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{task.deadline || '-'}</td>
                    <td className="px-4 py-3">
                      {task.has_issue ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                          ⚠️ {task.issue_notes || 'Ada kendala'}
                        </span>
                      ) : (
                        <span className="text-emerald-500 text-xs">✓ Aman</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL DETAIL TASK ─── */}
      {activeTaskDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {getPlatformBadge(activeTaskDetail.platform)}
                {getPillarBadge(activeTaskDetail.pillar)}
              </div>
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-amber-400 text-xs font-bold uppercase">{activeTaskDetail.brand_name}</p>
              <h3 className="text-white text-lg font-bold mt-1">{activeTaskDetail.title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Status:</span>
                <span className="text-white font-semibold capitalize">{activeTaskDetail.status.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Priority:</span>
                <span className="text-white font-semibold capitalize">{activeTaskDetail.priority}</span>
              </div>
              <div>
                <span className="text-slate-500 block">PIC Assignee:</span>
                <span className="text-white font-semibold">{activeTaskDetail.assigned_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Deadline:</span>
                <span className="text-white font-semibold font-mono">{activeTaskDetail.deadline || '-'}</span>
              </div>
            </div>

            {/* Issue Alert in detail */}
            {activeTaskDetail.has_issue && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <span>🚨</span> Laporan Kendala (Blocker):
                </span>
                <p>{activeTaskDetail.issue_notes || 'Menunggu tindakan lebih lanjut.'}</p>
              </div>
            )}

            {activeTaskDetail.external_link && (
              <div>
                <a
                  href={activeTaskDetail.external_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
                >
                  🔗 Buka Link Aset / Google Drive ↗
                </a>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDeleteTask(activeTaskDetail.id)}
                className="text-red-400 hover:text-red-300 text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-red-500/10"
              >
                Hapus Task
              </button>
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-2 px-4 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL TAMBAH TASK BARU ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-white text-base font-bold">Tambah Task Baru (Shop Optimization)</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Brand / Toko</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Somethinc Official"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Task</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Revamp 10 Hero Listing & Tambah Video"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as TaskPlatform })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="shopee">Shopee</option>
                    <option value="tiktok">TikTok Shop</option>
                    <option value="tokopedia">Tokopedia</option>
                    <option value="lazada">Lazada</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pilar</label>
                  <select
                    value={formData.pillar}
                    onChange={(e) => setFormData({ ...formData, pillar: e.target.value as TaskPillar })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="listing">🖼️ Product Listing</option>
                    <option value="ads">🎯 Ads Setting</option>
                    <option value="promo">🎟️ Promo Setup</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Kolom</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="backlog">To-Do / Backlog</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review / QC</option>
                    <option value="revision">Revisi</option>
                    <option value="done">Done / Live</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prioritas</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">🔥 Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PIC Assignee</label>
                  <input
                    type="text"
                    placeholder="Nama PIC"
                    value={formData.assigned_name}
                    onChange={(e) => setFormData({ ...formData, assigned_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Link Aset / G-Drive (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={formData.external_link}
                  onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              {/* Checkbox Issue / Blocker */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.has_issue}
                    onChange={(e) => setFormData({ ...formData, has_issue: e.target.checked })}
                    className="w-4 h-4 rounded text-red-500 bg-slate-950 border-slate-700 focus:ring-0"
                  />
                  <span>⚠️ Laporkan Kendala / Blocker (Radar Atasan)</span>
                </label>

                {formData.has_issue && (
                  <div className="mt-2.5">
                    <textarea
                      placeholder="Jelaskan kendala di lapangan (misal: saldo ads habis, foto produk belum dikirim klien, akun kena pembatasan)..."
                      value={formData.issue_notes}
                      onChange={(e) => setFormData({ ...formData, issue_notes: e.target.value })}
                      rows={2}
                      className="w-full bg-red-950/20 border border-red-500/40 rounded-xl p-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-400"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20"
                >
                  Simpan Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
