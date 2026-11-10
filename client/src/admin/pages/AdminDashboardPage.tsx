import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAdminDashboardApi,
  updateAdminQuoteStatusApi,
  toggleAdminMessageReadApi,
  type DashboardData,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardApi();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Veriler alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuoteStatus = async (id: number, status: string) => {
    try {
      await updateAdminQuoteStatusApi(id, status);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleRead = async (id: number, currentRead: boolean) => {
    try {
      await toggleAdminMessageReadApi(id, !currentRead);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--orange)] border-t-transparent" />
          <span className="font-industrial text-xs uppercase tracking-widest text-white/60">
            İstatistikler Yükleniyor...
          </span>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    projects: 0,
    products: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
    totalMessages: 0,
    unreadMessages: 0,
    news: 0,
  };

  return (
    <>
      <SEO
        title="Genel Bakış — Acar Grup Yönetim Konsolu"
        description="Acar Grup holding yönetim kokpiti, operasyonel göstergeler ve anlık talepler."
        path="/admin/dashboard"
        noIndex
      />

      {/* Başlık & Hızlı İşlemler */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            Genel Bakış Konsolu
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Acar Grup operasyonel metrikleri, talep akışları ve portföy durumu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/projeler"
            className="rounded-[2px] bg-[var(--orange)] px-4 py-2.5 text-xs font-industrial font-bold uppercase tracking-wider text-white hover:bg-[var(--orange-hover)] transition-colors shadow-[0_0_12px_rgba(255,107,0,0.3)]"
          >
            + Yeni Proje Ekle
          </Link>
          <Link
            to="/admin/urunler"
            className="rounded-[2px] border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-industrial font-bold uppercase tracking-wider text-white hover:border-[var(--orange)] transition-colors"
          >
            + Yeni Polimer Ekle
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-[2px] border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* 4 Ana KPI Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {/* Bekleyen Teklifler */}
        <div className="rounded-[3px] border border-[var(--orange)]/40 bg-[var(--navy)]/80 p-6 relative overflow-hidden shadow-[0_4px_24px_rgba(255,107,0,0.1)]">
          <div className="flex items-center justify-between">
            <span className="font-industrial text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">
              BEKLEYEN TEKLİFLER
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--orange)] animate-ping" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-industrial text-4xl sm:text-5xl font-bold text-white">
              {metrics.pendingQuotes}
            </span>
            <span className="text-xs text-white/50">/ {metrics.totalQuotes} Toplam</span>
          </div>
          <Link
            to="/admin/teklifler"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-industrial uppercase tracking-wider text-[var(--orange)] hover:underline"
          >
            <span>Talepleri İncele</span>
            <span>→</span>
          </Link>
        </div>

        {/* Okunmamış Mesajlar */}
        <div className="rounded-[3px] border border-white/12 bg-[var(--navy)]/80 p-6">
          <div className="flex items-center justify-between">
            <span className="font-industrial text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              OKUNMAMIŞ MESAJLAR
            </span>
            <span className="text-xs font-industrial uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
              Gelen Kutusu
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-industrial text-4xl sm:text-5xl font-bold text-white">
              {metrics.unreadMessages}
            </span>
            <span className="text-xs text-white/50">/ {metrics.totalMessages} Toplam</span>
          </div>
          <Link
            to="/admin/mesajlar"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-industrial uppercase tracking-wider text-white/80 hover:text-[var(--orange)]"
          >
            <span>Mesajları Görüntüle</span>
            <span>→</span>
          </Link>
        </div>

        {/* Toplam Projeler */}
        <div className="rounded-[3px] border border-white/12 bg-[var(--navy)]/80 p-6">
          <div className="flex items-center justify-between">
            <span className="font-industrial text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              İNŞAAT PROJELERİ
            </span>
            <span className="text-xs font-industrial uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
              Portföy
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-industrial text-4xl sm:text-5xl font-bold text-white">
              {metrics.projects}
            </span>
            <span className="text-xs text-white/50">Kayıtlı Eser</span>
          </div>
          <Link
            to="/admin/projeler"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-industrial uppercase tracking-wider text-white/80 hover:text-[var(--orange)]"
          >
            <span>Projeleri Yönet</span>
            <span>→</span>
          </Link>
        </div>

        {/* Plastik Hammadde Ürünleri */}
        <div className="rounded-[3px] border border-white/12 bg-[var(--navy)]/80 p-6">
          <div className="flex items-center justify-between">
            <span className="font-industrial text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              POLİMER GRUPLARI
            </span>
            <span className="text-xs font-industrial uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
              Katalog
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-industrial text-4xl sm:text-5xl font-bold text-white">
              {metrics.products}
            </span>
            <span className="text-xs text-white/50">Ürün Ailesi</span>
          </div>
          <Link
            to="/admin/urunler"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-industrial uppercase tracking-wider text-white/80 hover:text-[var(--orange)]"
          >
            <span>Ürünleri Yönet</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* İki Sütunlu Aktivite Tabloları */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Sol: Son Fiyat Teklif Talepleri */}
        <div className="xl:col-span-7 rounded-[3px] border border-white/12 bg-[var(--navy)]/60 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 p-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[var(--orange)]" />
              <h2 className="font-industrial text-lg font-bold uppercase tracking-wider text-white">
                Son Fiyat Teklifi Talepleri
              </h2>
            </div>
            <Link
              to="/admin/teklifler"
              className="text-xs font-industrial uppercase tracking-wider text-[var(--orange)] hover:underline"
            >
              Tümünü Gör ({metrics.totalQuotes}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 font-industrial uppercase tracking-wider text-white/60 border-b border-white/10">
                <tr>
                  <th className="p-4 pl-6">Yetkili / Firma</th>
                  <th className="p-4">Ürün / Miktar</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4 pr-6 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {!data?.recentQuotes || data.recentQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-white/50">
                      Henüz teklif talebi bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  data.recentQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-6">
                        <span className="block font-semibold text-white">{q.name}</span>
                        <span className="block text-white/60 text-[11px]">{q.company}</span>
                      </td>
                      <td className="p-4">
                        <span className="block text-white font-medium">
                          {q.product_name || 'Özel / Çoklu'}
                        </span>
                        <span className="block text-white/60 text-[11px]">{q.quantity}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-[2px] font-industrial uppercase text-[10px] font-bold tracking-wider ${
                            q.status === 'beklemede'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : q.status === 'incelendi'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : q.status === 'teklif_verildi'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {q.status === 'beklemede'
                            ? 'Beklemede'
                            : q.status === 'incelendi'
                            ? 'İncelendi'
                            : q.status === 'teklif_verildi'
                            ? 'Teklif Verildi'
                            : 'Arşivlendi'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <select
                          value={q.status}
                          onChange={(e) => handleQuoteStatus(q.id, e.target.value)}
                          className="rounded-[2px] border border-white/20 bg-[var(--navy-deep)] px-2 py-1 text-[11px] font-industrial uppercase text-white/80 focus:border-[var(--orange)] focus:outline-none"
                        >
                          <option value="beklemede">Beklemede</option>
                          <option value="incelendi">İncelendi</option>
                          <option value="teklif_verildi">Teklif Verildi</option>
                          <option value="arsivlendi">Arşivle</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sağ: Son İletişim Mesajları */}
        <div className="xl:col-span-5 rounded-[3px] border border-white/12 bg-[var(--navy)]/60 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 p-5 sm:px-6">
            <h2 className="font-industrial text-lg font-bold uppercase tracking-wider text-white">
              Son İletişim Mesajları
            </h2>
            <Link
              to="/admin/mesajlar"
              className="text-xs font-industrial uppercase tracking-wider text-[var(--orange)] hover:underline"
            >
              Tümünü Gör ({metrics.totalMessages}) →
            </Link>
          </div>

          <div className="divide-y divide-white/10">
            {!data?.recentMessages || data.recentMessages.length === 0 ? (
              <div className="p-6 text-center text-white/50 text-xs">
                Henüz mesaj bulunmuyor.
              </div>
            ) : (
              data.recentMessages.map((m) => (
                <div key={m.id} className="p-4 sm:px-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-white text-xs">{m.name}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleRead(m.id, !!m.is_read)}
                      className={`text-[10px] font-industrial uppercase px-2 py-0.5 rounded-[2px] tracking-wider border ${
                        m.is_read
                          ? 'border-white/15 bg-white/5 text-white/50'
                          : 'border-[var(--orange)] bg-[var(--orange)]/20 text-[var(--orange)] font-bold'
                      }`}
                    >
                      {m.is_read ? 'Okundu' : 'Yeni'}
                    </button>
                  </div>
                  <p className="text-xs font-medium text-white/80 line-clamp-1">{m.subject}</p>
                  <p className="text-[11px] text-white/55 line-clamp-2 mt-1">{m.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
