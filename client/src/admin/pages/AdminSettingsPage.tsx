import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAdminSettingsApi,
  updateAdminSettingsApi,
  uploadAdminMediaApi,
  getSettingHistoryApi,
  restoreSettingApi,
  type SettingItem,
  type SettingHistoryItem,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

const groups = [
  { id: 'hero', label: 'Anasayfa & Hero', icon: '🏠' },
  { id: 'sectors', label: 'Faaliyet Alanları Vitrini', icon: '🏗️' },
  { id: 'construction', label: 'İnşaat Sayfası & Hizmetler', icon: '🚆' },
  { id: 'plastic', label: 'Plastik & Tedarik Süreci', icon: '🧪' },
  { id: 'chairman', label: 'Başkan Mesajı', icon: '👤' },
  { id: 'values', label: 'Vizyon & Değerler', icon: '🎯' },
  { id: 'contact', label: 'İletişim & Lokasyonlar', icon: '📍' },
  { id: 'footer', label: 'Footer & Sosyal Ağlar', icon: '🔗' },
  { id: 'legal', label: 'Yasal Metinler (KVKK / Gizlilik)', icon: '📜' },
  { id: 'cta', label: 'İletişime Çağrı (CTA)', icon: '🚀' },
] as const;

export const AdminSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeGroup, setActiveGroup] = useState<string>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [historyKey, setHistoryKey] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<SettingHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getAdminSettingsApi();
      setSettings(data);
      const initialMap: Record<string, string> = {};
      for (const item of data) {
        initialMap[item.key] = item.value;
      }
      setFormData(initialMap);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ayarlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setSuccessMessage(null);
  };

  const changedItems = settings.filter((s) => (formData[s.key] ?? s.value) !== s.value);

  /** Kaydet'e basınca önce değişiklik özeti (önizleme) gösterilir. */
  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    if (changedItems.length === 0) {
      setErrorMessage('Kaydedilecek bir değişiklik yok.');
      return;
    }
    setReviewOpen(true);
  };

  const confirmSave = async () => {
    setSaving(true);
    try {
      await updateAdminSettingsApi(formData);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setReviewOpen(false);
      await fetchSettings();
      setSuccessMessage('Değişiklikler kaydedildi ve sitede yayınlandı.');
      window.setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setReviewOpen(false);
      setErrorMessage(err.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key: string, file: File | undefined) => {
    if (!file) return;
    setErrorMessage(null);
    setUploadingKey(key);
    try {
      const result = await uploadAdminMediaApi(file);
      handleChange(key, result.url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Fotoğraf yüklenemedi.');
    } finally {
      setUploadingKey(null);
    }
  };

  const openHistory = async (key: string) => {
    setHistoryKey(key);
    setHistoryItems([]);
    setHistoryLoading(true);
    try {
      setHistoryItems(await getSettingHistoryApi(key));
    } catch (err: any) {
      setErrorMessage(err.message || 'Geçmiş yüklenemedi.');
      setHistoryKey(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const restoreVersion = async (id: number) => {
    try {
      await restoreSettingApi(id);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setHistoryKey(null);
      await fetchSettings();
      setSuccessMessage('Önceki sürüme dönüldü ve site güncellendi.');
      window.setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Geri alma başarısız.');
    }
  };

  const isImageValue = (v: string) => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(v) || v.startsWith('/media/');

  const filteredSettings = settings.filter((s) => s.group_name === activeGroup);

  return (
    <>
      <SEO
        title="Sayfa İçerikleri & Metinler — Acar Grup"
        description="Acar Grup web sitesi dinamik metinleri, başlıkları ve kurumsal iletişim bilgileri yönetim konsolu."
        path="/admin/icerikler"
        noIndex
      />

      {/* Üst Başlık & Kaydet Butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            Sayfa İçerikleri &amp; Metin Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Anasayfa hero, Yönetim Kurulu Başkanı mesajı, vizyon/misyon ve kurumsal iletişim metinlerini canlı yönetin.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--orange)] px-6 py-3.5 text-xs font-industrial font-bold tracking-[0.16em] uppercase text-white hover:bg-[var(--orange-hover)] transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Kaydediliyor...</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Tüm Değişiklikleri Kaydet</span>
            </>
          )}
        </button>
      </div>

      {/* Geri Bildirim Mesajları */}
      {successMessage && (
        <div className="mb-6 rounded-[2px] border border-emerald-500/30 bg-emerald-950/40 px-5 py-4 text-sm text-emerald-300 flex items-center gap-3">
          <span className="text-lg">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-[2px] border border-rose-500/30 bg-rose-950/40 px-5 py-4 text-sm text-rose-300 flex items-center gap-3">
          <span className="text-lg">⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Kategori Sekmeleri */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-8">
        {groups.map((grp) => {
          const isActive = activeGroup === grp.id;
          return (
            <button
              key={grp.id}
              type="button"
              onClick={() => setActiveGroup(grp.id)}
              className={`inline-flex items-center gap-2.5 rounded-[2px] px-5 py-2.5 text-xs font-industrial font-bold tracking-[0.16em] uppercase transition-all ${
                isActive
                  ? 'bg-[var(--navy-deep)] border border-[var(--orange)] text-[var(--orange)] shadow-sm'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{grp.icon}</span>
              <span>{grp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form İçerik Alanı */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--orange)]" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
          <div className="rounded-[3px] border border-white/10 bg-[var(--navy-deep)]/90 p-6 sm:p-8 space-y-6">
            {filteredSettings.map((item) => (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={item.key} className="font-industrial text-xs font-bold tracking-[0.16em] uppercase text-white/90">
                    {item.label}
                  </label>
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openHistory(item.key)}
                      className="text-[11px] font-semibold text-[var(--orange)] hover:underline"
                    >
                      ↺ Geçmiş
                    </button>
                  </span>
                </div>

                {item.type === 'textarea' ? (
                  <textarea
                    id={item.key}
                    rows={item.key.includes('letter') ? 8 : 4}
                    value={formData[item.key] ?? item.value}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-[var(--orange)] focus:outline-none transition-colors"
                  />
                ) : (
                  <input
                    id={item.key}
                    type="text"
                    value={formData[item.key] ?? item.value}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none transition-colors"
                  />
                )}

                {item.type === 'image' && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                    <div className="h-28 w-44 shrink-0 overflow-hidden rounded-[2px] border border-white/20 bg-black/40">
                      <img
                        src={formData[item.key] || item.value}
                        alt="Mevcut fotoğraf"
                        className="h-full w-full object-cover"
                        onError={(e) => ((e.target as HTMLElement).style.opacity = '0.2')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-[2px] border border-[var(--orange)] px-5 py-2.5 text-xs font-industrial font-bold tracking-[0.14em] uppercase text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white transition-colors">
                        {uploadingKey === item.key ? 'Yükleniyor...' : 'Fotoğrafı Değiştir'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          disabled={uploadingKey === item.key}
                          onChange={(e) => {
                            handleImageUpload(item.key, e.target.files?.[0]);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <p className="text-[11px] text-white/50">
                        JPG, PNG veya WebP · en fazla 5 MB · otomatik küçültülür ve optimize edilir.
                        Yeni fotoğraf, "Kaydet"e basana kadar sitede görünmez.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--orange)] px-8 py-4 text-xs font-industrial font-bold tracking-[0.16em] uppercase text-white hover:bg-[var(--orange-hover)] transition-all shadow-[0_0_24px_rgba(255,107,0,0.35)] disabled:opacity-50"
            >
              <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
              <span>→</span>
            </button>
          </div>
        </form>
      )}

      {/* Kaydetmeden Önce Değişiklik Önizlemesi */}
      {reviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-6" role="dialog" aria-modal="true">
          <div className="w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-[8px] sm:rounded-[4px] border border-white/10 bg-[var(--navy-deep)] p-6">
            <h2 className="font-industrial text-2xl font-bold uppercase text-white">Değişiklikleri Onaylayın</h2>
            <p className="mt-1 text-sm text-white/60">
              {changedItems.length} alan değişti. Aşağıda eski ve yeni halini görebilirsiniz.
            </p>
            <div className="mt-5 space-y-4">
              {changedItems.map((item) => {
                const next = formData[item.key] ?? item.value;
                return (
                  <div key={item.key} className="rounded-[2px] border border-white/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">{item.label}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {[{ t: 'ESKİ', v: item.value, c: 'text-rose-300' }, { t: 'YENİ', v: next, c: 'text-emerald-300' }].map((col) => (
                        <div key={col.t}>
                          <p className={`text-[10px] font-bold tracking-[0.2em] ${col.c}`}>{col.t}</p>
                          {item.type === 'image' && isImageValue(col.v) ? (
                            <img src={col.v} alt={col.t} className="mt-1 h-24 w-full rounded-[2px] object-cover bg-black/40" />
                          ) : (
                            <p className="mt-1 max-h-32 overflow-auto whitespace-pre-line break-words text-sm text-white/85">
                              {col.v || '(boş)'}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="rounded-[2px] border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white/80 hover:bg-white/10"
              >
                Vazgeç, Düzenlemeye Dön
              </button>
              <button
                type="button"
                onClick={confirmSave}
                disabled={saving}
                className="rounded-[2px] bg-[var(--orange)] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[var(--orange-hover)] disabled:opacity-50"
              >
                {saving ? 'Yayınlanıyor...' : 'Onayla ve Yayınla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Önceki Sürümler (Geri Al) */}
      {historyKey && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-6" role="dialog" aria-modal="true">
          <div className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-[8px] sm:rounded-[4px] border border-white/10 bg-[var(--navy-deep)] p-6">
            <h2 className="font-industrial text-2xl font-bold uppercase text-white">Önceki Sürümler</h2>
            <p className="mt-1 text-sm text-white/60">Bu alanın son 20 değişikliği. "Bu sürüme dön" ile eski haline getirebilirsiniz.</p>
            <div className="mt-5 space-y-3">
              {historyLoading && <p className="text-sm text-white/60">Yükleniyor...</p>}
              {!historyLoading && historyItems.length === 0 && (
                <p className="text-sm text-white/60">Bu alan için henüz kayıtlı bir değişiklik yok.</p>
              )}
              {historyItems.map((h) => (
                <div key={h.id} className="rounded-[2px] border border-white/10 p-4">
                  <p className="text-[11px] text-white/50">
                    {new Date(h.changed_at.replace(' ', 'T') + 'Z').toLocaleString('tr-TR')} · {h.changed_by}
                  </p>
                  {isImageValue(h.old_value) ? (
                    <img src={h.old_value} alt="Eski fotoğraf" className="mt-2 h-24 w-40 rounded-[2px] object-cover bg-black/40" />
                  ) : (
                    <p className="mt-2 max-h-28 overflow-auto whitespace-pre-line break-words text-sm text-white/85">
                      {h.old_value || '(boş)'}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => restoreVersion(h.id)}
                    className="mt-3 rounded-[2px] border border-[var(--orange)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white transition-colors"
                  >
                    Bu sürüme dön
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryKey(null)}
                className="rounded-[2px] border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white/80 hover:bg-white/10"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSettingsPage;

