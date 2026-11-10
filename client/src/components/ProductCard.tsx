import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '../api/types';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ProductCardProps {
  product: Product;
  isExpanded: boolean;
  onToggle: () => void;
  onRequestQuote: (productId: number) => void;
}

/**
 * Plastik Hammadde Ürün Kartı (PE, PP, PVC, PET, ABS):
 * - Tıklayınca kart yerinde genişler (Framer Motion layout)
 * - İçindeki teknik özellik tablosu satır satır belirir
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isExpanded,
  onToggle,
  onRequestQuote,
}) => {
  const reducedMotion = useReducedMotion();
  const shortCode = product.name.split('—')[0]?.trim() || product.slug.toUpperCase();

  const specRows = [
    { label: 'Polimer Kodu & Türler', value: product.specs.code || '-' },
    { label: 'Alt Gruplar / İşleme', value: product.specs.subtypes || '-' },
    { label: 'Erime Akış İndeksi (MFI / K)', value: product.specs.mfi || '-' },
    { label: 'Yoğunluk (ISO 1183)', value: product.specs.density || '-' },
    { label: 'Erime / İşleme Sıcaklığı', value: product.specs.meltingTemp || '-' },
    { label: 'Çekme Dayanımı (ISO 527)', value: product.specs.tensileStrength || '-' },
    { label: 'Kalite & Uygunluk', value: product.specs.standards || '-' },
    { label: 'Ambalaj & Sevkiyat', value: product.packaging },
  ];

  return (
    <motion.article
      layout={!reducedMotion}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[3px] border transition-colors duration-300 overflow-hidden ${
        isExpanded
          ? 'bg-[var(--white)] border-[var(--navy)] col-span-1 lg:col-span-2 shadow-sm'
          : 'bg-[var(--white)] border-[var(--navy)]/15 hover:border-[var(--navy)]/45'
      }`}
    >
      {/* Kart Üst Başlık ve Özet Alanı */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full text-left p-6 sm:p-8 flex flex-col justify-between gap-5"
      >
        <div className="flex items-start justify-between gap-4 w-full">
          <div className="flex items-center gap-3.5">
            <span className="inline-flex h-12 min-w-14 px-3 items-center justify-center rounded-[2px] bg-[var(--navy)] font-industrial text-xl font-bold tracking-[0.12em] text-[var(--white)]">
              {shortCode}
            </span>
            <div>
              <span className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-[var(--gray)]">
                {product.category}
              </span>
              <h3 className="mt-0.5 font-serif-heritage text-2xl sm:text-3xl font-semibold text-[var(--navy)]">
                {product.name}
              </h3>
            </div>
          </div>

          <span
            aria-hidden="true"
            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-300 ${
              isExpanded
                ? 'border-[var(--orange)] bg-[var(--orange)] text-[var(--white)]'
                : 'border-[var(--navy)]/20 text-[var(--navy)]'
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className={`transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </div>

        <p className="text-[var(--ink)] text-sm sm:text-base leading-[1.65]">
          {product.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--navy)]/10 w-full">
          <span className="text-xs font-medium text-[var(--gray)]">
            {product.packaging}
          </span>
          <span className="inline-flex items-center gap-2 font-industrial text-xs font-bold tracking-[0.18em] uppercase text-[var(--navy)]">
            <span>{isExpanded ? 'Teknik Tabloyu Kapat' : 'Teknik Özellikleri Aç'}</span>
            <span className="h-[2px] w-5 bg-[var(--orange)]" aria-hidden="true" />
          </span>
        </div>
      </button>

      {/* Genişleyen Teknik Özellik Tablosu ve Kullanım Alanları */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[var(--navy)]/12 bg-[var(--paper)] px-6 py-7 sm:px-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sol: Satır satır beliren teknik tablo */}
              <div className="lg:col-span-8">
                <h4 className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--navy)] mb-4">
                  Tipik Teknik Karakteristikler
                </h4>
                <div className="divide-y divide-[var(--navy)]/10 border-y border-[var(--navy)]/12 bg-[var(--white)]">
                  {specRows.map((row, idx) => (
                    <motion.div
                      key={row.label}
                      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: reducedMotion ? 0 : idx * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 px-4 py-3 text-sm"
                    >
                      <span className="sm:col-span-5 font-semibold text-[var(--navy)]">
                        {row.label}
                      </span>
                      <span className="sm:col-span-7 text-[var(--ink)]">{row.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sağ: Ana Kullanım Alanları ve Teklif Aksiyonu */}
              <div className="lg:col-span-4 flex flex-col justify-between bg-[var(--navy)] text-[var(--white)] p-6 rounded-[3px]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="h-[2px] w-6 bg-[var(--orange)]" aria-hidden="true" />
                    <h4 className="font-industrial text-xs font-semibold tracking-[0.2em] uppercase text-[var(--orange)]">
                      Endüstriyel Kullanım Alanları
                    </h4>
                  </div>

                  <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                    {(product.specs.applications || []).map((app) => (
                      <li key={app} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--orange)]"
                        />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 pt-5 border-t border-white/15">
                  <p className="text-xs text-white/65 mb-3">
                    TDS (Teknik Veri Sayfası) ve güncel tonaj fiyatlandırması için:
                  </p>
                  <button
                    type="button"
                    onClick={() => onRequestQuote(product.id)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[2px] bg-[var(--orange)] px-5 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] transition-colors hover:bg-[var(--orange-hover)]"
                  >
                    <span>Bu Ürün İçin Teklif İste</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

