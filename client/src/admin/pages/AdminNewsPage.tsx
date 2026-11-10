import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAdminNewsApi,
  createAdminNewsApi,
  updateAdminNewsApi,
  deleteAdminNewsApi,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

interface NewsData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  published_at: string;
}

const initialFormState: Omit<NewsData, 'id'> = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  image: '/media/industrial-building.webp',
  published_at: new Date().toISOString().split('T')[0],
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

export const AdminNewsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [news, setNews] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<NewsData, 'id'>>(initialFormState);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await getAdminNewsApi();
      setNews(res);
    } catch (err: any) {
      alert(err.message || 'Haberler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: NewsData) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      content: item.content,
      image: item.image,
      published_at: item.published_at,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`"${title}" haberini silmek istediğinize emin misiniz?`)) {
      try {
        await deleteAdminNewsApi(id);
        queryClient.invalidateQueries({ queryKey: ['news'] });
        fetchNews();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      if (editingId) {
        await updateAdminNewsApi(editingId, formData);
      } else {
        await createAdminNewsApi(formData);
      }
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setModalOpen(false);
      fetchNews();
    } catch (err: any) {
      setFormError(err.message || 'Haber kaydedilirken hata oluştu.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Haberler & Duyurular — Acar Grup"
        description="Acar Grup kurumsal haber ve basın bülteni yönetim konsolu."
        path="/admin/haberler"
        noIndex
      />

      {/* Üst Başlık & Eylem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            Haberler ve Duyurular Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Kurumsal basın bültenleri, şantiye teslimleri ve stratejik gelişmeler ({news.length} Haber).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="rounded-[2px] bg-[var(--orange)] px-5 py-3 text-xs font-industrial font-bold uppercase tracking-wider text-white hover:bg-[var(--orange-hover)] transition-colors shadow-[0_0_16px_rgba(255,107,0,0.3)] cursor-pointer self-start sm:self-auto"
        >
          + Yeni Duyuru Ekle
        </button>
      </div>

      {/* Haberler Listesi */}
      <div className="rounded-[3px] border border-white/12 bg-[var(--navy)]/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 font-industrial uppercase tracking-wider text-white/60 border-b border-white/10">
              <tr>
                <th className="p-4 pl-6">Yayın Tarihi</th>
                <th className="p-4">Haber Başlığı / Slug</th>
                <th className="p-4">Özet</th>
                <th className="p-4 pr-6 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-white/50">
                    Haberler yükleniyor...
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-white/50">
                    Kayıtlı haber bulunamadı.
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6 font-mono text-white/60 text-[11px] whitespace-nowrap">
                      {item.published_at}
                    </td>
                    <td className="p-4">
                      <span className="block font-semibold text-white text-sm">{item.title}</span>
                      <span className="block text-white/40 font-mono text-[11px] mt-0.5">/{item.slug}</span>
                    </td>
                    <td className="p-4 text-white/70 max-w-md line-clamp-2">{item.summary}</td>
                    <td className="p-4 pr-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-[2px] border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-industrial font-semibold uppercase text-white hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors cursor-pointer"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="rounded-[2px] border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-xs font-industrial font-semibold uppercase text-red-300 hover:bg-red-900/40 transition-colors cursor-pointer"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[3px] border border-white/20 bg-[var(--navy-deep)] p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-industrial text-2xl font-bold uppercase tracking-tight text-white">
                {editingId ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Ekle'}
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
                    Haber Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        title: val,
                        slug: editingId ? prev.slug : slugify(val),
                      }));
                    }}
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
                    Yayın Tarihi *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Görsel URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Haber Özeti (Kısa Açıklama) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Haber Detay İçeriği *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
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

export default AdminNewsPage;
