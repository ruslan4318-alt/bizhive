'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
}

export default function NewCaseStudyPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client_id: '',
    description: '',
    before_value: '',
    after_value: '',
    growth_percentage: '',
    metric_type: '',
    timeline: '',
    is_featured: false,
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/admin');
      
      // Fetch clients for dropdown
      const { data } = await supabase.from('clients').select('id, name').order('name');
      if (data) setClients(data);
    }
    init();
  }, []);

  useEffect(() => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  }, [formData.title]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `case-studies/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setImageUrl(publicUrl);
    } catch (error) {
      alert('Error uploading image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('case_studies').insert({
        title: formData.title,
        slug: formData.slug,
        client_id: formData.client_id || null,
        description: formData.description,
        before_value: formData.before_value,
        after_value: formData.after_value,
        growth_percentage: formData.growth_percentage,
        metric_type: formData.metric_type,
        timeline: formData.timeline,
        featured_image: imageUrl || null,
        is_featured: formData.is_featured,
      });

      if (error) throw error;

      router.push('/admin/dashboard');
    } catch (error) {
      alert('Error saving case study');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-slate-600">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Add Case Study</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Featured Image</label>
            <div className="flex items-start gap-4">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-40 h-24 object-cover rounded-xl border border-slate-200" />
              ) : (
                <div className="w-40 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium text-sm transition-colors">
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
              placeholder="e.g. How we scaled Brand X to 2B+ monthly"
              required
            />
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Related Client</label>
            <select
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
            >
              <option value="">Select client (optional)</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Metric Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Metric Type</label>
            <input
              type="text"
              value={formData.metric_type}
              onChange={(e) => setFormData({ ...formData, metric_type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
              placeholder="e.g. Monthly Revenue, Orders/Day, Live Stream Sales"
            />
          </div>

          {/* Before / After / Growth */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Before</label>
              <input
                type="text"
                value={formData.before_value}
                onChange={(e) => setFormData({ ...formData, before_value: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
                placeholder="Rp 150M"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">After</label>
              <input
                type="text"
                value={formData.after_value}
                onChange={(e) => setFormData({ ...formData, after_value: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
                placeholder="Rp 2.1B"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Growth %</label>
              <input
                type="text"
                value={formData.growth_percentage}
                onChange={(e) => setFormData({ ...formData, growth_percentage: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
                placeholder="+1,300%"
              />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Timeline</label>
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
              placeholder="e.g. 6 months"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 min-h-[120px]"
              placeholder="Detailed story of this success case..."
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-slate-700">
              Featured (show on homepage)
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-900 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              {loading ? 'Saving...' : 'Save Case Study'}
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
