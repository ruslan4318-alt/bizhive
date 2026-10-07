'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  platform: string;
  is_active: boolean;
  created_at: string;
}

export default function BrandsManagementClient() {
  const supabase = createClient();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    logo_url: '',
    platform: 'shopee',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    setBrands(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const resetForm = () => {
    setForm({ name: '', logo_url: '', platform: 'shopee' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const startEdit = (brand: Brand) => {
    setForm({
      name: brand.name,
      logo_url: brand.logo_url || '',
      platform: brand.platform,
    });
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        // Update
        const { error: updateError } = await supabase
          .from('brands')
          .update({
            name: form.name,
            logo_url: form.logo_url || null,
            platform: form.platform,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (updateError) throw updateError;
        setSuccess(`Brand "${form.name}" berhasil diupdate!`);
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('brands')
          .insert({
            name: form.name,
            logo_url: form.logo_url || null,
            platform: form.platform,
          });

        if (insertError) throw insertError;
        setSuccess(`Brand "${form.name}" berhasil ditambahkan!`);
      }

      resetForm();
      fetchBrands();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan brand';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (brand: Brand) => {
    const { error: updateError } = await supabase
      .from('brands')
      .update({ is_active: !brand.is_active, updated_at: new Date().toISOString() })
      .eq('id', brand.id);

    if (updateError) {
      setError('Gagal mengubah status brand');
    } else {
      setSuccess(`Brand "${brand.name}" ${!brand.is_active ? 'diaktifkan' : 'dinonaktifkan'}!`);
      fetchBrands();
    }
  };

  const handleDelete = async (brand: Brand) => {
    setSaving(true);
    try {
      const { error: delError } = await supabase
        .from('brands')
        .delete()
        .eq('id', brand.id);

      if (delError) throw delError;
      setSuccess(`Brand "${brand.name}" berhasil dihapus!`);
      setDeleteConfirm(null);
      fetchBrands();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus brand. Pastikan tidak ada project yang terkait.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Kelola Brand</h1>
            <p className="text-slate-400 text-sm mt-1">Tambah dan kelola brand klien Anda</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
          >
            <span>+</span> Brand Baru
          </button>
        )}
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

      {/* Form */}
      {showForm && (
        <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">
            {editingId ? '✏️ Edit Brand' : '✨ Brand Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nama Brand *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: ButtonScarves Beauty"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
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
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Logo URL (opsional)</label>
              <input
                type="url"
                value={form.logo_url}
                onChange={e => setForm({ ...form, logo_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors text-sm border border-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-900 font-bold transition-colors text-sm"
              >
                {saving ? 'Menyimpan...' : editingId ? 'Update Brand' : 'Tambah Brand'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Brands List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg mb-2">Belum ada brand</p>
          <p className="text-slate-500 text-sm">Klik tombol &quot;Brand Baru&quot; untuk menambahkan</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <p className="text-slate-400 text-sm">{brands.length} brand terdaftar</p>
          </div>
          <div className="divide-y divide-slate-800/50">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-sm">
                    {brand.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${brand.is_active ? 'text-white' : 'text-slate-500 line-through'}`}>
                      {brand.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 capitalize">{brand.platform}</span>
                      {!brand.is_active && (
                        <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded">Nonaktif</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(brand)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      brand.is_active
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    }`}
                  >
                    {brand.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    onClick={() => startEdit(brand)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Edit
                  </button>
                  {deleteConfirm === brand.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(brand)}
                        disabled={saving}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-400 transition-colors"
                      >
                        Ya
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        Tidak
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(brand.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
