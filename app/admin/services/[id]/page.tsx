'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function EditServicePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    tagline: '',
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

        const rawGallery: string[] = Array.isArray(data.gallery)
          ? data.gallery
          : typeof data.gallery === 'string'
          ? JSON.parse(data.gallery || '[]')
          : [];

        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          category: data.category || '',
          tagline: data.tagline || '',
          short_description: data.short_description || '',
          full_description: data.full_description || '',
          icon: data.icon || 'store',
          is_active: data.is_active !== undefined ? data.is_active : true,
          features: rawFeatures,
        });
        setGalleryUrls(rawGallery);
      }
      setFetching(false);
    }
    init();
  }, [id]);

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `services/gallery_${Date.now()}_${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        if (publicUrl) uploadedUrls.push(publicUrl);
      }

      setGalleryUrls(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      alert('Error uploading gallery image');
      console.error(err);
    } finally {
      setUploadingGallery(false);
    }
  }

  function handleRemoveGalleryImage(indexToRemove: number) {
    setGalleryUrls(prev => prev.filter((_, i) => i !== indexToRemove));
  }

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
          category: formData.category || null,
          tagline: formData.tagline || null,
          short_description: formData.short_description,
          full_description: formData.full_description,
          icon: formData.icon,
          is_active: formData.is_active,
          features: featuresArray,
          gallery: galleryUrls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/dashboard');
    } catch (error: any) {
      alert(`Error updating service: ${error?.message || error}`);
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-slate-600">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit Service &amp; Gallery</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
          {/* Name & Slug */}
          <div className="grid md:grid-cols-2 gap-4">
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
          </div>

          {/* Category & Icon */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category Badge</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
                placeholder="e.g. Performance, Creative, Influencer, Commerce"
              />
            </div>
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
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tagline (Header Slogan)</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900"
              placeholder="e.g. Maximize your e-commerce store performance with data-driven strategies"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Short Description (Cards)</label>
            <textarea
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 min-h-[80px]"
              placeholder="Brief description shown on service cards..."
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Description (What We Offer)</label>
            <textarea
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 min-h-[140px]"
              placeholder="Detailed description on the service detail page..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Key Features (one per line)</label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 min-h-[120px] font-mono text-sm"
              placeholder="Website Analysis & Audit&#10;Ads Optimization&#10;Campaign Marketing"
            />
          </div>

          {/* Work Showcase / Photo Gallery Upload Section */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <span>📸</span> Work &amp; Portfolio Gallery
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Upload foto hasil kerja / portofolio untuk ditampilkan di halaman service ini</p>
              </div>
              <label className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm inline-flex items-center gap-1.5">
                <span>+</span> {uploadingGallery ? 'Uploading...' : 'Tambah Foto'}
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleGalleryUpload} 
                  className="hidden" 
                  disabled={uploadingGallery} 
                />
              </label>
            </div>

            {galleryUrls.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-white text-center">
                <span className="text-3xl block mb-2">🖼️</span>
                <p className="text-sm font-medium text-slate-600">Belum ada foto portofolio</p>
                <p className="text-xs text-slate-400 mt-1">Klik tombol &quot;+ Tambah Foto&quot; di atas untuk mengunggah foto</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {galleryUrls.map((url, idx) => (
                  <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                      title="Hapus foto ini"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1.5 left-2 text-[10px] text-white/80 bg-black/50 px-1.5 py-0.5 rounded font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
              {loading ? 'Updating...' : 'Update Service & Gallery'}
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
