import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAdminMilestonesApi,
  createAdminMilestoneApi,
  updateAdminMilestoneApi,
  deleteAdminMilestoneApi,
  type MilestoneData,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

const initialFormState: Omit<MilestoneData, 'id'> = {
  year: new Date().getFullYear(),
  title: '',
  description: '',
};

export const AdminMilestonesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [milestones, setMilestones] = useState<MilestoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<MilestoneData, 'id'>>(initialFormState);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const data = await getAdminMilestonesApi();
      setMilestones(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      year: new Date().getFullYear(),
      title: '',
      description: '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (m: MilestoneData) => {
    setEditingId(m.id);
    setFormData({
      year: m.year,
      title: m.title,
      description: m.description,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number, year: number) => {
    if (window.confirm(`${year} yılı dönüm noktasını silmek istediğinize emin misiniz?`)) {
      try {
        await deleteAdminMilestoneApi(id);
        queryClient.invalidateQueries({ queryKey: ['milestones'] });
        fetchMilestones();
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
        await updateAdminMilestoneApi(editingId, formData);
      } else {
        await createAdminMilestoneApi(formData);
      }
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      setModalOpen(false);
      fetchMilestones();
    } catch (err: any) {
      setFormError(err.message || 'Dönüm noktası kaydedilirken hata oluştu.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="50 Yıllık Yolculuk & Dönüm Noktaları — Acar Grup"
        description="Acar Grup 1974-2026 zaman çizelgesi ve kurumsal kilometre taşları yönetim konsolu."
        path="/admin/tarihce"
        noIndex
      />

      {/* Üst Başlık & Eylem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            50 Yıllık Yolculuk (Zaman Çizelgesi)
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Anasayfada ve Hakkımızda sayfasında ray metaforuyla akan kurumsal dönüm noktaları ({milestones.length} Kayıt).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--orange)] px-5 py-3 text-xs font-industrial font-bold tracking-[0.16em] uppercase text-white hover:bg-[var(--orange-hover)] transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)]"
        >
          <span>+ Yeni Dönüm Noktası Ekle</span>
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--orange)]" />
        </div>
      ) : milestones.length === 0 ? (
        <div className="rounded-[3px] border border-white/10 bg-[var(--navy-deep)] p-12 text-center text-white/50">
          Kayıtlı dönüm noktası bulunamadı.
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[3px] border border-white/10 bg-[var(--navy-deep)]/90 p-5 sm:p-6 transition-colors hover:border-white/25"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-[2px] bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-[var(--orange)] font-industrial text-xl font-bold">
                  {m.year}
                </div>
                <div>
                  <h3 className="font-serif-heritage text-xl font-semibold text-white">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/70 leading-relaxed max-w-2xl">
                    {m.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(m)}
                  className="rounded-[2px] border border-white/20 px-3.5 py-1.5 text-xs font-industrial font-semibold uppercase text-white/80 hover:border-white hover:text-white"
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id, m.year)}
                  className="rounded-[2px] border border-rose-500/30 px-3.5 py-1.5 text-xs font-industrial font-semibold uppercase text-rose-400 hover:border-rose-500 hover:bg-rose-500/10"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ekleme / Düzenleme Modalı */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div className="w-full max-w-xl rounded-[3px] border border-white/20 bg-[var(--navy-deep)] p-6 sm:p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-industrial text-xl font-bold uppercase tracking-tight text-white">
                {editingId ? 'Dönüm Noktasını Düzenle' : 'Yeni Dönüm Noktası Ekle'}
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
                  Yıl (1900 - 2100) *
                </label>
                <input
                  type="number"
                  required
                  min={1900}
                  max={2100}
                  value={formData.year}
                  onChange={(e) => setFormData((prev) => ({ ...prev, year: Number(e.target.value) }))}
                  className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-industrial text-xs font-bold uppercase tracking-[0.16em] text-white/80 mb-1.5">
                  Başlık *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Örn: Demiryolu Mühendisliğine Giriş"
                  className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-industrial text-xs font-bold uppercase tracking-[0.16em] text-white/80 mb-1.5">
                  Açıklama *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Dönüm noktasına ait kurumsal gelişme metni..."
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

export default AdminMilestonesPage;

