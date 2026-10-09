'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface GalleryItem {
  url: string;
  title: string;
}

export default function NewServicePage() {
  const [loading, setLoading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
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
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/admin');
    }
    checkAuth();
  }, []);

  useEffect(() => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  }, [formData.name]);

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const newItems: GalleryItem[] = [];
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

        if (publicUrl) {
          const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          newItems.push({
            url: publicUrl,
            title: rawName,
          });
        }
      }

      setGalleryItems(prev => [...prev, ...newItems]);
    } catch (err: any) {
      alert(`Error uploading gallery image: ${err?.message || err}`);
      console.error(err);
    } finally {
      setUploadingGallery(false);
    }
  }

  function handleUpdatePhotoTitle(index: number, newTitle: string) {
    setGalleryItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], title: newTitle };
      return updated;
    });
  }

  function handleRemoveGalleryImage(indexToRemove: number) {
    setGalleryItems(prev => prev.filter((_, i) => i !== indexToRemove));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const featuresArray = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f);

      const { error } = await supabase.from('services').insert({
        name: formData.name,
        slug: formData.slug,
        category: formData.category || null,
        tagline: formData.tagline || null,
        short_description: formData.short_description,
        full_description: formData.full_description,
        icon: formData.icon,
        is_active: formData.is_active,
        features: featuresArray,
        gallery: galleryItems,
      });

      if (error) throw error;

      router.push('/admin/dashboard');
    } catch (error: any) {
      alert(`Error saving service: ${error?.message || error}`);
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

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-slate-600">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Add New Service</h1>
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

          {/* Work Showcase / Photo Gallery Upload Section with Individual Titles */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <span>📸</span> Work &amp; Portfolio Gallery
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload foto dan beri judul masing-masing untuk menjelaskan kegiatan/proyek
                </p>
              </div>
              <label className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 self-start sm:self-auto">
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

            {galleryItems.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-white text-center">
                <span className="text-3xl block mb-2">🖼️</span>
                <p className="text-sm font-medium text-slate-600">Belum ada foto portofolio</p>
                <p className="text-xs text-slate-400 mt-1">Klik tombol &quot;+ Tambah Foto&quot; di atas untuk mengunggah foto</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {galleryItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex gap-4 items-start relative group hover:border-amber-300 transition-colors"
                  >
                    <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-900 border border-slate-100 relative">
                      <img src={item.url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 text-[9px] text-white/90 bg-black/60 px-1 rounded font-mono">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        Judul / Kegiatan Foto #{idx + 1}
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdatePhotoTitle(idx, e.target.value)}
                        placeholder="Contoh: Sesi Live Streaming Brand X"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none text-slate-900 bg-slate-50 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="w-7 h-7 flex-shrink-0 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-400 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
                      title="Hapus foto ini"
                    >
                      ✕
                    </button>
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
              {loading ? 'Saving...' : 'Save Service'}
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
