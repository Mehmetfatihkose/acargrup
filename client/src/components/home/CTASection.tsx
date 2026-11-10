import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { MagneticButton } from '../MagneticButton';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSettings } from '../../api/queries';

interface CTASectionProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

/**
 * Kurumsal İletişime Çağrı (CTA) Bölümü:
 * - navy -> turuncu yumuşak gradyan zemin (.bg-cta-gradient)
 * - Dev metin kelime kelime scroll ile belirir
 * - "Bize Ulaşın" butonu manyetik efektli, hover'da beyaz dolgu akar (variant="cta-white")
 * - Dinamik site_settings entegrasyonu (Admin panelinden güncellenebilir)
 */
export const CTASection: React.FC<CTASectionProps> = ({
  eyebrow = 'YENİ PROJELER VE TEDARİK İŞ BİRLİKLERİ',
  heading,
  description,
  primaryLabel,
  primaryTo = '/iletisim',
  secondaryLabel,
  secondaryTo = '/plastik-hammadde#teklif-formu',
}) => {
  const { data: settings = {} } = useSettings();
  const activeHeading = heading || settings.cta_heading || 'Büyük Ölçekli Altyapı ve Kesintisiz Hammadde İçin Güçlerimizi Birleştirelim.';
  const activeDescription = description || settings.cta_desc || 'Demiryolu, altyapı taahhüt projeleriniz veya yüksek tonajlı polimer hammadde talepleriniz için mühendislik ve satış ekiplerimizle doğrudan iletişime geçin.';
  const activePrimaryLabel = primaryLabel || settings.cta_primary_label || 'Bize Ulaşın';
  const activeSecondaryLabel = secondaryLabel || settings.cta_secondary_label || 'Fiyat Teklifi İste';

  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const words = activeHeading.split(' ');

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;

    const wordEls = el.querySelectorAll<HTMLElement>('[data-cta-word]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordEls,
        { opacity: 0.16, y: 18, willChange: 'transform, opacity' },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.05,
          ease: 'power3.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [activeHeading, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative bg-cta-gradient text-[var(--white)] grain-surface py-24 sm:py-32 overflow-hidden border-t border-white/10"
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-[2px] w-8 bg-[var(--orange)]" aria-hidden="true" />
            <span className="font-industrial text-xs font-semibold tracking-[0.22em] uppercase text-white/90">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-serif-heritage text-[clamp(2.2rem,5.2vw,4.75rem)] leading-[1.08] font-semibold text-[var(--white)] flex flex-wrap gap-x-3 gap-y-1">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} data-cta-word className="inline-block">
                {word}
              </span>
            ))}
          </h2>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/80 leading-[1.65]">
            {activeDescription}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton to={primaryTo} variant="cta-white">
              <span>{activePrimaryLabel}</span>
              <span aria-hidden="true">→</span>
            </MagneticButton>

            {activeSecondaryLabel && secondaryTo && (
              <MagneticButton to={secondaryTo} variant="orange">
                <span>{activeSecondaryLabel}</span>
              </MagneticButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

