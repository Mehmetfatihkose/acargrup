import React, { useRef } from 'react';
import { TransitionLink } from './PageTransition';
import { useTilt } from '../hooks/useTilt';
import { useMagnetic } from '../hooks/useMagnetic';

interface GlassCardProps {
  indexLabel: string;
  title: string;
  subtitle: string;
  metrics: string;
  to: string;
  icon: React.ReactNode;
}

/**
 * Hero Sağ Dikey Cam Kart-Buton Bileşeni:
 * - Cam yüzey: rgba(10,37,64,0.55) + backdrop-blur + 1px yarı saydam turuncu kenarlık
 * - Hover: maks 6 derece 3D tilt, hafif manyetik çekim, soldan akan turuncu dolgu,
 *   8px sağa kayan ok ikonu ve tam turuncuya dönen kenarlık.
 * - Tıklama: sayfa geçiş perdesi ile ilgili rotaya yönlendirir.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  indexLabel,
  title,
  subtitle,
  metrics,
  to,
  icon,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef, 6);
  useMagnetic(cardRef, 0.12);

  return (
    <div ref={cardRef} className="w-full">
      <TransitionLink
        to={to}
        className="group relative flex flex-col justify-between overflow-hidden rounded-[4px] border border-[rgba(255,107,0,0.32)] bg-gradient-to-br from-[rgba(10,37,64,0.75)] via-[rgba(6,21,40,0.85)] to-[rgba(10,37,64,0.92)] p-6 sm:p-7 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.38)] transition-all duration-350 hover:border-[var(--orange)] hover:shadow-[0_16px_40px_rgba(255,107,0,0.18)]"
      >
        {/* İnce iç ışık vurgusu (Top Highlight) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        {/* Soldan sağa akan turuncu dolgu katmanı */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[var(--orange)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-industrial text-xs font-bold tracking-[0.22em] uppercase text-[var(--orange)] transition-colors duration-300 group-hover:text-[var(--white)]">
              {indexLabel}
            </span>
            <span className="h-[1px] w-8 bg-white/20 transition-colors duration-300 group-hover:bg-white/70" />
            <span className="font-industrial text-xs font-semibold tracking-[0.14em] uppercase text-white/75 transition-colors duration-300 group-hover:text-white/95">
              {metrics}
            </span>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-[2px] border border-white/15 bg-[var(--navy-deep)]/60 text-[var(--orange)] shadow-inner transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/15 group-hover:text-[var(--white)]">
            {icon}
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <h2 className="font-serif-heritage text-2xl sm:text-3xl font-semibold text-[var(--white)] leading-tight">
            {title}
          </h2>
          <p className="mt-2.5 text-sm text-white/80 leading-relaxed transition-colors duration-300 group-hover:text-[var(--white)]">
            {subtitle}
          </p>
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/15 pt-4 transition-colors duration-300 group-hover:border-white/35">
          <span className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--white)]">
            Sektörü İncele
          </span>
          <span
            aria-hidden="true"
            className="inline-flex items-center text-[var(--orange)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--white)]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </TransitionLink>
    </div>
  );
};

