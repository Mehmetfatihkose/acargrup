import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MarqueeProps {
  items: string[];
  theme?: 'dark' | 'light';
}

/**
 * Sonsuz Kayan Müşteri Sektörleri Bandı (Marquee):
 * - Hover'da durur
 * - prefers-reduced-motion aktifken hareketsiz düzenli liste olarak görünür
 */
export const Marquee: React.FC<MarqueeProps> = ({ items, theme = 'dark' }) => {
  const reducedMotion = useReducedMotion();
  const isDark = theme === 'dark';

  if (reducedMotion) {
    return (
      <div
        className={`border-y py-8 ${
          isDark
            ? 'border-white/12 bg-[var(--navy-deep)] text-[var(--white)]'
            : 'border-[var(--navy)]/12 bg-[var(--white)] text-[var(--navy)]'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 flex flex-wrap items-center justify-center gap-6">
          {items.map((sector) => (
            <span
              key={sector}
              className="inline-flex items-center gap-3 font-industrial text-lg font-semibold tracking-[0.16em] uppercase"
            >
              <span className="h-2 w-2 bg-[var(--orange)]" aria-hidden="true" />
              {sector}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const duplicated = [...items, ...items];

  return (
    <div
      className={`marquee-wrapper overflow-hidden border-y py-7 select-none ${
        isDark
          ? 'border-white/12 bg-[var(--navy-deep)] text-[var(--white)]'
          : 'border-[var(--navy)]/12 bg-[var(--white)] text-[var(--navy)]'
      }`}
    >
      <div className="animate-marquee items-center">
        {duplicated.map((sector, index) => (
          <div
            key={`${sector}-${index}`}
            className="inline-flex items-center gap-8 px-6 sm:px-8 shrink-0"
          >
            <span className="font-serif-heritage text-2xl sm:text-3xl font-semibold whitespace-nowrap">
              {sector}
            </span>
            <span
              aria-hidden="true"
              className="h-2 w-2 rotate-45 bg-[var(--orange)] shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

