import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { useSettings } from '../../api/queries';
import { TransitionLink } from '../PageTransition';
import { ResponsiveImage } from '../ResponsiveImage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useIsDesktop } from '../../hooks/useIsDesktop';

const LazyHeroParticles = lazy(() => import('../HeroParticles'));

interface HomeHeroProps {
  ready: boolean;
}

/**
 * Anasayfa Split-Screen Endüstriyel Hero:
 * - Sol Panel: 01 / İNŞAAT & DEMİRYOLU (Video arka plan, endüstriyel sans-serif başlık, şantiye metrikleri, CTA)
 * - Sağ Panel: 02 / POLİMER & HAMMADDE (Granül dokusu, endüstriyel sans-serif başlık, tonaj metrikleri, CTA)
 * - Merkez Hat: 50 Yıllık Miras Rozeti (1974 - 2026)
 * - Masaüstünde etkileşimli panel genişleme mikro animasyonu
 * - Mobilde iki güçlü dikey endüstriyel blok
 */
export const HomeHero: React.FC<HomeHeroProps> = ({ ready }) => {
  const heroRef = useRef<HTMLElement>(null);
  const leftWingRef = useRef<HTMLDivElement>(null);
  const rightWingRef = useRef<HTMLDivElement>(null);
  const centerBadgeRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const { isDesktop } = useIsDesktop();
  const [inView, setInView] = useState(true);
  const [isReady, setIsReady] = useState(ready);
  const [activeWing, setActiveWing] = useState<'none' | 'left' | 'right'>('none');

  const { data: settings = {} } = useSettings();

  const leftTop = settings.hero_headline_left_top || 'Geleceğin';
  const leftSub = settings.hero_headline_left_sub || 'Hatlarını';
  const leftOrange = settings.hero_headline_left_orange || 'Döşüyoruz.';
  const leftDesc = settings.hero_desc_left || '1974\'ten bu yana yüksek hızlı tren hatları, derin kaya tünelleri ve öngerilmeli viyadüklerle Türkiye\'nin en zorlu coğrafyalarında kalıcı mühendislik eserleri inşa ediyoruz.';
  const metric1Val = settings.hero_metric1_val || '2.450+';
  const metric1Lbl = settings.hero_metric1_lbl || 'Km Demiryolu';
  const metric2Val = settings.hero_metric2_val || '48+';
  const metric2Lbl = settings.hero_metric2_lbl || 'Köprü & Viyadük';

  const rightTop = settings.hero_headline_right_top || 'Sanayinin';
  const rightSub = settings.hero_headline_right_sub || 'Üretim';
  const rightOrange = settings.hero_headline_right_orange || 'Gücüyüz.';
  const rightDesc = settings.hero_desc_right || 'PE, PP, PVC, PET ve ABS granül sınıflarında küresel üreticilerden doğrudan ithalat, Gebze intermodal silo altyapısı ve akredite kalite kontrolüyle sanayiye kesintisiz hammadde sağlıyoruz.';
  const metric3Val = settings.hero_metric3_val || '320.000+';
  const metric3Lbl = settings.hero_metric3_lbl || 'Ton / Yıl Tedarik';
  const metric4Val = settings.hero_metric4_val || '24 Saat';
  const metric4Lbl = settings.hero_metric4_lbl || 'Hızlı Sevkiyat';
  const rightImg = settings.hero_image_right || '/media/plastic-granules.webp';

  // Failsafe: En geç 1.2s içinde açılış garantisi
  useEffect(() => {
    if (ready) {
      setIsReady(true);
    } else {
      const timer = window.setTimeout(() => setIsReady(true), 1200);
      return () => window.clearTimeout(timer);
    }
  }, [ready]);

  // Görünürlük takibi (Three.js sadece görünürken)
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split-Screen Açılış Animasyonu
  useEffect(() => {
    if (!isReady) return;
    const hero = heroRef.current;
    if (!hero) return;

    if (reducedMotion) return;

    const leftItems = leftWingRef.current?.querySelectorAll<HTMLElement>('[data-hero-split-item]');
    const rightItems = rightWingRef.current?.querySelectorAll<HTMLElement>('[data-hero-split-item]');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Sol ve Sağ panellerin stagger ile maskeli yükselişi
      if (leftItems && leftItems.length > 0) {
        tl.fromTo(
          leftItems,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0.1
        );
      }

      if (rightItems && rightItems.length > 0) {
        tl.fromTo(
          rightItems,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0.2
        );
      }

      // Merkez rozet belirir
      if (centerBadgeRef.current) {
        tl.fromTo(
          centerBadgeRef.current,
          { opacity: 0, scale: 0.75 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: 'back.out(1.7)',
          },
          0.4
        );
      }
    }, hero);

    return () => ctx.revert();
  }, [isReady, reducedMotion]);

  return (
    <section
      ref={heroRef}
      data-theme="dark"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[var(--navy-deep)] text-[var(--white)] pt-20"
    >
      {/* Three.js Kıvılcım Parçacıkları (Yalnızca Masaüstü & Görünürken) */}
      {isDesktop && !reducedMotion && inView && (
        <Suspense fallback={null}>
          <LazyHeroParticles />
        </Suspense>
      )}

      {/* Üst Endüstriyel Başlık & Kurumsal Slogan Şeridi */}
      <div className="relative z-20 border-b border-white/10 bg-[var(--navy-deep)]/90 backdrop-blur-md px-5 sm:px-8 lg:px-12 py-3.5">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 text-xs tracking-[0.2em] uppercase">
          <div className="flex items-center gap-2.5 text-[var(--orange)] font-industrial font-bold">
            <span className="h-2 w-2 rounded-full bg-[var(--orange)] animate-pulse" />
            <span>ACAR GRUP HOLDİNG · 1974&apos;TEN BERİ</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-white/70 font-industrial">
            <span>TÜRKİYE&apos;NİN ULAŞIM OMURGASI</span>
            <span className="text-[var(--orange)]">•</span>
            <span>SANAYİNİN KESİNTİSİZ HAMMADDE GÜCÜ</span>
          </div>
          <span className="font-industrial text-white/50 text-[11px]">
            50 YILLIK GÜVEN
          </span>
        </div>
      </div>

      {/* ANA SPLIT-SCREEN BÖLÜMÜ (Masaüstünde 50/50, Hover'da akıcı genişleme) */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
        
        {/* SOL KANAT: 01 / İNŞAAT & DEMİRYOLU TAAHHÜDÜ */}
        <div
          ref={leftWingRef}
          onMouseEnter={() => isDesktop && setActiveWing('left')}
          onMouseLeave={() => isDesktop && setActiveWing('none')}
          className={`group relative flex flex-col justify-between overflow-hidden p-6 sm:p-10 lg:p-14 xl:p-16 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            activeWing === 'left' ? 'lg:bg-[var(--navy-deep)]/40' : activeWing === 'right' ? 'lg:opacity-75' : ''
          }`}
        >
          {/* Arka Plan Video & Sinematik Görsel */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {isDesktop && !reducedMotion ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/media/hero-poster.webp"
                className="h-full w-full object-cover opacity-35 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              >
                <source src="/media/hero-railway.webm" type="video/webm" />
                <source src="/media/hero-railway.mp4" type="video/mp4" />
              </video>
            ) : (
              <ResponsiveImage
                src="/media/hero-railway.webp"
                alt="Acar Grup demiryolu inşaatı"
                priority={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover opacity-35 transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-[var(--navy-deep)]/80 to-[var(--navy-deep)]/50" />
          </div>

          {/* Sol Kanat İçerik */}
          <div className="relative z-10 flex flex-col h-full justify-between gap-10">
            {/* Üst Kod ve Kategori */}
            <div data-hero-split-item className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-industrial text-sm font-bold tracking-[0.25em] text-[var(--orange)]">
                  SEKTÖR 01
                </span>
                <span className="h-3.5 w-[1px] bg-white/25" />
                <span className="font-industrial text-xs tracking-[0.2em] uppercase text-white/80">
                  AĞIR ALTYAPI &amp; RAYLI SİSTEMLER
                </span>
              </div>
              <span className="hidden sm:inline-block font-industrial text-xs tracking-[0.16em] uppercase text-white/40">
                TAAHHÜT GRUBU
              </span>
            </div>

            {/* Başlık ve Açıklama */}
            <div className="my-auto py-6">
              <h2
                data-hero-split-item
                className="font-industrial text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight uppercase text-[var(--white)] leading-[0.92]"
              >
                {leftTop}
                <br />
                <span className="text-white/90">{leftSub}</span>
                <br />
                <span className="text-[var(--orange)]">{leftOrange}</span>
              </h2>

              <p
                data-hero-split-item
                className="mt-6 max-w-xl text-base sm:text-lg text-white/80 leading-[1.65]"
              >
                {leftDesc}
              </p>

              {/* Endüstriyel Metrikler */}
              <div
                data-hero-split-item
                className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-white/12 py-5"
              >
                <div>
                  <span className="block font-industrial text-2xl sm:text-3xl font-bold text-[var(--white)]">
                    {metric1Val}
                  </span>
                  <span className="block text-[11px] font-industrial tracking-[0.16em] uppercase text-white/60 mt-0.5">
                    {metric1Lbl}
                  </span>
                </div>
                <div>
                  <span className="block font-industrial text-2xl sm:text-3xl font-bold text-[var(--white)]">
                    {metric2Val}
                  </span>
                  <span className="block text-[11px] font-industrial tracking-[0.16em] uppercase text-white/60 mt-0.5">
                    {metric2Lbl}
                  </span>
                </div>
                <div>
                  <span className="block font-industrial text-2xl sm:text-3xl font-bold text-[var(--white)]">
                    A Grubu
                  </span>
                  <span className="block text-[11px] font-industrial tracking-[0.16em] uppercase text-white/60 mt-0.5">
                    Sınırsız Müteahhit
                  </span>
                </div>
              </div>
            </div>

            {/* Buton ve Yönlendirme */}
            <div data-hero-split-item className="pt-2">
              <TransitionLink
                to="/insaat"
                className="group/btn inline-flex items-center justify-between w-full sm:w-auto gap-6 rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/80 px-7 py-4 text-xs font-industrial font-bold tracking-[0.2em] uppercase text-[var(--white)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--orange)] hover:bg-[var(--orange)] hover:shadow-[0_0_24px_rgba(255,107,0,0.4)]"
              >
                <span>İnşaat Sektörünü İncele</span>
                <span
                  aria-hidden="true"
                  className="text-base transition-transform duration-300 group-hover/btn:translate-x-1.5"
                >
                  →
                </span>
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* SAĞ KANAT: 02 / POLİMER & PLASTİK HAMMADDE */}
        <div
          ref={rightWingRef}
          onMouseEnter={() => isDesktop && setActiveWing('right')}
          onMouseLeave={() => isDesktop && setActiveWing('none')}
          className={`group relative flex flex-col justify-between overflow-hidden p-6 sm:p-10 lg:p-14 xl:p-16 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            activeWing === 'right' ? 'lg:bg-[var(--navy-deep)]/40' : activeWing === 'left' ? 'lg:opacity-75' : ''
          }`}
        >
          {/* Arka Plan Granül Görseli */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <ResponsiveImage
              src={rightImg}
              alt="Acar Grup plastik hammadde granülleri"
              priority={true}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover opacity-35 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-[var(--navy-deep)]/80 to-[var(--navy-deep)]/50" />
          </div>

          {/* Sağ Kanat İçerik */}
          <div className="relative z-10 flex flex-col h-full justify-between gap-10">
            {/* Üst Kod ve Kategori */}
            <div data-hero-split-item className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-industrial text-sm font-bold tracking-[0.25em] text-[var(--orange)]">
                  SEKTÖR 02
                </span>
                <span className="h-3.5 w-[1px] bg-white/25" />
                <span className="font-industrial text-xs tracking-[0.2em] uppercase text-white/80">
                  POLİMER &amp; GRANÜL TEDARİKİ
                </span>
              </div>
              <span className="hidden sm:inline-block font-industrial text-xs tracking-[0.16em] uppercase text-white/40">
                HAMMADDE GRUBU
              </span>
            </div>

            {/* Başlık ve Açıklama */}
            <div className="my-auto py-6">
              <h2
                data-hero-split-item
                className="font-industrial text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight uppercase text-[var(--white)] leading-[0.92]"
              >
                {rightTop}
                <br />
                <span className="text-white/90">{rightSub}</span>
                <br />
                <span className="text-[var(--orange)]">{rightOrange}</span>
              </h2>

              <p
                data-hero-split-item
                className="mt-6 max-w-xl text-base sm:text-lg text-white/80 leading-[1.65]"
              >
                {rightDesc}
              </p>

              {/* Endüstriyel Metrikler */}
              <div
                data-hero-split-item
                className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-white/12 py-5"
              >
                <div>
                  <span className="block font-industrial text-2xl sm:text-3xl font-bold text-[var(--white)]">
                    {metric3Val}
                  </span>
                  <span className="block text-[11px] font-industrial tracking-[0.16em] uppercase text-white/60 mt-0.5">
                    {metric3Lbl}
                  </span>
                </div>
                <div>
                  <span className="block font-industrial text-2xl sm:text-3xl font-bold text-[var(--white)]">
                    5 Ana Grup
                  </span>
                  <span className="block text-[11px] font-industrial tracking-[0.16em] uppercase text-white/60 mt-0.5">
                    PE · PP · PVC · PET · ABS
                  </span>
                </div>
                <div>
                  <span className="block font-industrial text-2xl sm:text-3xl font-bold text-[var(--white)]">
                    {metric4Val}
                  </span>
                  <span className="block text-[11px] font-industrial tracking-[0.16em] uppercase text-white/60 mt-0.5">
                    {metric4Lbl}
                  </span>
                </div>
              </div>
            </div>

            {/* Buton ve Yönlendirme */}
            <div data-hero-split-item className="pt-2">
              <TransitionLink
                to="/plastik-hammadde"
                className="group/btn inline-flex items-center justify-between w-full sm:w-auto gap-6 rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/80 px-7 py-4 text-xs font-industrial font-bold tracking-[0.2em] uppercase text-[var(--white)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--orange)] hover:bg-[var(--orange)] hover:shadow-[0_0_24px_rgba(255,107,0,0.4)]"
              >
                <span>Hammadde Kataloğu &amp; Teklif</span>
                <span
                  aria-hidden="true"
                  className="text-base transition-transform duration-300 group-hover/btn:translate-x-1.5"
                >
                  →
                </span>
              </TransitionLink>
            </div>
          </div>
        </div>

      </div>

      {/* MERKEZ AMBLEM: 50 YILLIK MİRAS ROZETİ (Sadece Masaüstünde Dikey Hat Üzerinde Sabit) */}
      <div
        ref={centerBadgeRef}
        aria-hidden="true"
        className="hidden lg:flex pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex-col items-center justify-center rounded-full border border-white/25 bg-[var(--navy-deep)] h-20 w-20 shadow-[0_0_32px_rgba(0,0,0,0.8)]"
      >
        <span className="font-industrial text-[10px] font-bold tracking-[0.18em] text-[var(--orange)]">
          1974
        </span>
        <span className="font-industrial text-base font-bold text-[var(--white)] leading-none my-0.5">
          50. YIL
        </span>
        <span className="font-industrial text-[10px] tracking-[0.14em] text-white/60">
          2026
        </span>
      </div>

      {/* ALT ENTEGRE ENDÜSTRİYEL NAVİGASYON ŞERİDİ */}
      <div className="relative z-20 border-t border-white/10 bg-[var(--navy-deep)]/95 px-5 sm:px-8 lg:px-12 py-3.5">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between text-xs tracking-[0.18em] uppercase text-white/60">
          <span className="font-industrial">
            ← DEMİRYOLU, TÜNEL &amp; ALTYAPI TAAHHÜDÜ
          </span>
          <div className="flex items-center gap-2 text-[var(--orange)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--orange)]" />
            <span className="font-industrial font-semibold">AŞAĞI KAYDIRIN</span>
          </div>
          <span className="font-industrial">
            ENDÜSTRİYEL POLİMER &amp; GRANÜL LOJİSTİĞİ →
          </span>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
