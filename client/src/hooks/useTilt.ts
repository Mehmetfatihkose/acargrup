import { useEffect, type RefObject } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from './useReducedMotion';
import { useIsDesktop } from './useIsDesktop';

/**
 * İmleç yönüne göre maksimum 6 derece 3D tilt efekti uygular.
 * Mobilde ve prefers-reduced-motion aktifken kapalıdır.
 */
export function useTilt(ref: RefObject<HTMLElement | null>, maxDegrees = 6) {
  const reducedMotion = useReducedMotion();
  const { isDesktop, hasFinePointer } = useIsDesktop();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion || !isDesktop || !hasFinePointer) return;

    gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });

    const rxTo = gsap.quickTo(el, 'rotationX', { duration: 0.35, ease: 'power3.out' });
    const ryTo = gsap.quickTo(el, 'rotationY', { duration: 0.35, ease: 'power3.out' });

    const onEnter = () => {
      el.style.willChange = 'transform';
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      ryTo(nx * maxDegrees * 2);
      rxTo(-ny * maxDegrees * 2);
    };

    const onLeave = () => {
      rxTo(0);
      ryTo(0);
      window.setTimeout(() => {
        if (el) el.style.willChange = 'auto';
      }, 360);
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { rotationX: 0, rotationY: 0, clearProps: 'willChange' });
    };
  }, [ref, maxDegrees, reducedMotion, isDesktop, hasFinePointer]);
}

