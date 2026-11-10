import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { SectionTitle } from '../SectionTitle';
import { MagneticButton } from '../MagneticButton';
import { ResponsiveImage } from '../ResponsiveImage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { useSettings } from '../../api/queries';

const storyVisuals = [
  {
    src: '/media/viaduct-bridge.webp',
    alt: 'Acar Grup yüksek açıklıklı demiryolu viyadüğü inşaatı',
    caption: '01 · Demiryolu, Köprü ve Viyadük Mühendisliği',
    detail: '94 metreye ulaşan ayak yükseklikleri ve dengeli konsol teknolojisi.',
  },
  {
    src: '/media/tunnel-tbm.webp',
    alt: 'Çift tüp TBM demiryolu tüneli iç görünümü',
    caption: '02 · Derin Kaya Tünelleri ve Altyapı Sistemleri',
    detail: 'TBM ve NATM metodolojileriyle sıfır hata toleranslı yeraltı yapıları.',
  },
  {
    src: '/media/plastic-granules.webp',
    alt: 'Endüstriyel PE PP PVC polimer hammadde granülleri',
    caption: '03 · Küresel Polimer ve Plastik Hammadde Tedariki',
    detail: 'Gebze intermodal silo terminalinden Türkiye sanayiine kesintisiz sevkiyat.',
  },
];

/**
 * Grup Hakkında Bölümü (Açık Zemin --paper):
 * - Sol metin masaüstünde sticky kalır
 * - Sağdaki görseller scroll ile birbirini clip-path maskeyle değiştirir ve çerçeve içinde hafif parallax yapar
 * - Uzun paragraflarda yalnızca sade fade-in uygulanır (3.3 kuralı)
 * - Dinamik site_settings entegrasyonu (Admin panelinden yönetilebilir)
 */
export const AboutGroupSection: React.FC = () => {
  const { data: settings = {} } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const visualStageRef = useRef<HTMLDivElement>(null);
  const textFadeRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const { isDesktop } = useIsDesktop();

  const eyebrow = settings.about_group_eyebrow || "ACAR GRUP HAKKINDA · 1974'TEN BERİ";
  const title = settings.about_group_title || "Yarım Asırlık Mühendislik ve Tedarik Disiplini";
  const lead1 = settings.about_group_lead1 || "1974 yılında kamu altyapı ve köprü taahhütleriyle temelleri atılan Acar Grup, yarım asır boyunca Türkiye'nin en çetin coğrafyalarında demiryolu hatları, yüksek viyadükler, derin tüneller ve otoyol koridorları inşa ederek mühendislik güveninin simgesi haline gelmiştir.";
  const lead2 = settings.about_group_lead2 || "Grubumuzun ikinci stratejik sütununu oluşturan plastik hammadde tedarik operasyonlarımız ise, küresel petrokimya devleriyle kurulan doğrudan iş birlikleri ve intermodal silo altyapısıyla binlerce sanayi kuruluşuna kesintisiz üretim gücü sunmaktadır.";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Uzun okuma metni: sadece basit fade-in (3.3 kuralı)
      if (textFadeRef.current) {
        gsap.fromTo(
          textFadeRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: textFadeRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Masaüstünde sağ görsellerin clip-path ile maskeli geçişi ve hafif çerçeve içi parallax
      if (isDesktop && visualStageRef.current) {
        const layers = gsap.utils.toArray<HTMLElement>('[data-about-layer]');
        const innerImgs = gsap.utils.toArray<HTMLElement>('[data-about-img]');

        if (layers.length >= 3) {
          gsap.set(layers[1], { clipPath: 'inset(100% 0% 0% 0%)' });
          gsap.set(layers[2], { clipPath: 'inset(100% 0% 0% 0%)' });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
            },
          });

          tl.to(layers[1], { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 0);
          tl.to(layers[2], { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 1);
        }

        innerImgs.forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.1, yPercent: -5 },
            {
              scale: 1.1,
              yPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion, isDesktop, lead1, lead2, title]);

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="relative bg-[var(--paper)] text-[var(--navy)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 ${
            isDesktop && !reducedMotion ? 'lg:min-h-[210vh]' : ''
          }`}
        >
          {/* Sol Sütun: Sticky Kurumsal Anlatı */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionTitle
                eyebrow={eyebrow}
                title={title}
                theme="light"
              />

              <div ref={textFadeRef} className="mt-6 space-y-5 text-[var(--ink)] text-base leading-[1.65]">
                <p>
                  {lead1}
                </p>
                <p>
                  {lead2}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--navy)]/12 grid grid-cols-2 gap-6">
                <div>
                  <span className="block font-industrial text-2xl font-bold text-[var(--navy)]">
                    ISO 9001 · 14001 · 45001
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-[var(--gray)]">
                    Entegre Kalite &amp; İSG
                  </span>
                </div>
                <div>
                  <span className="block font-industrial text-2xl font-bold text-[var(--navy)]">
                    A Grubu Sınırsız
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-[var(--gray)]">
                    Müteahhitlik Yetki Belgesi
                  </span>
                </div>
              </div>

              <div className="mt-9">
                <MagneticButton to="/hakkimizda" variant="outline-light">
                  <span>Kurumsal Hikayemiz</span>
                  <span aria-hidden="true">→</span>
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Sağ Sütun: Masaüstünde Sticky Clip-Path Maskeli Görsel Sahnesi / Mobilde Kart Akışı */}
          <div className="lg:col-span-7">
            {isDesktop && !reducedMotion ? (
              <div
                ref={visualStageRef}
                className="sticky top-28 h-[72vh] max-h-[680px] w-full overflow-hidden rounded-[3px] border border-[var(--navy)]/15 bg-[var(--navy-deep)]"
              >
                {storyVisuals.map((item, idx) => (
                  <div
                    key={item.src}
                    data-about-layer
                    style={{ zIndex: idx + 1 }}
                    className="absolute inset-0 overflow-hidden bg-[var(--navy-deep)]"
                  >
                    <div data-about-img className="h-full w-full">
                      <ResponsiveImage
                        src={item.src}
                        alt={item.alt}
                        sizes="58vw"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--navy-deep)]/95 via-[var(--navy-deep)]/60 to-transparent p-8 text-[var(--white)]">
                      <div className="flex items-center gap-3">
                        <span className="h-[2px] w-6 bg-[var(--orange)]" aria-hidden="true" />
                        <span className="font-industrial text-xs font-semibold tracking-[0.2em] uppercase text-[var(--orange)]">
                          {item.caption}
                        </span>
                      </div>
                      <p className="mt-2 font-serif-heritage text-2xl font-medium text-white/95">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {storyVisuals.map((item) => (
                  <div
                    key={item.src}
                    className="overflow-hidden rounded-[3px] border border-[var(--navy)]/15 bg-[var(--navy-deep)]"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      <ResponsiveImage
                        src={item.src}
                        alt={item.alt}
                        sizes="100vw"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5 text-[var(--white)]">
                      <span className="font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-[var(--orange)]">
                        {item.caption}
                      </span>
                      <p className="mt-1 text-sm text-white/80">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

