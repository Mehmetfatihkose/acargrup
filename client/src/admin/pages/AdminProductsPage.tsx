import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAdminProductsApi,
  createAdminProductApi,
  updateAdminProductApi,
  deleteAdminProductApi,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

interface ProductData {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  specs_json: string;
  packaging: string;
  image: string;
}

const initialFormState: Omit<ProductData, 'id'> = {
  name: '',
  slug: '',
  category: 'Polietilen (PE)',
  description: '',
  specs_json: JSON.stringify(
    {
      mfi: '0.3 - 20 g/10min',
      density: '0.918 - 0.965 g/cm³',
      applications: ['Film Ekstrüzyon', 'Şişirme', 'Enjeksiyon'],
    },
    null,
    2
  ),
  packaging: '25 kg FFS Torba (Paletli 1375 kg) / Silobas',
  image: '/media/plastic-granules.webp',
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export const AdminProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<ProductData, 'id'>>(initialFormState);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminProductsApi();
      setProducts(res);
    } catch (err: any) {
      alert(err.message || 'Ürünler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (prod: ProductData) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      description: prod.description,
      specs_json: prod.specs_json,
      packaging: prod.packaging,
      image: prod.image,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`"${name}" ürün grubunu silmek istediğinize emin misiniz?`)) {
      try {
        await deleteAdminProductApi(id);
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product'] });
        fetchProducts();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      // JSON kontrolü
      JSON.parse(formData.specs_json);
    } catch {
      setFormError('Teknik özellikler geçerli bir JSON formatında olmalıdır.');
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingId) {
        await updateAdminProductApi(editingId, formData);
      } else {
        await createAdminProductApi(formData);
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'Ürün kaydedilirken hata oluştu.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Plastik Hammadde Yönetimi — Acar Grup"
        description="Polietilen, Polipropilen, PVC, PET ve ABS hammadde ürün kataloğu yönetim konsolu."
        path="/admin/urunler"
        noIndex
      />

      {/* Üst Başlık & Eylem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            Plastik Hammadde Ürün Grupları
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            PE, PP, PVC, PET ve ABS granül portföyü ve teknik spesifikasyonları ({products.length} Ürün).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="rounded-[2px] bg-[var(--orange)] px-5 py-3 text-xs font-industrial font-bold uppercase tracking-wider text-white hover:bg-[var(--orange-hover)] transition-colors shadow-[0_0_16px_rgba(255,107,0,0.3)] cursor-pointer self-start sm:self-auto"
        >
          + Yeni Polimer Grubu Ekle
        </button>
      </div>

      {/* Ürünler Listesi / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-white/50">
            Ürün grupları yükleniyor...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full p-12 text-center text-white/50">
            Kayıtlı ürün grubu bulunamadı.
          </div>
        ) : (
          products.map((p) => {
            let parsedSpecs: any = {};
            try {
              parsedSpecs = JSON.parse(p.specs_json);
            } catch {
              parsedSpecs = {};
            }

            return (
              <div
                key={p.id}
                className="rounded-[3px] border border-white/12 bg-[var(--navy)]/60 p-6 flex flex-col justify-between hover:border-[var(--orange)]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-industrial text-xs font-bold tracking-wider uppercase text-[var(--orange)]">
                      {p.category}
                    </span>
                    <span className="text-[11px] font-mono text-white/40">/{p.slug}</span>
                  </div>

                  <h3 className="font-industrial text-2xl font-bold uppercase tracking-tight text-white mb-2">
                    {p.name}
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="space-y-1.5 border-t border-white/10 pt-3 text-[11px] text-white/60 mb-6">
                    <div>
                      <strong className="text-white">Ambalaj:</strong> {p.packaging}
                    </div>
                    {parsedSpecs.mfi && (
                      <div>
                        <strong className="text-white">MFI Aralığı:</strong> {parsedSpecs.mfi}
                      </div>
                    )}
                    {parsedSpecs.density && (
                      <div>
                        <strong className="text-white">Yoğunluk:</strong> {parsedSpecs.density}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(p)}
                    className="rounded-[2px] border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-industrial font-semibold uppercase text-white hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.name)}
                    className="rounded-[2px] border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-xs font-industrial font-semibold uppercase text-red-300 hover:bg-red-900/40 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[3px] border border-white/20 bg-[var(--navy-deep)] p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-industrial text-2xl font-bold uppercase tracking-tight text-white">
                {editingId ? 'Polimer Grubunu Düzenle' : 'Yeni Polimer Grubu Ekle'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-6 rounded-[2px] border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Ürün / Granül Grubu Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name: val,
                        slug: editingId ? prev.slug : slugify(val),
                      }));
                    }}
                    placeholder="Örn: Yüksek Yoğunluklu Polietilen (HDPE)"
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Kategori *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Örn: Polietilen (PE)"
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Ambalaj / Sevkiyat Tipleri *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.packaging}
                    onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Açıklama *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Teknik Özellikler (JSON formatı) *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.specs_json}
                    onChange={(e) => setFormData({ ...formData, specs_json: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 font-mono text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-[2px] border border-white/20 px-5 py-2.5 text-xs font-industrial uppercase text-white/70 hover:text-white"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="rounded-[2px] bg-[var(--orange)] px-6 py-2.5 text-xs font-industrial font-bold uppercase text-white hover:bg-[var(--orange-hover)] disabled:opacity-50"
                >
                  {formSubmitting ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
