import React, { useEffect, useRef } from 'react';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { useReducedMotion } from '../hooks/useReducedMotion';

type CursorMode = 'default' | 'interactive' | 'drag' | 'view';

/**
 * Özel Masaüstü İmleci (Ultra Yüksek Performans):
 * - Sıfır React re-render: Tüm sınıflar ve dönüşümler doğrudan DOM ve rAF ile yönetilir
 * - 60-120fps akıcı takip
 */
export const CustomCursor: React.FC = () => {
  const { isDesktop, hasFinePointer } = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const enabled = isDesktop && hasFinePointer && !reducedMotion;

  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringTextRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('custom-cursor-enabled');
      return;
    }

    document.body.classList.add('custom-cursor-enabled');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;
    let currentMode: CursorMode = 'default';
    let isDark = true;
    let isVisible = false;

    const applyMode = (newMode: CursorMode) => {
      if (currentMode === newMode || !ringRef.current || !dotRef.current || !ringTextRef.current) return;
      currentMode = newMode;

      ringRef.current.className = `fixed top-0 left-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-200 pointer-events-none ${
        newMode === 'drag' || newMode === 'view'
          ? 'h-20 w-20 border-[var(--orange)] bg-[var(--navy-deep)]/90 text-[var(--white)]'
          : newMode === 'interactive'
          ? 'h-12 w-12 border-[var(--orange)] bg-[var(--orange)]/15 scale-110'
          : 'h-8 w-8 border-[var(--orange)]/60 bg-transparent'
      }`;

      if (newMode === 'drag') {
        ringTextRef.current.textContent = 'Sürükle';
        ringTextRef.current.style.display = 'block';
        dotRef.current.style.opacity = '0';
      } else if (newMode === 'view') {
        ringTextRef.current.textContent = 'Gör';
        ringTextRef.current.style.display = 'block';
        dotRef.current.style.opacity = '0';
      } else {
        ringTextRef.current.textContent = '';
        ringTextRef.current.style.display = 'none';
        dotRef.current.style.opacity = '1';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible && containerRef.current) {
        isVisible = true;
        containerRef.current.style.opacity = '1';
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        let detectedMode: CursorMode = 'default';
        if (target.closest('[data-cursor="drag"]')) {
          detectedMode = 'drag';
        } else if (target.closest('[data-cursor="view"]')) {
          detectedMode = 'view';
        } else if (target.closest('a, button, [role="button"], input, select, textarea, summary, [role="tab"]')) {
          detectedMode = 'interactive';
        }
        applyMode(detectedMode);

        const themedSection = target.closest('[data-theme]');
        const isLightTheme = themedSection?.getAttribute('data-theme') === 'light';
        if (glowRef.current && isDark === isLightTheme) {
          isDark = !isLightTheme;
          glowRef.current.style.opacity = isDark ? '1' : '0';
        }
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (containerRef.current) containerRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      if (containerRef.current) containerRef.current.style.opacity = '1';
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current && isDark) {
        glowRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-[95] transition-opacity duration-200"
    >
      {/* Koyu bölümlerde turuncu ışıma */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 h-[320px] w-[320px] rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(circle, rgba(255,107,0,0.12) 0%, rgba(255,107,0,0.02) 45%, transparent 70%)',
        }}
      />

      {/* Gecikmeli takip eden ince halka */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 h-8 w-8 rounded-full border border-[var(--orange)]/60 bg-transparent flex items-center justify-center pointer-events-none"
      >
        <span
          ref={ringTextRef}
          style={{ display: 'none' }}
          className="font-industrial text-[11px] font-semibold tracking-[0.16em] uppercase text-[var(--white)] select-none"
        />
      </div>

      {/* Merkez turuncu nokta */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-2 w-2 rounded-full bg-[var(--orange)] pointer-events-none"
      />
    </div>
  );
};
