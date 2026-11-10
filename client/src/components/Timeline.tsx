import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import type { Milestone } from '../api/types';
import { SectionTitle } from './SectionTitle';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useIsDesktop } from '../hooks/useIsDesktop';

interface TimelineProps {
  milestones: Milestone[];
  theme?: 'dark' | 'light';
}

/**
 * 50 Yıllık Yolculuk — Zaman Çizelgesi (Ray Metaforu):
 * - Gri ince "ray" çizgisi dikey uzanır; scroll'a bağlı (scrub) turuncu çizgi rayı doldurur
 *   ve ucunda parlayan turuncu ışık noktası (lokomotif feneri) ilerler.
 * - Düğüme ulaşıldığında düğüm büyüyüp turuncu olur, kart soldan/sağdan fade+kayma ile belirir.
 * - Dev ve soluk (%15 opaklık) arka plan yıl rakamları parallax ile hareket eder.
 */
export const Timeline: React.FC<TimelineProps> = ({ milestones, theme = 'dark' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const orangeRailRef = useRef<HTMLDivElement>(null);
  const trainLightRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const { isDesktop } = useIsDesktop();
  const isDark = theme === 'dark';

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackWrapperRef.current;
    if (!section || !track || milestones.length === 0) return;

    if (reducedMotion) {
      if (orangeRailRef.current) gsap.set(orangeRailRef.current, { scaleY: 1 });
      return;
    }

    let refreshHandler: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // Turuncu ray dolumu + ucundaki parlayan tren ışığı (scrub)
      if (orangeRailRef.current && trainLightRef.current) {
        gsap.set(orangeRailRef.current, { scaleY: 0, transformOrigin: '50% 0%' });

        let cachedTotalH = track.offsetHeight;

        refreshHandler = () => {
          if (track) cachedTotalH = track.offsetHeight;
        };
        ScrollTrigger.addEventListener('refresh', refreshHandler);

        gsap.to(orangeRailRef.current, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: 'top 68%',
            end: 'bottom 68%',
            scrub: 0.35,
            onUpdate: (self) => {
              if (trainLightRef.current) {
                const yPos = self.progress * cachedTotalH;
                trainLightRef.current.style.transform = `translate3d(-50%, ${yPos}px, 0)`;
              }
            },
          },
        });
      }

      // Her yıl düğümü ve kartı için giriş animasyonları + dev yıl parallax
      const items = gsap.utils.toArray<HTMLElement>('[data-milestone-item]');
      items.forEach((item, idx) => {
        const node = item.querySelector<HTMLElement>('[data-milestone-node]');
        const card = item.querySelector<HTMLElement>('[data-milestone-card]');
        const bgYear = item.querySelector<HTMLElement>('[data-milestone-bgyear]');
        const fromLeft = idx % 2 === 0;

        if (node) {
          gsap.fromTo(
            node,
            { scale: 0.75, backgroundColor: isDark ? '#0A2540' : '#F5F7FA' },
            {
              scale: 1.25,
              backgroundColor: '#FF6B00',
              borderColor: '#FF6B00',
              duration: 0.45,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 70%',
                once: true,
              },
            }
          );
        }

        if (card) {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              x: isDesktop ? (fromLeft ? -36 : 36) : 20,
              willChange: 'transform, opacity',
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power3.out',
              clearProps: 'willChange',
              scrollTrigger: {
                trigger: item,
                start: 'top 74%',
                once: true,
              },
            }
          );
        }

        if (bgYear && isDesktop) {
          gsap.fromTo(
            bgYear,
            { yPercent: 18 },
            {
              yPercent: -22,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    }, section);

    return () => {
      if (refreshHandler) {
        ScrollTrigger.removeEventListener('refresh', refreshHandler);
      }
      ctx.revert();
    };
  }, [milestones, reducedMotion, isDesktop, isDark]);

  return (
    <section
      ref={sectionRef}
      id="yolculuk"
      data-theme={isDark ? 'dark' : 'light'}
      className={`relative py-24 sm:py-32 overflow-hidden ${
        isDark
          ? 'bg-[var(--navy-deep)] text-[var(--white)] grain-surface'
          : 'bg-[var(--paper)] text-[var(--navy)]'
      }`}
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionTitle
          eyebrow="1974'TEN BUGÜNE · RAYLAR ÜZERİNDE YARIM ASIR"
          title="50 Yıllık Yolculuk"
          description="Anadolu'nun sarp vadilerindeki ilk köprü şantiyesinden yüksek hızlı tren koridorlarına ve küresel polimer tedarik üslerine uzanan kesintisiz güven çizgisi."
          theme={theme}
          align="center"
        />

        {/* Ray Hattı Kapsayıcısı */}
        <div ref={trackWrapperRef} className="relative mt-20 sm:mt-24">
          {/* Gri İnce İkiz Demiryolu Rayı ve Travers Çentikleri */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-5 md:left-1/2 md:-translate-x-1/2 w-[10px] flex justify-between pointer-events-none"
          >
            <span
              className={`h-full w-[1px] ${
                isDark ? 'bg-white/18' : 'bg-[var(--gray)]/35'
              }`}
            />
            <span
              className={`h-full w-[1px] ${
                isDark ? 'bg-white/18' : 'bg-[var(--gray)]/35'
              }`}
            />
          </div>

          {/* Merkezde Dolmakta Olan Turuncu Ray Çizgisi */}
          <div
            ref={orangeRailRef}
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[24px] md:left-1/2 md:-translate-x-1/2 w-[2px] bg-[var(--orange)] pointer-events-none"
          />

          {/* Ray Ucunda Hareket Eden Parlayan Turuncu Işık Noktası (Tren) */}
          {!reducedMotion && (
            <div
              ref={trainLightRef}
              aria-hidden="true"
              style={{ transform: 'translate3d(-50%, 0px, 0)' }}
              className="pointer-events-none absolute top-0 left-[25px] md:left-1/2 z-20 h-4 w-4 -mt-2 rounded-full bg-[var(--orange)] shadow-[0_0_20px_6px_rgba(255,107,0,0.65)]"
            >
              <span className="block h-1.5 w-1.5 m-[5px] rounded-full bg-[var(--white)]" />
            </div>
          )}

          {/* Dönüm Noktası Satırları */}
          <div className="space-y-16 sm:space-y-24">
            {milestones.map((milestone, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={milestone.id || milestone.year}
                  data-milestone-item
                  className="relative grid grid-cols-1 md:grid-cols-12 items-center"
                >
                  {/* Arka Plan Dev Soluk (%15 opaklık) Yıl Rakamı Parallax */}
                  <span
                    data-milestone-bgyear
                    aria-hidden="true"
                    className={`pointer-events-none select-none hidden sm:block absolute top-1/2 -translate-y-1/2 font-industrial text-[7rem] lg:text-[10rem] font-bold leading-none text-[var(--gray)] opacity-15 ${
                      isLeft ? 'right-4 md:right-[8%]' : 'left-12 md:left-[8%]'
                    }`}
                  >
                    {milestone.year}
                  </span>

                  {/* Ray Üzerindeki Yıl Düğümü */}
                  <div
                    data-milestone-node
                    aria-hidden="true"
                    className={`absolute left-[18px] md:left-1/2 md:-translate-x-1/2 z-10 h-3.5 w-3.5 rounded-full border-2 ${
                      isDark
                        ? 'border-white/50 bg-[var(--navy-deep)]'
                        : 'border-[var(--gray)] bg-[var(--paper)]'
                    }`}
                  />

                  {/* Kart Yerleşimi (Masaüstünde Sol / Sağ Dönüşümlü) */}
                  <div
                    className={`pl-14 md:pl-0 ${
                      isLeft
                        ? 'md:col-span-5 md:col-start-1 md:pr-10 md:text-right'
                        : 'md:col-span-5 md:col-start-8 md:pl-10 md:text-left'
                    }`}
                  >
                    <article
                      data-milestone-card
                      className={`relative rounded-[3px] border p-6 sm:p-8 ${
                        isDark
                          ? 'bg-[var(--navy)]/85 border-white/12'
                          : 'bg-[var(--white)] border-[var(--navy)]/12'
                      }`}
                    >
                      <span
                        className={`font-industrial text-3xl sm:text-4xl font-bold tracking-wider ${
                          isDark ? 'text-[var(--orange)]' : 'text-[var(--navy)]'
                        }`}
                      >
                        {milestone.year}
                      </span>
                      <div
                        className={`mt-2 h-[2px] w-10 bg-[var(--orange)] ${
                          isLeft ? 'md:ml-auto' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <h3
                        className={`mt-3 font-serif-heritage text-2xl font-semibold ${
                          isDark ? 'text-[var(--white)]' : 'text-[var(--navy)]'
                        }`}
                      >
                        {milestone.title}
                      </h3>
                      <p
                        className={`mt-2.5 text-sm sm:text-base leading-[1.65] ${
                          isDark ? 'text-white/75' : 'text-[var(--ink)]'
                        }`}
                      >
                        {milestone.description}
                      </p>
                    </article>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

