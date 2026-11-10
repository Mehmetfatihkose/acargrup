import { useEffect, type RefObject } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from './useReducedMotion';
import { useIsDesktop } from './useIsDesktop';

/**
 * Masaüstü imleç etkileşimlerinde hafif manyetik çekim efekti sağlar.
 * Mobilde ve prefers-reduced-motion aktifken devre dışıdır.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.24) {
  const reducedMotion = useReducedMotion();
  const { isDesktop, hasFinePointer } = useIsDesktop();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion || !isDesktop || !hasFinePointer) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMouseEnter = () => {
      el.style.willChange = 'transform';
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      window.setTimeout(() => {
        if (el) el.style.willChange = 'auto';
      }, 360);
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { x: 0, y: 0, clearProps: 'willChange' });
    };
  }, [ref, strength, reducedMotion, isDesktop, hasFinePointer]);
}

