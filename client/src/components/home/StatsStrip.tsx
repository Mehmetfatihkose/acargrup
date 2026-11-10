import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import type { StatItem } from '../../api/types';
import { AnimatedCounter } from '../AnimatedCounter';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface StatsStripProps {
  stats: StatItem[];
}

/**
 * İstatistik Şeridi:
 * - Sayılar 0'dan hedefe 2s içinde sayar, bitince "+" belirir
 * - Etiketler fade-in olur
 * - Sütunlar arası ince dikey çizgiler yukarıdan aşağıya çizilir (scaleY 0 -> 1)
 */
export const StatsStrip: React.FC<StatsStripProps> = ({ stats }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;

    const dividers = el.querySelectorAll<HTMLElement>('[data-stat-divider]');
    const labels = el.querySelectorAll<HTMLElement>('[data-stat-label]');

    const ctx = gsap.context(() => {
      if (dividers.length > 0) {
        gsap.fromTo(
          dividers,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      if (labels.length > 0) {
        gsap.fromTo(
          labels,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            delay: 0.25,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [stats, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Rakamlarla Acar Grup"
      data-theme="dark"
      className="relative bg-[var(--navy)] border-y border-white/10 grain-surface"
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-white/10">
          {stats.map((stat, idx) => (
            <AnimatedCounter
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              showDivider={idx > 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

