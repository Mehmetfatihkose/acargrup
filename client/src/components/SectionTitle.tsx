import React, { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
  theme?: 'dark' | 'light';
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Kurumsal Bölüm Başlığı:
 * Renk kurallarına tam uyumlu:
 * - Koyu zeminde: turuncu ince çizgi + turuncu/beyaz üst etiket, beyaz serif başlık, %75 beyaz açıklama
 * - Açık zeminde: küçük turuncu metin KULLANILMAZ (kontrast kuralı); turuncu yalnızca çizgi vurgusu olarak kullanılır,
 *   etiket --navy, başlık --navy, açıklama --ink rengindedir.
 */
export const SectionTitle: React.FC<SectionTitleProps> = ({
  eyebrow,
  title,
  description,
  theme = 'dark',
  align = 'left',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef, { selector: '[data-reveal]', y: 24, stagger: 0.08 });

  const isDark = theme === 'dark';

  return (
    <div
      ref={containerRef}
      className={`${align === 'center' ? 'mx-auto text-center max-w-3xl' : 'max-w-3xl'} ${className}`}
    >
      <div
        data-reveal
        className={`inline-flex items-center gap-3 ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        <span className="h-[2px] w-8 bg-[var(--orange)] shrink-0" aria-hidden="true" />
        <span
          className={`font-industrial text-xs font-semibold tracking-[0.22em] uppercase ${
            isDark ? 'text-[var(--orange)]' : 'text-[var(--navy)]'
          }`}
        >
          {eyebrow}
        </span>
      </div>

      <h2
        data-reveal
        className={`section-heading mt-4 ${
          isDark ? 'text-[var(--white)]' : 'text-[var(--navy)]'
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          data-reveal
          className={`mt-5 text-base sm:text-lg leading-[1.65] ${
            isDark ? 'text-white/75' : 'text-[var(--ink)]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

