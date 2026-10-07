'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function EditServicePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    icon: 'store',
    is_active: true,
    features: '',
  });
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin');
        return;
      }

      if (id) {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          alert('Service not found');
          router.push('/admin/dashboard');
          return;
        }

        const rawFeatures = Array.isArray(data.features)
          ? data.features.join('\n')
          : typeof data.features === 'string'
          ? (JSON.parse(data.features || '[]') as string[]).join('\n')
          : '';

        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          short_description: data.short_description || '',
          full_description: data.full_description || '',
          icon: data.icon || 'store',
          is_active: data.is_active !== undefined ? data.is_active : true,
          features: rawFeatures,
        });
      }
      setFetching(false);
    }
    init();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const featuresArray = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f);

      const { error } = await supabase
        .from('services')
        .update({
          name: formData.name,
          slug: formData.slug,
          short_description: formData.short_description,
          full_description: formData.full_description,
          icon: formData.icon,
          is_active: formData.is_active,
          features: featuresArray,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/dashboard');
    } catch (error) {
      alert('Error updating service');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const iconOptions = [
    { value: 'store', label: 'Store (Optimization)' },
    { value: 'video', label: 'Video (Content)' },
    { value: 'live', label: 'Play (Live Streaming)' },
    { value: 'users', label: 'Users (Affiliate/KOL)' },
    { value: 'chart', label: 'Chart (Analytics)' },
    { value: 'target', label: 'Target (Ads)' },
  ];

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-slate-600">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit Service</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Service Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
              placeholder="e.g. Shop Optimization"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Slug (URL)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-500"
              placeholder="shop-optimization"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
            >
              {iconOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label>
            <textarea
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 min-h-[80px]"
              placeholder="Brief description shown in cards..."
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Description</label>
            <textarea
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 min-h-[150px]"
              placeholder="Detailed description for the service page..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Features (one per line)</label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 min-h-[120px] font-mono text-sm"
              placeholder="Feature 1
Feature 2
Feature 3"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
              Active (visible on website)
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-900 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              {loading ? 'Updating...' : 'Update Service'}
            </button>
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
