import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAdminProjectsApi,
  createAdminProjectApi,
  updateAdminProjectApi,
  deleteAdminProjectApi,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

interface ProjectData {
  id: number;
  title: string;
  slug: string;
  category: string;
  sector: string;
  location: string;
  year: number;
  client: string;
  description: string;
  cover_image: string;
  budget_range: string;
  duration: string;
  image_count?: number;
}

const initialFormState: Omit<ProjectData, 'id'> = {
  title: '',
  slug: '',
  category: 'Demiryolu',
  sector: 'İnşaat',
  location: '',
  year: new Date().getFullYear(),
  client: '',
  description: '',
  cover_image: '/media/hero-railway.webp',
  budget_range: '',
  duration: '',
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

export const AdminProjectsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<ProjectData, 'id'>>(initialFormState);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getAdminProjectsApi();
      setProjects(res);
    } catch (err: any) {
      alert(err.message || 'Projeler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectData) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      category: project.category,
      sector: project.sector,
      location: project.location,
      year: project.year,
      client: project.client,
      description: project.description,
      cover_image: project.cover_image,
      budget_range: project.budget_range,
      duration: project.duration,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`"${title}" projesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      try {
        await deleteAdminProjectApi(id);
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['project'] });
        fetchProjects();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingId ? prev.slug : slugify(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      if (editingId) {
        await updateAdminProjectApi(editingId, formData);
      } else {
        await createAdminProjectApi(formData);
      }
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
      setModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setFormError(err.message || 'Proje kaydedilirken bir hata oluştu.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Tümü' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO
        title="Projeler Yönetimi — Acar Grup"
        description="Acar Grup altyapı ve demiryolu inşaat projeleri yönetim paneli."
        path="/admin/projeler"
        noIndex
      />

      {/* Üst Başlık & Eylem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            İnşaat Projeleri Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Demiryolu, köprü, tünel, karayolu ve endüstriyel üstyapı kayıtları ({projects.length} Kayıt).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="rounded-[2px] bg-[var(--orange)] px-5 py-3 text-xs font-industrial font-bold uppercase tracking-wider text-white hover:bg-[var(--orange-hover)] transition-colors shadow-[0_0_16px_rgba(255,107,0,0.3)] cursor-pointer self-start sm:self-auto"
        >
          + Yeni Proje Ekle
        </button>
      </div>

      {/* Arama & Filtre Çubuğu */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6 bg-[var(--navy)]/60 p-4 rounded-[3px] border border-white/10">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Proje adı, lokasyon veya idare ara..."
          className="flex-1 rounded-[2px] border border-white/20 bg-[var(--navy-deep)] px-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:border-[var(--orange)] focus:outline-none"
        />

        <div className="flex items-center gap-2">
          {['Tümü', 'Demiryolu', 'Karayolu', 'Altyapı', 'Bina'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-[2px] px-3.5 py-2 text-xs font-industrial font-bold uppercase tracking-wider transition-colors ${
                categoryFilter === cat
                  ? 'bg-[var(--orange)] text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projeler Tablosu */}
      <div className="rounded-[3px] border border-white/12 bg-[var(--navy)]/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 font-industrial uppercase tracking-wider text-white/60 border-b border-white/10">
              <tr>
                <th className="p-4 pl-6">Proje Başlığı / Slug</th>
                <th className="p-4">Kategori / Sektör</th>
                <th className="p-4">Lokasyon</th>
                <th className="p-4">İşveren İdare</th>
                <th className="p-4">Yıl / Bütçe</th>
                <th className="p-4 pr-6 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    Projeler yükleniyor...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    Eşleşen proje bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6">
                      <span className="block font-semibold text-white text-sm">{p.title}</span>
                      <span className="block text-white/40 font-mono text-[11px] mt-0.5">/{p.slug}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 rounded-[2px] bg-white/10 text-white font-industrial font-bold uppercase text-[10px] tracking-wider">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-white/80">{p.location}</td>
                    <td className="p-4 text-white/80">{p.client}</td>
                    <td className="p-4">
                      <span className="block text-white font-medium">{p.year}</span>
                      <span className="block text-white/50 text-[11px]">{p.budget_range}</span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="rounded-[2px] border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-industrial font-semibold uppercase text-white hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors cursor-pointer"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.title)}
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

      {/* Proje Ekle / Düzenle Modalı */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[3px] border border-white/20 bg-[var(--navy-deep)] p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-industrial text-2xl font-bold uppercase tracking-tight text-white">
                {editingId ? 'Projeyi Düzenle' : 'Yeni İnşaat Projesi Ekle'}
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
                    Proje Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Slug (URL) *
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
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  >
                    <option value="Demiryolu">Demiryolu</option>
                    <option value="Karayolu">Karayolu</option>
                    <option value="Altyapı">Altyapı</option>
                    <option value="Bina">Bina / Üstyapı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Lokasyon / Şehir *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Örn: Sivas - Erzincan"
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Tamamlanma Yılı *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    İşveren Kurum / İdare *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="Örn: TCDD Genel Müdürlüğü"
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Yapım Süresi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Örn: 36 Ay"
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Sözleşme / Bütçe Hacmi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.budget_range}
                    onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                    placeholder="Örn: 4.8 Milyar ₺"
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Kapak Görseli URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy)] px-3.5 py-2.5 text-xs text-white focus:border-[var(--orange)] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-industrial uppercase tracking-wider text-white/80 mb-1">
                    Mühendislik Açıklaması *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default AdminProjectsPage;
