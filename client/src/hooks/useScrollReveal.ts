import { useEffect, type RefObject } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from './useReducedMotion';

interface ScrollRevealOptions {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  start?: string;
}

/**
 * GSAP ScrollTrigger tabanlı tek seferlik (once: true) giriş animasyonu hook'u.
 * Sadece transform ve opacity kullanır; animasyon bitiminde will-change temizlenir.
 */
export function useScrollReveal(
  containerRef: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) {
  const reducedMotion = useReducedMotion();
  const {
    selector = '[data-reveal]',
    y = 28,
    duration = 0.85,
    stagger = 0.08,
    delay = 0,
    start = 'top 86%',
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = selector
      ? Array.from(container.querySelectorAll<HTMLElement>(selector))
      : [container];

    if (targets.length === 0) return;

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: 'willChange,transform' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
          willChange: 'transform, opacity',
        },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          delay,
          ease: 'power3.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: container,
            start,
            once: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [containerRef, selector, y, duration, stagger, delay, start, reducedMotion]);
}

