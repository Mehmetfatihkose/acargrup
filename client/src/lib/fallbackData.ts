import type { StatItem } from '../api/types';

/**
 * CLS < 0.1 hedefini korumak için API yanıtı gelene kadar iskelet boyutlarını sabit tutan başlangıç istatistikleri.
 * Asıl tüm proje, ürün, haber, dönüm noktası ve sertifika verileri SQLite veritabanından (/api/*) çekilir.
 */
export const placeholderStats: StatItem[] = [
  { id: 1, label: 'Yıllık Kurumsal Güven', value: 52, suffix: '+', sort_order: 1 },
  { id: 2, label: 'Km Tamamlanan Demiryolu & Hat', value: 2450, suffix: '+', sort_order: 2 },
  { id: 3, label: 'Tamamlanan Mega Proje', value: 140, suffix: '+', sort_order: 3 },
  { id: 4, label: 'Bin Ton Yıllık Polimer Tedariki', value: 320, suffix: '+', sort_order: 4 },
];

/**
 * Responsive görsel yardımcı fonksiyonu: /media/foo.webp yolundan -sm.webp ve .avif türevlerini üretir.
 */
export function getResponsiveMedia(src: string) {
  if (!src.startsWith('/media/') || !src.endsWith('.webp')) {
    return { avif: undefined, webpSrcSet: undefined, fallback: src };
  }
  const base = src.slice(0, -5);
  return {
    avif: `${base}.avif`,
    webpSrcSet: `${base}-sm.webp 640w, ${base}.webp 1440w`,
    fallback: src,
  };
}

