import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  showSince?: boolean;
  className?: string;
}

/**
 * Acar Grup Kurumsal Logo Bileşeni
 * variant="dark"  -> Koyu zeminde Beyaz + Turuncu SVG
 * variant="light" -> Açık zeminde Lacivert + Turuncu SVG
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  showSince = true,
  className = '',
}) => {
  const primaryFill = variant === 'dark' ? '#FFFFFF' : '#0A2540';
  const subTextColor =
    variant === 'dark' ? 'text-white/70 border-white/20' : 'text-[var(--gray)] border-[var(--navy)]/20';

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1.5"
          y="1.5"
          width="61"
          height="61"
          rx="3"
          stroke={variant === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(10,37,64,0.22)'}
          strokeWidth="1.5"
        />
        <path
          d="M15 49L28.8 14H35.2L49 49H41.8L32 23.2L22.2 49H15Z"
          fill={primaryFill}
        />
        <path d="M22.5 38.5H41.5" stroke="#FF6B00" strokeWidth="3.8" strokeLinecap="square" />
        <path d="M13 53.5H51" stroke="#FF6B00" strokeWidth="2.4" />
      </svg>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-2.5">
          <span
            className={`font-industrial text-2xl font-bold tracking-[0.14em] uppercase ${
              variant === 'dark' ? 'text-[var(--white)]' : 'text-[var(--navy)]'
            }`}
          >
            ACAR <span className="text-[var(--orange)]">GRUP</span>
          </span>
          {showSince && (
            <span
              className={`hidden sm:inline-block border-l pl-2.5 py-0.5 text-[11px] font-medium tracking-[0.16em] uppercase ${subTextColor}`}
            >
              1974&apos;ten Beri
            </span>
          )}
        </div>
        <span
          className={`mt-1 text-[10px] tracking-[0.22em] uppercase ${
            variant === 'dark' ? 'text-white/60' : 'text-[var(--gray)]'
          }`}
        >
          İnşaat · Plastik Hammadde
        </span>
      </div>
    </div>
  );
};

