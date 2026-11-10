import React, { useEffect, useRef, useState } from 'react';
import { getAdminMediaApi, uploadAdminMediaApi, type MediaItem } from '../api/adminApi';
import { SEO } from '../../components/SEO';

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 Byte';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await getAdminMediaApi();
      setMediaList(data);
    } catch (err: any) {
      alert(err.message || 'Medya listesi alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const res = await uploadAdminMediaApi(file);
      await fetchMedia();
      setCopiedUrl(res.url);
      window.setTimeout(() => setCopiedUrl(null), 3500);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setUploadError(err.message || 'Yükleme başarısız oldu.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    window.setTimeout(() => setCopiedUrl(null), 2500);
  };

  const filteredMedia = mediaList.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const isVideo = item.filename.endsWith('.mp4') || item.filename.endsWith('.webm');
    if (filterType === 'image') return matchesSearch && !isVideo;
    if (filterType === 'video') return matchesSearch && isVideo;
    return matchesSearch;
  });

  return (
    <>
      <SEO
        title="Medya Kütüphanesi & Görsel Yükleme — Acar Grup"
        description="Acar Grup web sitesi görsel ve video varlıkları yönetim konsolu."
        path="/admin/medya"
        noIndex
      />

      {/* Üst Başlık & Yükleme Butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
            Medya &amp; Görsel Kütüphanesi
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Projeler, ürünler, haberler ve sayfa arkaplanlarında kullanılan fotoğrafları inceleyin veya yeni dosya yükleyin ({mediaList.length} Dosya).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--orange)] px-5 py-3 text-xs font-industrial font-bold tracking-[0.16em] uppercase text-white hover:bg-[var(--orange-hover)] transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Yükleniyor...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Yeni Görsel / Video Yükle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="mb-6 rounded-[2px] border border-rose-500/30 bg-rose-950/40 px-5 py-4 text-sm text-rose-300">
          ⚠ {uploadError}
        </div>
      )}

      {/* Arama ve Filtre Çubuğu */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-2">
          {(['all', 'image', 'video'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`rounded-[2px] px-4 py-2 text-xs font-industrial font-bold tracking-[0.14em] uppercase transition-all ${
                filterType === type
                  ? 'bg-[var(--orange)] text-white'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
              }`}
            >
              {type === 'all' ? 'Tümü' : type === 'image' ? 'Fotoğraflar' : 'Videolar'}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-80">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Dosya adı ara..."
            className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-[var(--orange)] focus:outline-none"
          />
        </div>
      </div>

      {/* Medya Kartları Gridi */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--orange)]" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="rounded-[3px] border border-white/10 bg-[var(--navy-deep)] p-12 text-center text-white/50">
          Arama kriterine uygun medya dosyası bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMedia.map((item) => {
            const isVideo = item.filename.endsWith('.mp4') || item.filename.endsWith('.webm');
            const isCopied = copiedUrl === item.url;

            return (
              <div
                key={item.url}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[3px] border border-white/10 bg-[var(--navy-deep)]/90 transition-all hover:border-[var(--orange)]/60 hover:shadow-lg"
              >
                {/* Önizleme Alanı */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                  {isVideo ? (
                    <div className="flex h-full w-full items-center justify-center bg-black/60 text-[var(--orange)]">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.filename}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {item.isUpload && (
                    <span className="absolute top-2 left-2 rounded-[2px] bg-[var(--orange)] px-2 py-0.5 text-[10px] font-industrial font-bold uppercase text-white">
                      Yüklendi
                    </span>
                  )}
                </div>

                {/* Bilgiler ve Kopyala Butonu */}
                <div className="p-3.5 space-y-2">
                  <p className="text-xs font-mono text-white/90 truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-white/50">
                    <span>{formatBytes(item.size)}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.url)}
                      className={`font-industrial font-semibold tracking-wider uppercase transition-colors ${
                        isCopied ? 'text-emerald-400' : 'text-[var(--orange)] hover:underline'
                      }`}
                    >
                      {isCopied ? '✓ Kopyalandı' : 'URL Kopyala'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AdminMediaPage;

