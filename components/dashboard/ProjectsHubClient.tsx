'use client';

import { useState, useMemo } from 'react';
import { Icons } from '@/components/ui/Icons';
import type { DashboardUser } from '@/lib/types/dashboard';
import { isManagerOrAbove } from '@/lib/types/dashboard';

export type ServiceType = 'shop_opt' | 'live_streaming' | 'content' | 'kol';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskStatus = 'belum_dimulai' | 'ongoing' | 'review' | 'revisi' | 'done';

export interface TaskItem {
  id: string;
  title: string;
  brand_name: string;
  service_type: ServiceType;
  pic_name: string;
  pic_email?: string;
  created_by?: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
}

interface ProjectsHubClientProps {
  user: DashboardUser;
  initialTasks?: TaskItem[];
  brandsList?: { id: string; name: string }[];
}

const SERVICE_CONFIG: Record<ServiceType, { label: string; color: string; border: string }> = {
  shop_opt: { label: 'Shop Opt', color: 'text-amber-400 bg-amber-500/10', border: 'border-amber-500/25' },
  live_streaming: { label: 'Live Stream', color: 'text-blue-400 bg-blue-500/10', border: 'border-blue-500/25' },
  content: { label: 'Content', color: 'text-purple-400 bg-purple-500/10', border: 'border-purple-500/25' },
  kol: { label: 'KOL & Affiliate', color: 'text-emerald-400 bg-emerald-500/10', border: 'border-emerald-500/25' },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  belum_dimulai: { label: 'Belum Dimulai', color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' },
  ongoing: { label: 'Berjalan', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/25' },
  review: { label: 'Review', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/25' },
  revisi: { label: 'Revisi', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/25' },
  done: { label: 'Selesai', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Rendah', color: 'text-slate-400' },
  normal: { label: 'Normal', color: 'text-slate-200' },
  high: { label: 'Tinggi', color: 'text-amber-400' },
  urgent: { label: 'Urgent', color: 'text-red-400 font-bold' },
};

// Baseline tasks if database tasks table has empty rows
const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Optimasi Keyword Ads 10.10 Promo',
    brand_name: 'Somethinc Official',
    service_type: 'shop_opt',
    pic_name: 'Fikri Haikal',
    pic_email: 'fikri@bizhiveid.com',
    deadline: '2026-10-14',
    priority: 'urgent',
    status: 'ongoing',
    notes: 'Alokasikan budget 40% ke winning SKU serum',
  },
  {
    id: 't-2',
    title: 'Audit Skor Kesehatan Toko & Penalti Poin',
    brand_name: 'Buttonscarves Beauty',
    service_type: 'shop_opt',
    pic_name: 'Fikri Haikal',
    pic_email: 'fikri@bizhiveid.com',
    deadline: '2026-10-15',
    priority: 'normal',
    status: 'review',
    notes: 'Pastikan respon chat di atas 95%',
  },
  {
    id: 't-3',
    title: 'Brief Host Live Stream Flash Sale 20:00-24:00',
    brand_name: 'Cosmax Store',
    service_type: 'live_streaming',
    pic_name: 'Rian Pratama',
    pic_email: 'rian@bizhiveid.com',
    deadline: '2026-10-13',
    priority: 'high',
    status: 'ongoing',
    notes: 'Siapkan sample lipcream & voucher eksklusif live',
  },
  {
    id: 't-4',
    title: 'Produksi 3 Video Hook Problem-Solution (Skincare)',
    brand_name: 'Somethinc Official',
    service_type: 'content',
    pic_name: 'Nadia Rahma',
    pic_email: 'nadia@bizhiveid.com',
    deadline: '2026-10-16',
    priority: 'high',
    status: 'ongoing',
    notes: 'Target CTR di atas 3.5%',
  },
  {
    id: 't-5',
    title: 'Follow-up 20 Micro KOL Beauty Sample Tracking',
    brand_name: 'Buttonscarves Beauty',
    service_type: 'kol',
    pic_name: 'Sarah Putri',
    pic_email: 'sarah@bizhiveid.com',
    deadline: '2026-10-17',
    priority: 'normal',
    status: 'belum_dimulai',
    notes: 'Minta draft postingan sebelum tayang',
  },
  {
    id: 't-6',
    title: 'Revisi Copywriting Banner Dekorasi Toko TikTok',
    brand_name: 'Cosmax Store',
    service_type: 'shop_opt',
    pic_name: 'Nadia Rahma',
    pic_email: 'nadia@bizhiveid.com',
    deadline: '2026-10-14',
    priority: 'urgent',
    status: 'revisi',
    notes: 'Font ukuran diskon kurang kontras sesuai feedback klien',
  },
  {
    id: 't-7',
    title: 'Rekap Laporan Performa Mingguan Live Session',
    brand_name: 'Buttonscarves Beauty',
    service_type: 'live_streaming',
    pic_name: 'Rian Pratama',
    pic_email: 'rian@bizhiveid.com',
    deadline: '2026-10-12',
    priority: 'normal',
    status: 'done',
    notes: 'Omset per jam naik 22% dibanding minggu lalu',
  },
];

type FilterTab = 'all' | 'my_tasks' | 'created_by_me';

export default function ProjectsHubClient({
  user,
  initialTasks,
  brandsList = [
    { id: 'b1', name: 'Somethinc Official' },
    { id: 'b2', name: 'Buttonscarves Beauty' },
    { id: 'b3', name: 'Cosmax Store' },
  ],
}: ProjectsHubClientProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks && initialTasks.length > 0 ? initialTasks : DEFAULT_TASKS);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // New task form state
  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState(brandsList[0]?.name || 'Somethinc Official');
  const [formService, setFormService] = useState<ServiceType>('shop_opt');
  const [formPic, setFormPic] = useState(user.full_name || 'Staf');
  const [formDeadline, setFormDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [formPriority, setFormPriority] = useState<TaskPriority>('normal');
  const [formNotes, setFormNotes] = useState('');

  const isManager = isManagerOrAbove(user.role);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Sub-tab filter
      if (activeFilterTab === 'my_tasks') {
        const isMyPic =
          t.pic_name.toLowerCase().includes(user.full_name.toLowerCase()) ||
          (t.pic_email && t.pic_email.toLowerCase() === user.email.toLowerCase());
        if (!isMyPic) return false;
      }
      if (activeFilterTab === 'created_by_me') {
        if (t.created_by && t.created_by !== user.id) return false;
      }

      // Service filter
      if (selectedService !== 'all' && t.service_type !== selectedService) return false;

      // Status filter
      if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchBrand = t.brand_name.toLowerCase().includes(q);
        const matchPic = t.pic_name.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchPic) return false;
      }

      return true;
    });
  }, [tasks, activeFilterTab, selectedService, selectedStatus, searchQuery, user]);

  // Status counts for badge
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      ongoing: tasks.filter((t) => t.status === 'ongoing').length,
      review: tasks.filter((t) => t.status === 'review').length,
      revisi: tasks.filter((t) => t.status === 'revisi').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
  }, [tasks]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title: formTitle,
      brand_name: formBrand,
      service_type: formService,
      pic_name: isManager ? formPic : user.full_name, // Member assigns to themselves
      pic_email: isManager ? undefined : user.email,
      created_by: user.id,
      deadline: formDeadline,
      priority: formPriority,
      status: 'ongoing',
      notes: formNotes,
    };

    setTasks([newTask, ...tasks]);
    setShowCreateModal(false);
    // Reset form
    setFormTitle('');
    setFormNotes('');
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? editingTask : t))
    );
    setEditingTask(null);
  };

  const calculateDaysLeft = (deadlineStr: string) => {
    const now = new Date();
    const d = new Date(deadlineStr);
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Top Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Dapur Kerja Operasional
            </span>
            <span className="text-slate-500 text-xs font-mono">{tasks.length} Total Task</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects & Tasks</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Kelola pembagian tugas operasional tim, monitor PIC, deadline, dan alur pengerjaan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
          >
            <Icons.Plus size={14} />
            <span>Tambah Task</span>
          </button>
        </div>
      </div>

      {/* ─── Tasks Table & Operational Management ─── */}
      <div className="space-y-4">
          {/* Sub-tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#0D131F] border border-slate-800 p-3 rounded-xl">
            {/* Left: View Filter Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeFilterTab === 'all'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua Project ({tasks.length})
              </button>
              <button
                onClick={() => setActiveFilterTab('my_tasks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeFilterTab === 'my_tasks'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Task Saya
              </button>
              <button
                onClick={() => setActiveFilterTab('created_by_me')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeFilterTab === 'created_by_me'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dibuat Saya
              </button>
            </div>

            {/* Right: Quick Status Counters */}
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {counts.ongoing} Berjalan
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {counts.review} Review
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {counts.revisi} Revisi
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {counts.done} Selesai
              </span>
            </div>
          </div>

          {/* Filter Bar (Search + Dropdowns) */}
          <div className="grid sm:grid-cols-3 gap-3 bg-[#0D131F] border border-slate-800 p-3 rounded-xl">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">
                <Icons.Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Cari task, brand, atau PIC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {/* Service Filter */}
            <div>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500/60"
              >
                <option value="all">Semua Servis / Area</option>
                <option value="shop_opt">Shop Optimization</option>
                <option value="live_streaming">Live Streaming</option>
                <option value="content">Content Production</option>
                <option value="kol">KOL & Affiliate</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500/60"
              >
                <option value="all">Semua Status</option>
                <option value="belum_dimulai">Belum Dimulai</option>
                <option value="ongoing">Berjalan</option>
                <option value="review">Review</option>
                <option value="revisi">Revisi</option>
                <option value="done">Selesai</option>
              </select>
            </div>
          </div>

          {/* ─── Main Tasks Table ─── */}
          <div className="bg-[#0D131F] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3">Pekerjaan & Brand</th>
                    <th className="px-4 py-3">Area Servis</th>
                    <th className="px-4 py-3">PIC</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3">Prioritas</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                        Tidak ada pekerjaan yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((t) => {
                      const daysLeft = calculateDaysLeft(t.deadline);
                      const isUrgentDeadline = daysLeft <= 2 && t.status !== 'done';
                      const srvConfig = SERVICE_CONFIG[t.service_type] || SERVICE_CONFIG.shop_opt;
                      const statConfig = STATUS_CONFIG[t.status] || STATUS_CONFIG.ongoing;
                      const prioConfig = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.normal;

                      return (
                        <tr
                          key={t.id}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          {/* Title & Brand */}
                          <td className="px-4 py-3.5">
                            <div>
                              <p className="font-semibold text-white group-hover:text-amber-400 transition-colors leading-snug">
                                {t.title}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{t.brand_name}</p>
                              {t.notes && (
                                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic">
                                  {t.notes}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Service Badge */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded border ${srvConfig.color} ${srvConfig.border}`}
                            >
                              {srvConfig.label}
                            </span>
                          </td>

                          {/* PIC */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                {t.pic_name.charAt(0)}
                              </div>
                              <span className="text-slate-200">{t.pic_name}</span>
                            </div>
                          </td>

                          {/* Deadline */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div>
                              <p
                                className={`font-mono text-[11px] ${
                                  isUrgentDeadline ? 'text-red-400 font-bold' : 'text-slate-300'
                                }`}
                              >
                                {t.deadline}
                              </p>
                              <span
                                className={`text-[10px] font-mono ${
                                  t.status === 'done'
                                    ? 'text-slate-500'
                                    : daysLeft < 0
                                    ? 'text-red-400 font-bold'
                                    : daysLeft <= 2
                                    ? 'text-orange-400 font-semibold'
                                    : 'text-slate-500'
                                }`}
                              >
                                {t.status === 'done'
                                  ? 'Selesai'
                                  : daysLeft < 0
                                  ? `Terlewat ${Math.abs(daysLeft)} hari`
                                  : daysLeft === 0
                                  ? 'Hari ini'
                                  : `${daysLeft} hari lagi`}
                              </span>
                            </div>
                          </td>

                          {/* Priority */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`text-[11px] ${prioConfig.color}`}>
                              {prioConfig.label}
                            </span>
                          </td>

                          {/* Status Picker (Member can pick, Manager has full control) */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <select
                              value={t.status}
                              onChange={(e) =>
                                handleUpdateStatus(t.id, e.target.value as TaskStatus)
                              }
                              className={`text-[11px] font-medium px-2 py-1 rounded border outline-none cursor-pointer transition-colors ${statConfig.bg} ${statConfig.color}`}
                            >
                              <option value="belum_dimulai">Belum Dimulai</option>
                              <option value="ongoing">Berjalan</option>
                              <option value="review">Review</option>
                              <option value="revisi">Revisi</option>
                              <option value="done">Selesai</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => setEditingTask(t)}
                              className="text-xs text-slate-400 hover:text-amber-400 transition-colors px-2 py-1 rounded hover:bg-slate-800"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* ─── Modal Tambah Pekerjaan / Task ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0D131F] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Tambah Task / Pekerjaan Baru</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Judul Pekerjaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Evaluasi Winning Ads Campaign 10.10"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Brand Klien *</label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    {brandsList.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Area / Servis *</label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value as ServiceType)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="shop_opt">Shop Optimization</option>
                    <option value="live_streaming">Live Streaming</option>
                    <option value="content">Content Production</option>
                    <option value="kol">KOL & Affiliate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    PIC (Penanggung Jawab) *
                  </label>
                  <input
                    type="text"
                    disabled={!isManager}
                    value={isManager ? formPic : user.full_name}
                    onChange={(e) => setFormPic(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white disabled:opacity-60 focus:outline-none focus:border-amber-500"
                    placeholder="Nama PIC"
                  />
                  {!isManager && (
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Member otomatis menugaskan ke diri sendiri
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Deadline *</label>
                  <input
                    type="date"
                    required
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Prioritas *</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'normal', 'high', 'urgent'] as TaskPriority[]).map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setFormPriority(prio)}
                      className={`py-1.5 rounded-lg border text-center font-medium capitalize transition-all ${
                        formPriority === prio
                          ? 'border-amber-500/60 bg-amber-500/15 text-amber-300 font-semibold'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {PRIORITY_CONFIG[prio].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Catatan / Instruksi</label>
                <textarea
                  rows={3}
                  placeholder="Detail instruksi atau parameter pekerjaan..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Simpan Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal Edit Task ─── */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0D131F] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Edit Task</h2>
              <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Judul Pekerjaan</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">PIC</label>
                  <input
                    type="text"
                    disabled={!isManager}
                    value={editingTask.pic_name}
                    onChange={(e) => setEditingTask({ ...editingTask, pic_name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white disabled:opacity-60 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={editingTask.deadline}
                    onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prioritas</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, priority: e.target.value as TaskPriority })
                    }
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="low">Rendah</option>
                    <option value="normal">Normal</option>
                    <option value="high">Tinggi</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })
                    }
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="belum_dimulai">Belum Dimulai</option>
                    <option value="ongoing">Berjalan</option>
                    <option value="review">Review</option>
                    <option value="revisi">Revisi</option>
                    <option value="done">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Catatan</label>
                <textarea
                  rows={3}
                  value={editingTask.notes || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
