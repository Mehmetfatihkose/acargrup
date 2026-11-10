import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAdminCertificatesApi,
  createAdminCertificateApi,
  updateAdminCertificateApi,
  deleteAdminCertificateApi,
  type CertificateData,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

const initialFormState: Omit<CertificateData, 'id'> = {
  name: '',
  image: 'ISO-9001',
  description: '',
};

export const AdminCertificatesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<CertificateData, 'id'>>(initialFormState);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await getAdminCertificatesApi();
      setCertificates(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: CertificateData) => {
    setEditingId(c.id);
    setFormData({
      name: c.name,
      image: c.image,
      description: c.description,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`"${name}" belgesini silmek istediğinize emin misiniz?`)) {
      try {
        await deleteAdminCertificateApi(id);
        queryClient.invalidateQueries({ queryKey: ['certificates'] });
        fetchCertificates();
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
        await updateAdminCertificateApi(editingId, formData);
      } else {
        await createAdminCertificateApi(formData);
      }
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      setModalOpen(false);
      fetchCertificates();
    } catch (err: any) {
      setFormError(err.message || 'Sertifika kaydedilirken hata oluştu.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Sertifikalar & Yetki Belgeleri — Acar Grup"
        description="Acar Grup ISO kalite belgeleri ve müteahhitlik yetki sertifikaları yönetim konsolu."
        path="/admin/sertifikalar"
        noIndex
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            Sertifikalar &amp; Yetki Belgeleri
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            İnşaat ve plastik hammadde sayfalarında gösterilen kalite, çevre ve yetki belgeleri ({certificates.length} Belge).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--orange)] px-5 py-3 text-xs font-industrial font-bold tracking-[0.16em] uppercase text-white hover:bg-[var(--orange-hover)] transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)]"
        >
          <span>+ Yeni Sertifika / Belge Ekle</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--orange)]" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="rounded-[3px] border border-white/10 bg-[var(--navy-deep)] p-12 text-center text-white/50">
          Kayıtlı sertifika bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col justify-between rounded-[3px] border border-white/10 bg-[var(--navy-deep)]/90 p-6 transition-colors hover:border-white/25"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-[2px] border border-[var(--orange)]/30 bg-[var(--orange)]/15 px-3 py-1 text-xs font-industrial font-bold tracking-wider text-[var(--orange)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--orange)]" />
                    {cert.image}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cert)}
                      className="rounded-[2px] border border-white/20 px-3 py-1 text-xs font-industrial font-semibold uppercase text-white/80 hover:text-white"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cert.id, cert.name)}
                      className="rounded-[2px] border border-rose-500/30 px-3 py-1 text-xs font-industrial font-semibold uppercase text-rose-400 hover:border-rose-500 hover:bg-rose-500/10"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <h3 className="mt-4 font-serif-heritage text-xl font-semibold text-white">
                  {cert.name}
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {cert.description}
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
          <div className="w-full max-w-xl rounded-[3px] border border-white/20 bg-[var(--navy-deep)] p-6 sm:p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-industrial text-xl font-bold uppercase tracking-tight text-white">
                {editingId ? 'Sertifikayı Düzenle' : 'Yeni Sertifika Ekle'}
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
                  Sertifika / Belge Tam Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Örn: ISO 9001:2015 Kalite Yönetim Sistemi"
                  className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-industrial text-xs font-bold uppercase tracking-[0.16em] text-white/80 mb-1.5">
                  Rozet Kodu (Kısa Kod) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="Örn: ISO-9001 veya YETKI-A"
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
                  placeholder="Belgenin kapsamı ve yetki detayları..."
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

export default AdminCertificatesPage;

