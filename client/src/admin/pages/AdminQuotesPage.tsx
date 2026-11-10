import React, { useEffect, useState } from 'react';
import {
  getAdminQuotesApi,
  updateAdminQuoteStatusApi,
  deleteAdminQuoteApi,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

interface QuoteItem {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  product_id: number | null;
  product_name?: string;
  quantity: string;
  message: string;
  status: 'beklemede' | 'incelendi' | 'teklif_verildi' | 'arsivlendi';
  created_at: string;
}

export const AdminQuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await getAdminQuotesApi();
      setQuotes(res);
    } catch (err: any) {
      alert(err.message || 'Teklif talepleri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateAdminQuoteStatusApi(id, status);
      fetchQuotes();
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote((prev) => (prev ? { ...prev, status: status as any } : null));
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number, company: string) => {
    if (window.confirm(`${company} firmasına ait bu teklif talebini silmek istediğinize emin misiniz?`)) {
      try {
        await deleteAdminQuoteApi(id);
        if (selectedQuote?.id === id) setSelectedQuote(null);
        fetchQuotes();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    if (statusFilter === 'Tümü') return true;
    return q.status === statusFilter;
  });

  const handleExportCsv = () => {
    if (filteredQuotes.length === 0) {
      alert('Dışa aktarılacak teklif talebi bulunmuyor.');
      return;
    }

    const headers = [
      'Talep ID',
      'Firma Ünvanı',
      'Yetkili Adı',
      'E-Posta',
      'Telefon',
      'Talep Edilen Ürün',
      'Tahmini Miktar',
      'Durum',
      'Kayıt Tarihi',
      'Müşteri Notu',
    ];

    const rows = filteredQuotes.map((q) => [
      q.id,
      `"${(q.company || '').replace(/"/g, '""')}"`,
      `"${(q.name || '').replace(/"/g, '""')}"`,
      `"${(q.email || '').replace(/"/g, '""')}"`,
      `"${(q.phone || '').replace(/"/g, '""')}"`,
      `"${(q.product_name || 'Genel Hammadde').replace(/"/g, '""')}"`,
      `"${(q.quantity || '').replace(/"/g, '""')}"`,
      `"${q.status}"`,
      `"${new Date(q.created_at).toLocaleString('tr-TR')}"`,
      `"${(q.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `acar-grup-teklifler-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SEO
        title="Teklif Talepleri Yönetimi — Acar Grup"
        description="Plastik hammadde ve özel granül için iletilen teklif formları yönetim konsolu."
        path="/admin/teklifler"
        noIndex
      />

      {/* Üst Başlık & Aksiyonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            Fiyat Teklifi Talepleri
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Plastik hammadde ve özel granül için iletilen teklif formları ({quotes.length} Talep).
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 rounded-[2px] border border-emerald-500/30 bg-emerald-950/40 px-4 py-2.5 text-xs font-industrial font-bold uppercase tracking-wider text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500/50 transition-all cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Excel / CSV İndir</span>
        </button>
      </div>

      {/* Durum Filtre Hapları */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { label: 'Tümü', value: 'Tümü' },
          { label: 'Bekleyenler', value: 'beklemede' },
          { label: 'İncelenenler', value: 'incelendi' },
          { label: 'Teklif Verilenler', value: 'teklif_verildi' },
          { label: 'Arşivlenenler', value: 'arsivlendi' },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setStatusFilter(item.value)}
            className={`rounded-[2px] px-4 py-2 text-xs font-industrial font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              statusFilter === item.value
                ? 'bg-[var(--orange)] text-white shadow-[0_0_12px_rgba(255,107,0,0.3)]'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tablo */}
      <div className="rounded-[3px] border border-white/12 bg-[var(--navy)]/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 font-industrial uppercase tracking-wider text-white/60 border-b border-white/10">
              <tr>
                <th className="p-4 pl-6">Tarih</th>
                <th className="p-4">Firma &amp; Yetkili</th>
                <th className="p-4">İletişim</th>
                <th className="p-4">Hammadde / Miktar</th>
                <th className="p-4">Durum</th>
                <th className="p-4 pr-6 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    Talepler yükleniyor...
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    Seçili kritere uygun teklif talebi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6 font-mono text-white/60 text-[11px]">
                      {new Date(q.created_at).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4">
                      <span className="block font-semibold text-white text-sm">{q.company}</span>
                      <span className="block text-white/60 text-[11px]">{q.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="block text-white/80">{q.email}</span>
                      <span className="block text-white/50 text-[11px] font-mono">{q.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="block font-medium text-white">{q.product_name || 'Özel / Çoklu'}</span>
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
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedQuote(q)}
                        className="rounded-[2px] border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-industrial font-semibold uppercase text-white hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors cursor-pointer"
                      >
                        İncele
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(q.id, q.company)}
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

      {/* Detay Görüntüleme Modalı */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-[3px] border border-white/20 bg-[var(--navy-deep)] p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="font-industrial text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
                  FİYAT TEKLİFİ DETAYI #{selectedQuote.id}
                </span>
                <h2 className="font-industrial text-2xl font-bold uppercase tracking-tight text-white mt-1">
                  {selectedQuote.company}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="text-white/60 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-[2px] border border-white/10">
                <div>
                  <span className="block text-white/50 text-[11px] uppercase font-industrial">Yetkili Ad Soyad:</span>
                  <span className="block text-white font-semibold text-sm mt-0.5">{selectedQuote.name}</span>
                </div>
                <div>
                  <span className="block text-white/50 text-[11px] uppercase font-industrial">Telefon:</span>
                  <a href={`tel:${selectedQuote.phone}`} className="block text-[var(--orange)] font-mono font-semibold text-sm mt-0.5 hover:underline">
                    {selectedQuote.phone}
                  </a>
                </div>
                <div className="col-span-2">
                  <span className="block text-white/50 text-[11px] uppercase font-industrial">E-Posta:</span>
                  <a href={`mailto:${selectedQuote.email}`} className="block text-white hover:text-[var(--orange)] font-medium text-sm mt-0.5 underline">
                    {selectedQuote.email}
                  </a>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-[2px] border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/50 uppercase font-industrial">Talep Edilen Hammadde:</span>
                  <span className="text-white font-bold">{selectedQuote.product_name || 'Özel / Çoklu'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 uppercase font-industrial">Tonaj / Miktar:</span>
                  <span className="text-white font-bold">{selectedQuote.quantity}</span>
                </div>
                {selectedQuote.message && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="block text-white/50 uppercase font-industrial mb-1">Teknik Notlar &amp; Sevkiyat:</span>
                    <p className="text-white/80 bg-[var(--navy)] p-3 rounded text-[11px] leading-relaxed whitespace-pre-line">
                      {selectedQuote.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Durum Değiştirme */}
              <div className="pt-3">
                <label className="block text-white/60 font-industrial uppercase tracking-wider mb-2">
                  Teklif Talebi Durumu:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['beklemede', 'incelendi', 'teklif_verildi', 'arsivlendi'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedQuote.id, st)}
                      className={`py-2 px-2 text-center rounded-[2px] font-industrial uppercase text-[11px] font-bold border transition-colors ${
                        selectedQuote.status === st
                          ? 'border-[var(--orange)] bg-[var(--orange)] text-white'
                          : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {st === 'beklemede'
                        ? 'Beklemede'
                        : st === 'incelendi'
                        ? 'İncelendi'
                        : st === 'teklif_verildi'
                        ? 'Teklif Verildi'
                        : 'Arşivlendi'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
              <a
                href={`mailto:${selectedQuote.email}?subject=Acar%20Grup%20Plastik%20Hammadde%20Fiyat%20Teklifi`}
                className="rounded-[2px] bg-[var(--orange)] px-5 py-2.5 text-xs font-industrial font-bold uppercase text-white hover:bg-[var(--orange-hover)] transition-colors inline-flex items-center gap-2"
              >
                <span>E-Posta ile Teklif İlet</span>
                <span>✉</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="rounded-[2px] border border-white/20 px-5 py-2.5 text-xs font-industrial uppercase text-white/70 hover:text-white"
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

export default AdminQuotesPage;
