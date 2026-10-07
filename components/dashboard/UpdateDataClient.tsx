'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ShopeeDailyForm from '@/components/dashboard/ShopeeDailyForm';
import ShopeeMonthlyForm from '@/components/dashboard/ShopeeMonthlyForm';
import TikTokForm from '@/components/dashboard/TikTokForm';

interface Project {
  id: string;
  name: string;
  platform: string;
  brand?: { name: string };
}

const TABS = [
  { key: 'shopee-daily', label: 'Shopee Daily', icon: '📊', platform: ['shopee', 'both'] },
  { key: 'shopee-monthly', label: 'Shopee Monthly', icon: '📅', platform: ['shopee', 'both'] },
  { key: 'tiktok', label: 'TikTok', icon: '🎵', platform: ['tiktok', 'both'] },
];

export default function UpdateDataClient() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(searchParams.get('project') || '');
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'shopee-daily');
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('id, name, platform, brand:brands(name)')
      .neq('status', 'done')
      .order('name');
    setProjects(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const currentProject = projects.find(p => p.id === selectedProject);
  const filteredTabs = TABS.filter(t => {
    if (!currentProject) return true;
    return t.platform.includes(currentProject.platform);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Update Data</h1>
        <p className="text-slate-400 text-sm mt-1">Input metrik harian dan bulanan</p>
      </div>

      {/* Project Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Pilih Project</label>
        {loading ? (
          <div className="h-12 bg-slate-800 rounded-xl animate-pulse" />
        ) : (
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
          >
            <option value="">-- Pilih Project --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.brand?.name ? `${p.brand.name} — ` : ''}{p.name} ({p.platform})
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedProject && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filteredTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'shopee-daily' && (
            <ShopeeDailyForm projectId={selectedProject} />
          )}
          {activeTab === 'shopee-monthly' && (
            <ShopeeMonthlyForm projectId={selectedProject} />
          )}
          {activeTab === 'tiktok' && (
            <TikTokForm projectId={selectedProject} />
          )}
        </>
      )}

      {!selectedProject && !loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <span className="text-4xl mb-4 block">📥</span>
          <p className="text-slate-400 text-lg mb-2">Pilih project terlebih dahulu</p>
          <p className="text-slate-500 text-sm">Pilih project di atas untuk mulai input data metrik</p>
        </div>
      )}
    </div>
  );
}
