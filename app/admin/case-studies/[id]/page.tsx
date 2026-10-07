'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
}

export default function EditCaseStudyPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [beforeImageUrl, setBeforeImageUrl] = useState('');
  const [afterImageUrl, setAfterImageUrl] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
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

      // Fetch clients for dropdown
      const { data: clientsData } = await supabase.from('clients').select('id, name').order('name');
      if (clientsData) setClients(clientsData);

      if (id) {
        const { data, error } = await supabase
          .from('case_studies')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          alert('Case study not found');
          router.push('/admin/dashboard');
          return;
        }

        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          client_id: data.client_id || '',
          description: data.description || '',
          before_value: data.before_value || '',
          after_value: data.after_value || '',
          growth_percentage: data.growth_percentage || '',
          metric_type: data.metric_type || '',
          timeline: data.timeline || '',
          is_featured: data.is_featured || false,
        });
        setBeforeImageUrl(data.before_image || '');
        setAfterImageUrl(data.after_image || '');
        setFeaturedImageUrl(data.featured_image || '');
      }
      setFetching(false);
    }
    init();
  }, [id]);

  async function uploadImage(file: File, prefix: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `case-studies/${prefix}_${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async function handleBeforeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBefore(true);
    try {
      const url = await uploadImage(file, 'before');
      if (url) setBeforeImageUrl(url);
    } catch {
      alert('Error uploading Before image');
    } finally {
      setUploadingBefore(false);
    }
  }

  async function handleAfterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAfter(true);
    try {
      const url = await uploadImage(file, 'after');
      if (url) setAfterImageUrl(url);
    } catch {
      alert('Error uploading After image');
    } finally {
      setUploadingAfter(false);
    }
  }

  async function handleFeaturedUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    try {
      const url = await uploadImage(file, 'featured');
      if (url) setFeaturedImageUrl(url);
    } catch {
      alert('Error uploading Featured image');
    } finally {
      setUploadingFeatured(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('case_studies')
        .update({
          title: formData.title,
          slug: formData.slug,
          client_id: formData.client_id || null,
          description: formData.description,
          before_value: formData.before_value,
          after_value: formData.after_value,
          growth_percentage: formData.growth_percentage,
          metric_type: formData.metric_type,
          timeline: formData.timeline,
          before_image: beforeImageUrl || null,
          after_image: afterImageUrl || null,
          featured_image: featuredImageUrl || null,
          is_featured: formData.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/dashboard');
    } catch (error) {
      alert('Error updating case study');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-slate-600">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit Case Study</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
              placeholder="e.g. How we scaled Brand X to 2B+ monthly revenue"
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
              placeholder="brand-x-case-study"
            />
          </div>

          {/* Client Selection */}
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

          {/* 2 Spaces for Before & After Image Upload */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <span>🖼️</span> Before &amp; After Images
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Before Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Before Image</label>
                <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                  {beforeImageUrl ? (
                    <img src={beforeImageUrl} alt="Before Preview" className="w-full h-36 object-contain rounded-lg border border-slate-100" />
                  ) : (
                    <div className="w-full h-36 bg-slate-50 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                      <span className="text-2xl">📸</span>
                      <span>No Before image</span>
                    </div>
                  )}
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium text-xs transition-colors">
                    {uploadingBefore ? 'Uploading...' : beforeImageUrl ? 'Change Before Image' : 'Upload Before Image'}
                    <input type="file" accept="image/*" onChange={handleBeforeUpload} className="hidden" disabled={uploadingBefore} />
                  </label>
                </div>
              </div>

              {/* After Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">After Image</label>
                <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                  {afterImageUrl ? (
                    <img src={afterImageUrl} alt="After Preview" className="w-full h-36 object-contain rounded-lg border border-slate-100" />
                  ) : (
                    <div className="w-full h-36 bg-slate-50 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                      <span className="text-2xl">🚀</span>
                      <span>No After image</span>
                    </div>
                  )}
                  <label className="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-medium text-xs transition-colors">
                    {uploadingAfter ? 'Uploading...' : afterImageUrl ? 'Change After Image' : 'Upload After Image'}
                    <input type="file" accept="image/*" onChange={handleAfterUpload} className="hidden" disabled={uploadingAfter} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Featured Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cover / Banner Image (Optional)</label>
            <div className="flex items-start gap-4">
              {featuredImageUrl ? (
                <img src={featuredImageUrl} alt="Cover Preview" className="w-40 h-24 object-cover rounded-xl border border-slate-200" />
              ) : (
                <div className="w-40 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium text-sm transition-colors">
                {uploadingFeatured ? 'Uploading...' : 'Change Cover'}
                <input type="file" accept="image/*" onChange={handleFeaturedUpload} className="hidden" disabled={uploadingFeatured} />
              </label>
            </div>
          </div>

          {/* Metric Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Metric Type</label>
            <input
              type="text"
              value={formData.metric_type}
              onChange={(e) => setFormData({ ...formData, metric_type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
              placeholder="e.g. Monthly GMV, Total Orders, Ad Conversion Rate"
            />
          </div>

          {/* Before / After / Growth */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Before Value</label>
              <input
                type="text"
                value={formData.before_value}
                onChange={(e) => setFormData({ ...formData, before_value: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
                placeholder="Rp 150M"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">After Value</label>
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
              placeholder="e.g. 3 Months"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 min-h-[120px]"
              placeholder="Detailed story of the transformation and results achieved..."
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
              Featured (show on homepage / highlight)
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-900 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              {loading ? 'Updating...' : 'Update Case Study'}
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
