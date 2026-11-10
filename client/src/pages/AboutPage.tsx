import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useMilestones, useStats, useSettings } from '../api/queries';
import { SEO } from '../components/SEO';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { SectionTitle } from '../components/SectionTitle';
import { Timeline } from '../components/Timeline';
import { StatsStrip } from '../components/home/StatsStrip';
import { CTASection } from '../components/home/CTASection';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';

const coreValues = [
  {
    code: '01',
    title: 'Vizyonumuz',
    text: 'Demiryolu ve yüksek mühendislik altyapısı ile endüstriyel polimer tedarikinde bölgesel ölçekte referans gösterilen, düşük karbonlu ve teknoloji odaklı lider Türk holdingi olmak.',
  },
  {
    code: '02',
    title: 'Misyonumuz',
    text: 'Kamu yararını, iş sağlığı güvenliğini ve mühendislik etiğini her şeyin üzerinde tutarak; ülke ulaşım omurgasını güçlendiren kalıcı eserler üretmek ve sanayicimize kesintisiz hammadde güvencesi sağlamak.',
  },
  {
    code: '03',
    title: 'Mühendislik Hassasiyeti',
    text: 'Milimetrik ray toleranslarından polimer MFI kararlılığına kadar tüm operasyonlarımızda uluslararası kalite standartlarını tavizsiz uygularız.',
  },
  {
    code: '04',
    title: 'Kuşaklararası Güven',
    text: '1974’ten bu yana işveren kurumlarımızla, tedarikçilerimizle ve çalışma arkadaşlarımızla kurduğumuz sözüne sadık kurumsal itibar en değerli sermayemizdir.',
  },
];

/**
 * Hakkımızda Sayfası (/hakkimizda):
 * - Vizyon / Misyon / Değerler kartları stagger girişli
 * - Yönetim Kurulu Başkanı mesajında portre görseli clip-path maske ile açılır;
 *   uzun mesaj metni ise yalnızca sade fade-in ile belirir (3.3 kuralı)
 * - 50 Yıllık Yolculuk Zaman Çizelgesi
 */
export const AboutPage: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const { data: milestones = [] } = useMilestones();
  const { data: stats = [] } = useStats();
  const { data: settings = {} } = useSettings();

  const valuesRef = useRef<HTMLElement>(null);
  const boardSectionRef = useRef<HTMLElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const messageTextRef = useRef<HTMLDivElement>(null);

  const chairmanName = settings.chairman_name || 'Yük. Müh. Selim Acar';
  const chairmanTitle = settings.chairman_title || 'Yönetim Kurulu Başkanı · Acar Grup Holding A.Ş.';
  const chairmanPortrait = settings.chairman_portrait || '/media/chairman-portrait.webp';
  const chairmanQuote = settings.chairman_quote || '“Bir ülkenin yarınlarına bırakılabilecek en sağlam miras, güvenle döşenmiş hatlar ve kesintisiz üreten fabrikalardır.”';
  const chairmanLetter = settings.chairman_letter || `Değerli İş Ortaklarımız ve Paydaşlarımız,\n\n1974 yılında kurucumuz Kemal Acar’ın Anadolu’daki ilk köprü şantiyesinde yaktığı mühendislik meşalesi, bugün 50 yılı geride bırakmış güçlü bir kurumsal çınara dönüşmüştür. Yarım asır boyunca ekonomik döngüler ve teknolojiler değişirken, Acar Grup’un hiç değişmeyen tek pusulası taahhüt ettiği işi en yüksek mühendislik standartlarında ve zamanında teslim etme sorumluluğu olmuştur.\n\nBugün bir yandan yüksek hızlı demiryolu koridorları, derin tüneller ve anıtsal viyadüklerle şehirlerimizi birbirine bağlarken; diğer yandan Gebze intermodal polimer üssümüzden yüzlerce sanayi kuruluşumuza PE, PP, PVC, PET ve ABS hammadde tedarik ederek üretim çarklarının durmaksızın dönmesine omuz veriyoruz.\n\nÖnümüzdeki yarım yüzyılda da döngüsel polimer ekonomisi, düşük karbonlu yeşil altyapı ve dijital şantiye teknolojilerine yaptığımız yatırımlarla ülkemiz için kalıcı değer üretmeye devam edeceğiz.`;

  const dynamicValues = [
    { ...coreValues[0], text: settings.about_vision || coreValues[0].text },
    { ...coreValues[1], text: settings.about_mission || coreValues[1].text },
    { ...coreValues[2], text: settings.about_precision || coreValues[2].text },
    { ...coreValues[3], text: settings.about_heritage || coreValues[3].text },
  ];

  useScrollReveal(valuesRef, { selector: '[data-value-card]', y: 26, stagger: 0.09 });

  useEffect(() => {
    const section = boardSectionRef.current;
    if (!section || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Portre görseli maske ile açılır (clip-path)
      if (portraitWrapRef.current) {
        gsap.fromTo(
          portraitWrapRef.current,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 76%',
              once: true,
            },
          }
        );
      }

      // Uzun mesaj paragrafları: sadece basit fade-in (3.3 kuralı)
      if (messageTextRef.current) {
        gsap.fromTo(
          messageTextRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.85,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 76%',
              once: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      <SEO
        title="Hakkımızda — 1974'ten Beri Kurumsal Miras"
        description="Acar Grup Holding A.Ş.'nin 1974 yılında başlayan mühendislik yolculuğunu, vizyonunu, değerlerini ve yönetim kurulu mesajını keşfedin."
        path="/hakkimizda"
        image="/media/industrial-building.webp"
      />

      <PageHeroBanner
        eyebrow="KURUMSAL KİMLİK · 1974'TEN BERİ"
        title="Yarım Asırlık Güven, Geleceğe Uzanan Mühendislik"
        subtitle="İki kuşaktır değişmeyen ciddiyet, sözleşme sadakati ve teknik mükemmeliyet ilkeleriyle Türkiye'nin stratejik altyapı ve sanayi ekosistemine değer katıyoruz."
        image="/media/industrial-building.webp"
        imageAlt="Acar Grup genel merkez kulesi mimari görünümü"
        breadcrumbs={[{ label: 'Anasayfa', to: '/' }, { label: 'Hakkımızda' }]}
      />

      <StatsStrip stats={stats} />

      {/* Vizyon, Misyon ve Değerler (Açık Zemin --paper) */}
      <section
        ref={valuesRef}
        data-theme="light"
        className="bg-[var(--paper)] text-[var(--navy)] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionTitle
            eyebrow="TEMEL İLKELERİMİZ"
            title="Vizyon, Misyon ve Kurumsal Değerlerimiz"
            theme="light"
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {dynamicValues.map((val) => (
              <article
                key={val.code}
                data-value-card
                className="group rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)] p-8 sm:p-10 shadow-[0_2px_12px_rgba(10,37,64,0.04)] transition-all duration-300 hover:border-[var(--navy)]/40 hover:shadow-[0_12px_28px_rgba(10,37,64,0.1)] hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <span className="font-industrial text-sm font-bold tracking-[0.2em] text-[var(--navy)]">
                    {val.code}
                  </span>
                  <span className="h-[2px] w-8 bg-[var(--orange)]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif-heritage text-3xl font-semibold text-[var(--navy)]">
                  {val.title}
                </h3>
                <p className="mt-3 text-base text-[var(--ink)] leading-[1.65]">
                  {val.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Yönetim Kurulu Başkanı Mesajı (Portre Maske Açılışlı) */}
      <section
        ref={boardSectionRef}
        data-theme="dark"
        className="bg-[var(--navy)] text-[var(--white)] grain-surface py-24 sm:py-32"
      >
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div
                ref={portraitWrapRef}
                className="overflow-hidden rounded-[3px] border border-white/15 bg-[var(--navy-deep)]"
              >
                <ResponsiveImage
                  src={chairmanPortrait}
                  alt={`${chairmanName} — Acar Grup Yönetim Kurulu Başkanı`}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="mt-5 border-l-2 border-[var(--orange)] pl-4">
                <p className="font-serif-heritage text-2xl font-semibold text-[var(--white)]">
                  {chairmanName}
                </p>
                <p className="text-xs font-industrial tracking-[0.18em] uppercase text-white/65 mt-0.5">
                  {chairmanTitle}
                </p>
              </div>
            </div>

            <div ref={messageTextRef} className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-[2px] w-8 bg-[var(--orange)]" aria-hidden="true" />
                <span className="font-industrial text-xs font-semibold tracking-[0.22em] uppercase text-[var(--orange)]">
                  YÖNETİM KURULU MESAJI
                </span>
              </div>

              <h2 className="section-heading text-[var(--white)]">
                {chairmanQuote}
              </h2>

              <div className="mt-7 space-y-5 text-base sm:text-lg text-white/78 leading-[1.68] whitespace-pre-line">
                {chairmanLetter}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 50 Yıllık Yolculuk (Açık Zemin Üzerinde Ray Metaforu) */}
      <Timeline milestones={milestones} theme="light" />

      <CTASection />
    </>
  );
};

export default AboutPage;

