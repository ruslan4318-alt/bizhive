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
  shop_opt:       { label: 'Shop Opt',        color: 'text-amber-700 bg-amber-50',    border: 'border-amber-200' },
  live_streaming: { label: 'Live Stream',     color: 'text-blue-700 bg-blue-50',      border: 'border-blue-200' },
  content:        { label: 'Content',         color: 'text-purple-700 bg-purple-50',  border: 'border-purple-200' },
  kol:            { label: 'KOL & Affiliate', color: 'text-emerald-700 bg-emerald-50',border: 'border-emerald-200' },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  belum_dimulai: { label: 'Belum Dimulai', color: 'text-gray-600',    bg: 'bg-gray-100 border-gray-300' },
  ongoing:       { label: 'Berjalan',      color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  review:        { label: 'Review',        color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200' },
  revisi:        { label: 'Revisi',        color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200' },
  done:          { label: 'Selesai',       color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low:    { label: 'Rendah', color: 'text-gray-400' },
  normal: { label: 'Normal', color: 'text-gray-600' },
  high:   { label: 'Tinggi', color: 'text-amber-600' },
  urgent: { label: 'Urgent', color: 'text-red-600 font-bold' },
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

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dapur Kerja Operasional</p>
          <h1 className="text-2xl font-bold text-gray-900">Projects & Tasks</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Kelola pembagian tugas operasional tim, monitor PIC, deadline, dan alur pengerjaan
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm transition-colors"
        >
          <Icons.Plus size={14} />
          Tambah Task
        </button>
      </div>

      {/* ─── Tasks Table & Operational Management ─── */}
      <div className="space-y-3">
        {/* Sub-tab + Status Counters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-gray-200 p-3 rounded-xl">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilterTab === 'all'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Semua ({tasks.length})
            </button>
            <button
              onClick={() => setActiveFilterTab('my_tasks')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilterTab === 'my_tasks'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Task Saya
            </button>
            <button
              onClick={() => setActiveFilterTab('created_by_me')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilterTab === 'created_by_me'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Dibuat Saya
            </button>
          </div>

          {/* Status counters */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">{counts.ongoing} Berjalan</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">{counts.review} Review</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-medium">{counts.revisi} Revisi</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">{counts.done} Selesai</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid sm:grid-cols-3 gap-2">
          <div className="relative">
            <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari task, brand, atau PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="all">Semua Servis</option>
            <option value="shop_opt">Shop Optimization</option>
            <option value="live_streaming">Live Streaming</option>
            <option value="content">Content Production</option>
            <option value="kol">KOL & Affiliate</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="all">Semua Status</option>
            <option value="belum_dimulai">Belum Dimulai</option>
            <option value="ongoing">Berjalan</option>
            <option value="review">Review</option>
            <option value="revisi">Revisi</option>
            <option value="done">Selesai</option>
          </select>
        </div>

        {/* Tasks Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-3">Pekerjaan & Brand</th>
                  <th className="px-4 py-3">Servis</th>
                  <th className="px-4 py-3">PIC</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Prioritas</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
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
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                        {/* Title & Brand */}
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900 leading-snug">{t.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{t.brand_name}</p>
                          {t.notes && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 italic">{t.notes}</p>
                          )}
                        </td>

                        {/* Service */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${srvConfig.color} ${srvConfig.border}`}>
                            {srvConfig.label}
                          </span>
                        </td>

                        {/* PIC */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700">
                              {t.pic_name.charAt(0)}
                            </div>
                            <span className="text-gray-700 text-sm">{t.pic_name}</span>
                          </div>
                        </td>

                        {/* Deadline */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className={`font-mono text-xs ${isUrgentDeadline ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                            {t.deadline}
                          </p>
                          <span className={`text-xs ${
                            t.status === 'done'
                              ? 'text-gray-400'
                              : daysLeft < 0
                              ? 'text-red-600 font-semibold'
                              : daysLeft <= 2
                              ? 'text-orange-600 font-semibold'
                              : 'text-gray-400'
                          }`}>
                            {t.status === 'done'
                              ? 'Selesai'
                              : daysLeft < 0
                              ? `Terlewat ${Math.abs(daysLeft)}h`
                              : daysLeft === 0
                              ? 'Hari ini'
                              : `${daysLeft} hari`}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs ${prioConfig.color}`}>{prioConfig.label}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <select
                            value={t.status}
                            onChange={(e) => handleUpdateStatus(t.id, e.target.value as TaskStatus)}
                            className={`text-xs font-medium px-2 py-1 rounded-lg border outline-none cursor-pointer transition-colors ${statConfig.bg} ${statConfig.color}`}
                          >
                            <option value="belum_dimulai">Belum Dimulai</option>
                            <option value="ongoing">Berjalan</option>
                            <option value="review">Review</option>
                            <option value="revisi">Revisi</option>
                            <option value="done">Selesai</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => setEditingTask(t)}
                            className="text-xs text-gray-400 hover:text-amber-600 transition-colors px-2 py-1 rounded hover:bg-amber-50"
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

      {/* ─── Modal Tambah Task ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Tambah Task Baru</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-700 p-1">✕</button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Pekerjaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Evaluasi Winning Ads Campaign"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Brand Klien *</label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    {brandsList.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Area / Servis *</label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value as ServiceType)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">PIC *</label>
                  <input
                    type="text"
                    disabled={!isManager}
                    value={isManager ? formPic : user.full_name}
                    onChange={(e) => setFormPic(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="Nama PIC"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Deadline *</label>
                  <input
                    type="date"
                    required
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Prioritas</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'normal', 'high', 'urgent'] as TaskPriority[]).map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setFormPriority(prio)}
                      className={`py-1.5 rounded-lg border text-xs text-center font-medium transition-all ${
                        formPriority === prio
                          ? 'border-amber-400 bg-amber-50 text-amber-700 font-semibold'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {PRIORITY_CONFIG[prio].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Catatan</label>
                <textarea
                  rows={2}
                  placeholder="Instruksi atau detail pekerjaan..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none transition-colors"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium border border-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-colors"
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
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Edit Task</h2>
              <button onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-gray-700 p-1">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Pekerjaan</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">PIC</label>
                  <input
                    type="text"
                    disabled={!isManager}
                    value={editingTask.pic_name}
                    onChange={(e) => setEditingTask({ ...editingTask, pic_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 disabled:bg-gray-50 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={editingTask.deadline}
                    onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Prioritas</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as TaskPriority })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="low">Rendah</option>
                    <option value="normal">Normal</option>
                    <option value="high">Tinggi</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Catatan</label>
                <textarea
                  rows={2}
                  value={editingTask.notes || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-amber-400 resize-none transition-colors"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium border border-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-colors"
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
