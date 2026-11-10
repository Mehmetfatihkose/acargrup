import React, { useEffect, useState } from 'react';
import {
  getAdminMessagesApi,
  toggleAdminMessageReadApi,
  deleteAdminMessageApi,
} from '../api/adminApi';
import { SEO } from '../../components/SEO';

interface MessageItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
}

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getAdminMessagesApi();
      setMessages(res);
    } catch (err: any) {
      alert(err.message || 'Mesajlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: number, currentRead: boolean) => {
    try {
      await toggleAdminMessageReadApi(id, !currentRead);
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, is_read: currentRead ? 0 : 1 } : null));
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`${name} tarafından iletilen bu mesajı silmek istediğinize emin misiniz?`)) {
      try {
        await deleteAdminMessageApi(id);
        if (selectedMessage?.id === id) setSelectedMessage(null);
        fetchMessages();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return !!m.is_read;
    return true;
  });

  const handleExportCsv = () => {
    if (filteredMessages.length === 0) {
      alert('Dışa aktarılacak mesaj bulunmuyor.');
      return;
    }

    const headers = [
      'Mesaj ID',
      'Gönderen Adı',
      'E-Posta',
      'Telefon',
      'Konu / Departman',
      'Durum',
      'Tarih',
      'Mesaj Metni',
    ];

    const rows = filteredMessages.map((m) => [
      m.id,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.phone || '').replace(/"/g, '""')}"`,
      `"${(m.subject || 'Genel').replace(/"/g, '""')}"`,
      `"${m.is_read ? 'Okundu' : 'Okunmadı'}"`,
      `"${new Date(m.created_at).toLocaleString('tr-TR')}"`,
      `"${(m.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `acar-grup-mesajlar-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SEO
        title="İletişim Mesajları — Acar Grup"
        description="Acar Grup kurumsal iletişim formundan iletilen mesajlar ve gelen kutusu."
        path="/admin/mesajlar"
        noIndex
      />

      {/* Üst Başlık & Aksiyonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            İletişim Formu Mesajları
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Web sitesi iletişim formundan gelen genel sorular ve iş birliği talepleri ({messages.length} Mesaj).
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

      {/* Filtre Butonları */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { label: 'Tüm Mesajlar', value: 'all' },
          { label: 'Okunmamış', value: 'unread' },
          { label: 'Okunmuş', value: 'read' },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value as any)}
            className={`rounded-[2px] px-4 py-2 text-xs font-industrial font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              filter === item.value
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
                <th className="p-4 pl-6">Durum</th>
                <th className="p-4">Gönderen</th>
                <th className="p-4">Konu</th>
                <th className="p-4">İletişim</th>
                <th className="p-4">Tarih</th>
                <th className="p-4 pr-6 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    Mesajlar yükleniyor...
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    Kayıtlı mesaj bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((m) => (
                  <tr
                    key={m.id}
                    className={`hover:bg-white/5 transition-colors ${
                      !m.is_read ? 'bg-[var(--orange)]/5' : ''
                    }`}
                  >
                    <td className="p-4 pl-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-[2px] font-industrial uppercase text-[10px] font-bold tracking-wider ${
                          !m.is_read
                            ? 'bg-[var(--orange)] text-white'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {!m.is_read ? 'Yeni' : 'Okundu'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="block font-semibold text-white text-sm">{m.name}</span>
                      {m.company && <span className="block text-white/50 text-[11px]">{m.company}</span>}
                    </td>
                    <td className="p-4">
                      <span className="block text-white font-medium max-w-xs truncate">{m.subject}</span>
                    </td>
                    <td className="p-4">
                      <span className="block text-white/80">{m.email}</span>
                      <span className="block text-white/50 text-[11px] font-mono">{m.phone}</span>
                    </td>
                    <td className="p-4 font-mono text-white/50 text-[11px]">
                      {new Date(m.created_at).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMessage(m);
                          if (!m.is_read) handleToggleRead(m.id, false);
                        }}
                        className="rounded-[2px] border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-industrial font-semibold uppercase text-white hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors cursor-pointer"
                      >
                        Oku
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.name)}
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

      {/* Mesaj Detayı Modalı */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-[3px] border border-white/20 bg-[var(--navy-deep)] p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="font-industrial text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
                  İLETİŞİM MESAJI #{selectedMessage.id}
                </span>
                <h2 className="font-industrial text-2xl font-bold uppercase tracking-tight text-white mt-1">
                  {selectedMessage.subject}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="text-white/60 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-[2px] border border-white/10">
                <div>
                  <span className="block text-white/50 text-[11px] uppercase font-industrial">Gönderen:</span>
                  <span className="block text-white font-semibold text-sm mt-0.5">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="block text-white/50 text-[11px] uppercase font-industrial">Telefon:</span>
                  <a href={`tel:${selectedMessage.phone}`} className="block text-[var(--orange)] font-mono font-semibold text-sm mt-0.5 hover:underline">
                    {selectedMessage.phone}
                  </a>
                </div>
                <div className="col-span-2">
                  <span className="block text-white/50 text-[11px] uppercase font-industrial">E-Posta:</span>
                  <a href={`mailto:${selectedMessage.email}`} className="block text-white hover:text-[var(--orange)] font-medium text-sm mt-0.5 underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.company && (
                  <div className="col-span-2">
                    <span className="block text-white/50 text-[11px] uppercase font-industrial">Firma Ünvanı:</span>
                    <span className="block text-white font-medium text-sm mt-0.5">{selectedMessage.company}</span>
                  </div>
                )}
              </div>

              <div className="bg-white/5 p-4 rounded-[2px] border border-white/10">
                <span className="block text-white/50 uppercase font-industrial mb-2">Mesaj İçeriği:</span>
                <p className="text-white/90 bg-[var(--navy)] p-4 rounded text-xs leading-relaxed whitespace-pre-line">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re:%20${encodeURIComponent(selectedMessage.subject)}`}
                className="rounded-[2px] bg-[var(--orange)] px-5 py-2.5 text-xs font-industrial font-bold uppercase text-white hover:bg-[var(--orange-hover)] transition-colors inline-flex items-center gap-2"
              >
                <span>Yanıt E-Postası Gönder</span>
                <span>✉</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleRead(selectedMessage.id, !!selectedMessage.is_read)}
                  className="rounded-[2px] border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-industrial uppercase text-white/70 hover:text-white"
                >
                  {selectedMessage.is_read ? 'Okunmadı Olarak İşaretle' : 'Okundu Yap'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-[2px] border border-white/20 px-4 py-2.5 text-xs font-industrial uppercase text-white/70 hover:text-white"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminMessagesPage;
