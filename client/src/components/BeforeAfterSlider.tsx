import React, { useCallback, useRef, useState } from 'react';
import { ResponsiveImage } from './ResponsiveImage';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeAlt: string;
  afterAlt: string;
}

/**
 * Önce / Sonra Karşılaştırma Kaydırıcısı:
 * - Sürüklenebilir dikey turuncu tutamaç
 * - Fare, dokunmatik ekran ve klavye yön tuşlarıyla çalışır
 * - [data-cursor="drag"] ile özel imleçte "Sürükle" etiketi belirir
 */
export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Kazı & Altyapı Hazırlığı (Önce)',
  afterLabel = 'Tamamlanan Elektrifikasyonlu Hat (Sonra)',
  beforeAlt,
  afterAlt,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<number>(52);
  const draggingRef = useRef<boolean>(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rawPercent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(Math.max(rawPercent, 4), 96));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((p) => Math.max(4, p - 4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((p) => Math.min(96, p + 4));
    }
  };

  return (
    <div
      ref={containerRef}
      data-cursor="drag"
      role="slider"
      tabIndex={0}
      aria-label="Şantiye önce ve sonra karşılaştırma kaydırıcısı"
      aria-valuemin={4}
      aria-valuemax={96}
      aria-valuenow={Math.round(position)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className="relative aspect-[16/9] w-full select-none overflow-hidden rounded-[3px] border border-white/15 bg-[var(--navy-deep)] touch-none"
    >
      {/* Altta Tamamlanan Görsel (Sonra) */}
      <div className="absolute inset-0">
        <ResponsiveImage
          src={afterImage}
          alt={afterAlt}
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="h-full w-full object-cover pointer-events-none"
        />
      </div>

      {/* Üstte Clip-Path ile Kesilen Görsel (Önce) */}
      <div
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        className="absolute inset-0"
      >
        <ResponsiveImage
          src={beforeImage}
          alt={beforeAlt}
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="h-full w-full object-cover pointer-events-none"
        />
      </div>

      {/* Sol / Sağ Etiketler */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-[2px] bg-[var(--navy-deep)]/85 backdrop-blur-sm border border-white/15 px-3.5 py-1.5 text-[11px] font-industrial font-semibold tracking-[0.16em] uppercase text-[var(--white)]">
        {beforeLabel}
      </div>
      <div className="pointer-events-none absolute top-4 right-4 z-10 rounded-[2px] bg-[var(--navy-deep)]/85 backdrop-blur-sm border border-[var(--orange)]/50 px-3.5 py-1.5 text-[11px] font-industrial font-semibold tracking-[0.16em] uppercase text-[var(--white)]">
        {afterLabel}
      </div>

      {/* Dikey Turuncu Çizgi ve Tutamaç */}
      <div
        aria-hidden="true"
        style={{ left: `${position}%` }}
        className="pointer-events-none absolute inset-y-0 z-20 -translate-x-1/2 w-[2px] bg-[var(--orange)]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--orange)] text-[var(--white)] shadow-[0_0_24px_rgba(255,107,0,0.55)] border-2 border-[var(--white)]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

