import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import type { Project } from '../../api/types';
import { SectionTitle } from '../SectionTitle';
import { MagneticButton } from '../MagneticButton';
import { TransitionLink } from '../PageTransition';
import { ResponsiveImage } from '../ResponsiveImage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useIsDesktop } from '../../hooks/useIsDesktop';

interface FeaturedProjectsGalleryProps {
  projects: Project[];
}

/**
 * Öne Çıkan Projeler — Yüksek Performanslı Pinned Yatay Scroll Galeri:
 * - GSAP ScrollTrigger pin + scrub ile kartlar 60fps akıcı akar
 * - Sıfır layout-thrashing: getBoundingClientRect döngüsü kaldırıldı
 * - Re-render engellendi: sayaç doğrudan DOM ref ile güncellenir
 */
export const FeaturedProjectsGallery: React.FC<FeaturedProjectsGalleryProps> = ({
  projects,
}) => {
  const featured = projects.slice(0, 6);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const reducedMotion = useReducedMotion();
  const { isDesktop } = useIsDesktop();
  const usePinnedHorizontal = isDesktop && !reducedMotion && featured.length > 2;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || !usePinnedHorizontal) return;

    let lastIdx = -1;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth + 96);
      };

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount() + 200}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              featured.length - 1,
              Math.floor(self.progress * featured.length)
            );
            if (idx !== lastIdx && counterRef.current) {
              lastIdx = idx;
              counterRef.current.textContent = `0${idx + 1} / 0${featured.length}`;
            }
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, [featured.length, usePinnedHorizontal]);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative bg-[var(--navy)] text-[var(--white)] grain-surface overflow-hidden py-24 sm:py-28 border-t border-white/10"
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrow="SEÇKİN MÜHENDİSLİK PORTFÖYÜ"
            title="Öne Çıkan Projeler"
            theme="dark"
          />

          <div className="flex items-center gap-6">
            {usePinnedHorizontal && (
              <span
                ref={counterRef}
                className="hidden lg:inline-block font-industrial text-sm tracking-[0.2em] text-[var(--orange)] font-bold tabular-nums border border-[var(--orange)]/30 px-3 py-1 rounded-[2px]"
              >
                01 / 0{featured.length}
              </span>
            )}
            <MagneticButton to="/projeler" variant="outline-dark">
              <span>Tüm Projeleri Keşfet</span>
              <span aria-hidden="true">→</span>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Yatay Kart Şeridi */}
      <div
        ref={trackRef}
        data-cursor={usePinnedHorizontal ? 'view' : 'drag'}
        className={`relative z-10 mt-14 flex gap-6 sm:gap-8 px-5 sm:px-8 lg:px-12 ${
          usePinnedHorizontal
            ? 'w-max will-change-transform'
            : 'overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4'
        }`}
      >
        {featured.map((project, idx) => (
          <article
            key={project.id}
            data-horiz-card
            data-cursor="view"
            className="group relative shrink-0 w-[88vw] sm:w-[480px] lg:w-[540px] snap-center transition-all duration-300"
          >
            <TransitionLink
              to={`/projeler/${project.slug}`}
              className="block overflow-hidden rounded-[3px] border border-white/15 bg-[var(--navy-deep)]/90 backdrop-blur-sm transition-all duration-300 hover:border-[var(--orange)]/70 hover:shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--navy-deep)]">
                <ResponsiveImage
                  src={project.cover_image}
                  alt={`${project.title} — ${project.location}`}
                  sizes="(max-width: 768px) 88vw, 540px"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />

                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-[2px] bg-[var(--navy-deep)]/90 backdrop-blur-md px-3 py-1.5 border border-white/20">
                  <span className="font-industrial text-xs font-bold tracking-[0.18em] text-[var(--orange)]">
                    0{idx + 1}
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="font-industrial text-xs tracking-[0.16em] uppercase text-[var(--white)] font-semibold">
                    {project.category}
                  </span>
                </div>

                {/* Alttan kayan turuncu "Projeyi İncele" etiketi */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-[var(--orange)] px-5 py-3 text-[var(--white)] translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                  <span className="font-industrial text-xs font-bold tracking-[0.18em] uppercase">
                    Projeyi İncele
                  </span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between text-xs text-white/60 uppercase tracking-[0.14em]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--orange)]" />
                    {project.location}
                  </span>
                  <span className="font-industrial font-semibold">{project.year}</span>
                </div>
                <h3 className="mt-2.5 font-serif-heritage text-2xl sm:text-3xl font-semibold text-[var(--white)] line-clamp-2 leading-snug">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm text-white/70 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span className="truncate pr-4">{project.client}</span>
                  <span className="font-industrial tracking-[0.14em] uppercase text-white/90 font-bold shrink-0">
                    {project.duration}
                  </span>
                </div>
              </div>
            </TransitionLink>
          </article>
        ))}
      </div>
    </section>
  );
};
