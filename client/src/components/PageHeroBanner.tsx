import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { TransitionLink, usePageTransition } from './PageTransition';
import { ResponsiveImage } from './ResponsiveImage';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useIsDesktop } from '../hooks/useIsDesktop';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeroBannerProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  breadcrumbs: BreadcrumbItem[];
  multiLayerGranules?: boolean;
}

/**
 * İç Sayfa Başlık Bandı:
 * - Görselde scroll parallax
 * - Sayfa geçiş perdesi açılırken maskeli yükselen tek h1 başlığı
 * - Breadcrumb fade-in
 */
export const PageHeroBanner: React.FC<PageHeroBannerProps> = ({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  breadcrumbs,
  multiLayerGranules = false,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerFrontRef = useRef<HTMLDivElement>(null);
  const titleInnerRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const { isDesktop } = useIsDesktop();
  const { revealTick } = usePageTransition();

  // Başlık maskeli yükselme + Breadcrumb fade-in
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      if (titleInnerRef.current) gsap.set(titleInnerRef.current, { yPercent: 0, opacity: 1 });
      if (metaRef.current) gsap.set(metaRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (titleInnerRef.current) {
        gsap.fromTo(
          titleInnerRef.current,
          { yPercent: 108, willChange: 'transform' },
          {
            yPercent: 0,
            duration: 0.95,
            ease: 'expo.out',
            clearProps: 'willChange',
          }
        );
      }

      if (metaRef.current) {
        gsap.fromTo(
          metaRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: 0.15,
            ease: 'power3.out',
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [revealTick, reducedMotion]);

  // Görsel Parallax (ve Plastik Hammadde için çok katmanlı granül parallax)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const parallaxDistance = isDesktop ? 16 : 6;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { yPercent: -parallaxDistance / 2, scale: 1.08 },
          {
            yPercent: parallaxDistance,
            scale: 1.14,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      if (multiLayerGranules && isDesktop) {
        if (layerMidRef.current) {
          gsap.to(layerMidRef.current, {
            yPercent: -28,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
        if (layerFrontRef.current) {
          gsap.to(layerFrontRef.current, {
            yPercent: -48,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion, isDesktop, multiLayerGranules]);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative min-h-[58vh] lg:min-h-[66vh] flex items-end overflow-hidden bg-[var(--navy-deep)] grain-surface pt-32 pb-16 sm:pb-20"
    >
      {/* Arka Plan Parallax Görseli */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <ResponsiveImage
          src={image}
          alt={imageAlt}
          priority={true}
          sizes="100vw"
          className="h-full w-full object-cover opacity-45"
        />
      </div>

      {/* Çok Katmanlı Granül Makro Parallax Katmanları (Yalnızca /plastik-hammadde) */}
      {multiLayerGranules && (
        <>
          <div
            ref={layerMidRef}
            aria-hidden="true"
            className="hidden md:block pointer-events-none absolute inset-0 z-[1]"
          >
            <span className="absolute top-[26%] right-[18%] h-5 w-7 rotate-12 rounded-[3px] bg-[var(--orange)]/45 blur-[1px]" />
            <span className="absolute top-[52%] right-[32%] h-4 w-6 -rotate-12 rounded-[3px] bg-white/30 blur-[1px]" />
            <span className="absolute top-[36%] left-[62%] h-6 w-8 rotate-45 rounded-[3px] bg-[var(--navy-light)]/75 border border-white/15" />
          </div>
          <div
            ref={layerFrontRef}
            aria-hidden="true"
            className="hidden md:block pointer-events-none absolute inset-0 z-[1]"
          >
            <span className="absolute bottom-[22%] right-[12%] h-8 w-11 -rotate-6 rounded-[4px] bg-[var(--orange)]/55 blur-[2px]" />
            <span className="absolute top-[22%] right-[8%] h-7 w-9 rotate-30 rounded-[4px] bg-white/25 blur-[2px]" />
            <span className="absolute bottom-[30%] right-[26%] h-6 w-9 rotate-12 rounded-[3px] bg-[var(--orange)]/35 blur-[1.5px]" />
          </div>
        </>
      )}

      {/* Kurumsal Lacivert Gradyan Örtü */}
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-hero-gradient" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div ref={metaRef}>
          {/* Breadcrumb */}
          <nav aria-label="Sayfa konumu" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs tracking-[0.16em] uppercase text-white/65">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.label}>
                  {idx > 0 && <li aria-hidden="true" className="text-[var(--orange)]">/</li>}
                  <li>
                    {crumb.to ? (
                      <TransitionLink
                        to={crumb.to}
                        className="transition-colors hover:text-[var(--white)]"
                      >
                        {crumb.label}
                      </TransitionLink>
                    ) : (
                      <span className="text-[var(--white)] font-semibold">{crumb.label}</span>
                    )}
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>

          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-[var(--orange)]" aria-hidden="true" />
            <span className="font-industrial text-xs font-semibold tracking-[0.22em] uppercase text-[var(--orange)]">
              {eyebrow}
            </span>
          </div>
        </div>

        {/* Maskeli Yükselen Ana Başlık (Tek h1 Kuralı) */}
        <div className="overflow-hidden pb-2">
          <h1
            ref={titleInnerRef}
            className="font-serif-heritage text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] font-semibold text-[var(--white)] max-w-4xl"
          >
            {title}
          </h1>
        </div>

        <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/78 leading-[1.65]">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

