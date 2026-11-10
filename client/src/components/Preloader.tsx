import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

const SESSION_KEY = 'acar_grup_preloader_seen_v1';

interface PreloaderProps {
  onComplete: () => void;
}

/**
 * Oturum başına yalnızca ilk ziyarette çalışan Preloader (Maksimum <= 3 saniye)
 * 1) --navy-deep zeminde Acar Grup SVG logosu stroke-dashoffset ile çizilir (1.4s)
 * 2) Altında ince turuncu ilerleme çizgisi ve 0 -> 100 yüzde sayacı ilerler
 * 3) Logo dolgu rengini alır (0.35s)
 * 4) Ekran ortadan iki yana yatay olarak açılır (0.85s, expo.inOut)
 */
export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== '1';
    } catch {
      return false;
    }
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const pathFrameRef = useRef<SVGRectElement>(null);
  const pathArchRef = useRef<SVGPathElement>(null);
  const pathRailTopRef = useRef<SVGPathElement>(null);
  const pathRailBottomRef = useRef<SVGPathElement>(null);
  const fillArchRef = useRef<SVGPathElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!shouldRender) {
      onComplete();
      return;
    }

    const safeMarkSeen = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Private mode güvenli yakalama
      }
    };

    if (reducedMotion) {
      safeMarkSeen();
      setShouldRender(false);
      onComplete();
      return;
    }

    let isCompleted = false;
    const finalize = () => {
      if (isCompleted) return;
      isCompleted = true;
      safeMarkSeen();
      onComplete();
      setShouldRender(false);
    };

    // Failsafe: Herhangi bir nedenden dolayı animasyon takılırsa 2.2s içinde kesinlikle kapanır
    const fallbackTimer = window.setTimeout(finalize, 2200);

    const ctx = gsap.context(() => {
      const paths = [
        pathFrameRef.current,
        pathArchRef.current,
        pathRailTopRef.current,
        pathRailBottomRef.current,
      ].filter(Boolean) as SVGGeometryElement[];

      paths.forEach((p) => {
        let length = 240;
        try {
          if (typeof p.getTotalLength === 'function') {
            length = p.getTotalLength();
          }
        } catch {
          length = 240;
        }
        gsap.set(p, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const progressState = { value: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          finalize();
        },
      });

      // SVG stroke çizim + gerçek zamanlı ilerleme sayacı (1.4s)
      tl.to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 1.35,
          stagger: 0.08,
          ease: 'power3.out',
        },
        0
      );

      tl.to(
        progressState,
        {
          value: 100,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            const rounded = Math.round(progressState.value);
            if (percentTextRef.current) {
              percentTextRef.current.textContent = `%${rounded}`;
            }
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${progressState.value / 100})`;
            }
          },
        },
        0
      );

      // Logo dolgu rengini alır (0.3s)
      tl.to(
        fillArchRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        1.3
      );

      // Merkez içerik hafifçe solarken Hero açılır ve perdeler yatay olarak açılır
      tl.to(
        centerContentRef.current,
        {
          opacity: 0,
          scale: 0.96,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            if (rootRef.current) {
              rootRef.current.style.pointerEvents = 'none';
            }
            onComplete();
          },
        },
        1.55
      );

      tl.to(
        leftPanelRef.current,
        {
          xPercent: -100,
          duration: 0.65,
          ease: 'expo.inOut',
        },
        1.65
      );

      tl.to(
        rightPanelRef.current,
        {
          xPercent: 100,
          duration: 0.65,
          ease: 'expo.inOut',
        },
        1.65
      );
    }, rootRef);

    return () => {
      window.clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, [shouldRender, reducedMotion, onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Acar Grup yükleniyor"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-auto"
    >
      {/* Sol ve Sağ Yatay Açılan Perdeler */}
      <div
        ref={leftPanelRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-[var(--navy-deep)] border-r border-white/5"
      />
      <div
        ref={rightPanelRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-[var(--navy-deep)]"
      />

      {/* Merkez Logo Çizimi ve İlerleme Çubuğu */}
      <div
        ref={centerContentRef}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <svg
          width="88"
          height="88"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-6"
        >
          <rect
            ref={pathFrameRef}
            x="2"
            y="2"
            width="60"
            height="60"
            rx="3"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.5"
          />
          <path
            ref={pathArchRef}
            d="M15 49L28.8 14H35.2L49 49H41.8L32 23.2L22.2 49H15Z"
            stroke="#FFFFFF"
            strokeWidth="1.8"
          />
          <path
            ref={fillArchRef}
            d="M15 49L28.8 14H35.2L49 49H41.8L32 23.2L22.2 49H15Z"
            fill="#FFFFFF"
            style={{ opacity: 0 }}
          />
          <path
            ref={pathRailTopRef}
            d="M22.5 38.5H41.5"
            stroke="#FF6B00"
            strokeWidth="3.8"
            strokeLinecap="square"
          />
          <path
            ref={pathRailBottomRef}
            d="M13 53.5H51"
            stroke="#FF6B00"
            strokeWidth="2.4"
          />
        </svg>

        <p className="font-industrial text-xl font-bold tracking-[0.26em] uppercase text-[var(--white)]">
          ACAR <span className="text-[var(--orange)]">GRUP</span>
        </p>
        <p className="mt-1 text-[11px] tracking-[0.22em] uppercase text-[var(--gray)]">
          1974&apos;ten Beri · 50 Yıllık Güven
        </p>

        {/* İnce Turuncu İlerleme Çubuğu */}
        <div className="mt-7 w-56 h-[2px] bg-white/12 overflow-hidden">
          <div
            ref={progressBarRef}
            style={{ transform: 'scaleX(0)', transformOrigin: '0% 50%' }}
            className="h-full w-full bg-[var(--orange)]"
          />
        </div>

        <span
          ref={percentTextRef}
          className="mt-3 font-industrial text-sm tracking-[0.2em] text-white/75 tabular-nums"
        >
          %0
        </span>
      </div>
    </div>
  );
};

