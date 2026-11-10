import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAdminStatsApi,
  createAdminStatApi,
  updateAdminStatApi,
  deleteAdminStatApi,
  type StatData,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

const initialFormState: Omit<StatData, 'id'> = {
  label: '',
  value: 0,
  suffix: '+',
  sort_order: 0,
};

export const AdminStatsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<StatData, 'id'>>(initialFormState);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStatsApi();
      setStats(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      label: '',
      value: 100,
      suffix: '+',
      sort_order: stats.length + 1,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (s: StatData) => {
    setEditingId(s.id);
    setFormData({
      label: s.label,
      value: s.value,
      suffix: s.suffix,
      sort_order: s.sort_order,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number, label: string) => {
    if (window.confirm(`"${label}" sayacını silmek istediğinize emin misiniz?`)) {
      try {
        await deleteAdminStatApi(id);
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        fetchStats();
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
        await updateAdminStatApi(editingId, formData);
      } else {
        await createAdminStatApi(formData);
      }
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setModalOpen(false);
      fetchStats();
    } catch (err: any) {
      setFormError(err.message || 'Sayaç kaydedilirken hata oluştu.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Rakamlarla Acar Grup Sayaçları — Acar Grup"
        description="Anasayfa ve kurumsal sayfalardaki animasyonlu sayaçlar yönetim konsolu."
        path="/admin/istatistikler"
        noIndex
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            Rakamlarla Acar Grup (Sayaçlar)
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Anasayfada ve Hakkımızda sayfasında 0&apos;dan hedefe animasyonla sayan kurumsal metrikler ({stats.length} Sayaç).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--orange)] px-5 py-3 text-xs font-industrial font-bold tracking-[0.16em] uppercase text-white hover:bg-[var(--orange-hover)] transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)]"
        >
          <span>+ Yeni Sayaç Ekle</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--orange)]" />
        </div>
      ) : stats.length === 0 ? (
        <div className="rounded-[3px] border border-white/10 bg-[var(--navy-deep)] p-12 text-center text-white/50">
          Kayıtlı sayaç bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col justify-between rounded-[3px] border border-white/10 bg-[var(--navy-deep)]/90 p-6 transition-colors hover:border-white/25"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-white/40 font-mono mb-2">
                  <span>Sıra: #{stat.sort_order}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(stat)}
                      className="text-white/70 hover:text-white uppercase font-industrial text-[11px]"
                    >
                      Düzenle
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(stat.id, stat.label)}
                      className="text-rose-400 hover:text-rose-300 uppercase font-industrial text-[11px]"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="font-industrial text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  {stat.value.toLocaleString('tr-TR')}
                  <span className="text-[var(--orange)] ml-1">{stat.suffix}</span>
                </div>

                <p className="mt-3 text-sm font-medium text-white/80 leading-snug">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div className="w-full max-w-lg rounded-[3px] border border-white/20 bg-[var(--navy-deep)] p-6 sm:p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-industrial text-xl font-bold uppercase tracking-tight text-white">
                {editingId ? 'Sayacı Düzenle' : 'Yeni Sayaç Ekle'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-[2px] border border-rose-500/40 bg-rose-950/40 px-4 py-2.5 text-xs text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-industrial text-xs font-bold uppercase tracking-[0.16em] text-white/80 mb-1.5">
                  Sayaç Etiketi (Açıklama) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="Örn: Km Tamamlanan Demiryolu & Hat"
                  className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-industrial text-xs font-bold uppercase tracking-[0.16em] text-white/80 mb-1.5">
                    Hedef Sayısal Değer *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData((prev) => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-industrial text-xs font-bold uppercase tracking-[0.16em] text-white/80 mb-1.5">
                    Değer Eki (Örn: +, Ton, %)
                  </label>
                  <input
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => setFormData((prev) => ({ ...prev, suffix: e.target.value }))}
                    placeholder="Örn: +"
                    className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-industrial text-xs font-bold uppercase tracking-[0.16em] text-white/80 mb-1.5">
                  Sıralama Önceliği
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: Number(e.target.value) }))}
                  className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-[2px] border border-white/20 px-5 py-2.5 text-xs font-industrial font-semibold uppercase text-white/70 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="rounded-[2px] bg-[var(--orange)] px-6 py-2.5 text-xs font-industrial font-bold uppercase text-white hover:bg-[var(--orange-hover)] disabled:opacity-50"
                >
                  {formSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminStatsPage;

