import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from '../lib/gsap';
import type { Project } from '../api/types';
import { useCertificates, useMilestones, useProjects, useSettings } from '../api/queries';
import { SEO } from '../components/SEO';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { SectionTitle } from '../components/SectionTitle';
import { ProjectCard } from '../components/ProjectCard';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { CTASection } from '../components/home/CTASection';
import { TransitionLink } from '../components/PageTransition';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';

const serviceAreas = [
  {
    code: '01',
    title: 'Demiryolu & Raylı Sistemler',
    description:
      'Yüksek hızlı tren (YHT) koridorları, balastlı ve rijit (slab-track) üstyapı serimi, UIC 60 alüminotermik ray kaynağı, katener elektrifikasyon ve ERTMS/ETCS sinyalizasyon projeleri.',
    iconPath: 'M4 19L9 5h6l5 14M7.5 14h9M6 18h12M9.2 9h5.6',
  },
  {
    code: '02',
    title: 'Köprü & Viyadük Mühendisliği',
    description:
      'Derin vadileri aşan dengeli konsol (balanced cantilever) demiryolu ve otoyol viyadükleri, ardgerme kutu kesitli tabliyeler ve sismik izolatörlü ağır yük köprüleri.',
    iconPath: 'M2 18h20M4 18v-6c3-4 13-4 16 0v6M8 18v-5M12 18v-6M16 18v-5',
  },
  {
    code: '03',
    title: 'Tünel & Yeraltı Yapıları',
    description:
      'Tam kesit tünel açma makineleri (TBM) ve NATM metodolojisiyle inşa edilen çift tüp demiryolu, otoyol ve basınçlı içme suyu/enerji iletim tünelleri.',
    iconPath: 'M4 20V12a8 8 0 0 1 16 0v8M8 20v-7a4 4 0 0 1 8 0v7M2 20h20',
  },
  {
    code: '04',
    title: 'Karayolu & Otoyol Koridorları',
    description:
      'Yüksek standartlı bölünmüş yollar, çok katmanlı lojistik kavşaklar, toprak işleri ve ağır taşıt trafiğine dayanıklı polimer modifiye taş mastik asfalt (SMA) kaplamalar.',
    iconPath: 'M6 20L10 4M18 20L14 4M12 6v3M12 12v3M12 18v2',
  },
  {
    code: '05',
    title: 'Altyapı & Su Sanat Yapıları',
    description:
      'Baraj isale hatları, ileri biyolojik içme suyu arıtma tesisleri, yağmur suyu/atık su kolektörleri, istinat ve derin kazı iksa mühendisliği.',
    iconPath: 'M3 16c3-3 6 3 9 0s6 3 9 0M3 11c3-3 6 3 9 0s6 3 9 0M5 20h14',
  },
  {
    code: '06',
    title: 'Endüstriyel & Kurumsal Üstyapı',
    description:
      'LEED sertifikalı yönetim kuleleri, demiryolu iltisak hatlı intermodal lojistik depolar, fabrika kampüsleri ve yüksek sismik güvenlikli çelik-betonarme yapılar.',
    iconPath: 'M4 20V6l8-3 8 3v14M9 20v-5h6v5M8 10h2M14 10h2M8 13h2M14 13h2',
  },
];

const filterTabs = ['Tümü', 'Demiryolu', 'Karayolu', 'Altyapı', 'Bina'] as const;

const introText =
  '1974 yılından bu yana Türkiye’nin en zorlu topoğrafyalarında mühendislik sınırlarını aşan Acar Grup İnşaat Grubu; yüksek hızlı demiryolu hatlarından sismik izolatörlü viyadüklere, TBM derin tünellerden intermodal sanayi yapılarına kadar kalıcı eserler üretmektedir.';

/**
 * Hizmet Kartı: Hover'da 6px yükselir, SVG ikon stroke-dashoffset ile yeniden çizilir, alt çizgi uzar.
 */
const ServiceCard: React.FC<{
  item: (typeof serviceAreas)[number];
  reducedMotion: boolean;
}> = ({ item, reducedMotion }) => {
  const pathRef = useRef<SVGPathElement>(null);

  const handleMouseEnter = () => {
    if (reducedMotion || !pathRef.current) return;
    const path = pathRef.current;
    const len = path.getTotalLength ? path.getTotalLength() : 120;
    gsap.killTweensOf(path);
    gsap.fromTo(
      path,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 0.65, ease: 'power3.out' }
    );
  };

  return (
    <article
      data-service-card
      onMouseEnter={handleMouseEnter}
      className="group relative flex flex-col justify-between rounded-[3px] border border-white/12 bg-[var(--navy-light)]/40 p-7 sm:p-8 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-industrial text-sm font-bold tracking-[0.2em] text-[var(--orange)]">
            {item.code}
          </span>
          <div className="flex h-12 w-12 items-center justify-center rounded-[2px] border border-white/15 bg-[var(--navy-deep)]/70 text-[var(--orange)]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path ref={pathRef} d={item.iconPath} />
            </svg>
          </div>
        </div>

        <h3 className="mt-6 font-serif-heritage text-2xl sm:text-3xl font-semibold text-[var(--white)]">
          {item.title}
        </h3>
        <p className="mt-3 text-sm sm:text-base text-white/75 leading-[1.65]">
          {item.description}
        </p>
      </div>

      {/* Alt kenarda soldan sağa uzayan turuncu çizgi */}
      <span
        aria-hidden="true"
        className="mt-7 block h-[2px] w-full origin-left scale-x-25 bg-white/15 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-hover:bg-[var(--orange)]"
      />
    </article>
  );
};

export const ConstructionPage: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number>(0);

  const { data: allProjects = [] } = useProjects();
  const { data: certificates = [] } = useCertificates();
  const { data: milestones = [] } = useMilestones();
  const { data: settings = {} } = useSettings();

  const dynamicIntroText = settings.construction_intro_text || introText;
  const beforeImg = settings.construction_before_img || '/media/railway-before.webp';
  const afterImg = settings.construction_after_img || '/media/railway-after.webp';

  const dynamicServiceAreas = [
    {
      code: '01',
      title: settings.construction_service1_title || 'Demiryolu & Raylı Sistemler',
      description:
        settings.construction_service1_desc ||
        'Yüksek hızlı tren (YHT) koridorları, balastlı ve rijit (slab-track) üstyapı serimi, UIC 60 alüminotermik ray kaynağı, katener elektrifikasyon ve ERTMS/ETCS sinyalizasyon projeleri.',
      iconPath: 'M4 19L9 5h6l5 14M7.5 14h9M6 18h12M9.2 9h5.6',
    },
    {
      code: '02',
      title: settings.construction_service2_title || 'Köprü & Viyadük Mühendisliği',
      description:
        settings.construction_service2_desc ||
        'Derin vadileri aşan dengeli konsol (balanced cantilever) demiryolu ve otoyol viyadükleri, ardgerme kutu kesitli tabliyeler ve sismik izolatörlü ağır yük köprüleri.',
      iconPath: 'M2 18h20M4 18v-6c3-4 13-4 16 0v6M8 18v-5M12 18v-6M16 18v-5',
    },
    {
      code: '03',
      title: settings.construction_service3_title || 'Tünel & Yeraltı Yapıları',
      description:
        settings.construction_service3_desc ||
        'Tam kesit tünel açma makineleri (TBM) ve NATM metodolojisiyle inşa edilen çift tüp demiryolu, otoyol ve basınçlı içme suyu/enerji iletim tünelleri.',
      iconPath: 'M4 20V12a8 8 0 0 1 16 0v8M8 20v-7a4 4 0 0 1 8 0v7M2 20h20',
    },
    {
      code: '04',
      title: settings.construction_service4_title || 'Karayolu & Otoyol Koridorları',
      description:
        settings.construction_service4_desc ||
        'Yüksek standartlı bölünmüş yollar, çok katmanlı lojistik kavşaklar, toprak işleri ve ağır taşıt trafiğine dayanıklı polimer modifiye taş mastik asfalt (SMA) kaplamalar.',
      iconPath: 'M6 20L10 4M18 20L14 4M12 6v3M12 12v3M12 18v2',
    },
    {
      code: '05',
      title: settings.construction_service5_title || 'Altyapı & Su Sanat Yapıları',
      description:
        settings.construction_service5_desc ||
        'Baraj isale hatları, ileri biyolojik içme suyu arıtma tesisleri, yağmur suyu/atık su kolektörleri, istinat ve derin kazı iksa mühendisliği.',
      iconPath: 'M3 16c3-3 6 3 9 0s6 3 9 0M3 11c3-3 6 3 9 0s6 3 9 0M5 20h14',
    },
    {
      code: '06',
      title: settings.construction_service6_title || 'Endüstriyel & Kurumsal Üstyapı',
      description:
        settings.construction_service6_desc ||
        'LEED sertifikalı yönetim kuleleri, demiryolu iltisak hatlı intermodal lojistik depolar, fabrika kampüsleri ve yüksek sismik güvenlikli çelik-betonarme yapılar.',
      iconPath: 'M4 20V6l8-3 8 3v14M9 20v-5h6v5M8 10h2M14 10h2M8 13h2M14 13h2',
    },
  ];

  const introRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const certsRef = useRef<HTMLElement>(null);

  useScrollReveal(servicesRef, { selector: '[data-service-card]', y: 28, stagger: 0.08 });

  // Sertifika rozetleri: görünür olunca hafif scale+fade giriş (detay metninde animasyon yok — 3.3)
  useEffect(() => {
    const el = certsRef.current;
    if (!el || reducedMotion || certificates.length === 0) return;

    const badges = el.querySelectorAll<HTMLElement>('[data-cert-badge]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badges,
        { opacity: 0, scale: 0.88 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [certificates.length, reducedMotion]);

  // Tanıtım paragrafı: scroll ile kelime kelime renk değişimi (--gray -> --navy)
  useEffect(() => {
    const el = introRef.current;
    if (!el || reducedMotion) return;

    const words = el.querySelectorAll<HTMLElement>('[data-reveal-word]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.25 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            end: 'bottom 52%',
            scrub: 0.4,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Modal açıkken ESC tuşu ve body scroll kilidi
  useEffect(() => {
    if (!selectedProject) return;
    setGalleryIndex(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject]);

  const filteredProjects =
    activeCategory === 'Tümü'
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory);

  const introWords = dynamicIntroText.split(' ');
  const keyMilestones = milestones.filter((_, i) => i % 2 === 0).slice(0, 4);

  return (
    <>
      <SEO
        title="İnşaat Sektörü — Demiryolu, Viyadük, Tünel ve Altyapı"
        description="Acar Grup İnşaat Grubu; yüksek hızlı demiryolu üstyapısı, köprü, viyadük, TBM tünel, karayolu ve endüstriyel bina taahhütlerinde 50 yıllık mühendislik güveni sunar."
        path="/insaat"
        image="/media/viaduct-bridge.webp"
      />

      {/* 1. Başlık Bandı + Breadcrumb */}
      <PageHeroBanner
        eyebrow="01 / İNŞAAT & ALTYAPI TAAHHÜT GRUBU"
        title="Çelik Raylardan Anıtsal Viyadüklere Mühendislik Mirası"
        subtitle="Yarım asırdır Türkiye'nin ulaşım, su ve sanayi altyapısını uluslararası standartlarda inşa ediyor; geleceğin hatlarını milimetrik hassasiyetle döşüyoruz."
        image="/media/viaduct-bridge.webp"
        imageAlt="Acar Grup demiryolu viyadüğü ve altyapı şantiyesi"
        breadcrumbs={[{ label: 'Anasayfa', to: '/' }, { label: 'İnşaat Sektörü' }]}
      />

      {/* 2. Sektör Tanıtımı (Kelime Kelime Scroll Text Reveal — 3.2.M İstisnası) */}
      <section
        ref={introRef}
        data-theme="light"
        className="bg-[var(--paper)] text-[var(--navy)] py-24 sm:py-32 border-b border-[var(--navy)]/10"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[var(--orange)]" aria-hidden="true" />
                <span className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--navy)]">
                  SEKTÖR VİZYONU
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--gray)]">
                2.450+ Km Demiryolu · 140+ Mega Proje
              </p>
            </div>

            <div className="lg:col-span-9">
              <p className="font-serif-heritage text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.24] font-semibold text-[var(--navy)] flex flex-wrap gap-x-2.5 gap-y-1">
                {introWords.map((word, idx) => (
                  <span key={`${word}-${idx}`} data-reveal-word className="inline-block">
                    {word}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hizmet Alanları Gridi (Koyu Bölüm --navy) */}
      <section
        ref={servicesRef}
        id="hizmetler"
        data-theme="dark"
        className="bg-[var(--navy)] text-[var(--white)] grain-surface py-24 sm:py-32"
      >
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionTitle
            eyebrow="MÜHENDİSLİK UZMANLIK ALANLARIMIZ"
            title="Altı Ana Disiplinde Anahtar Teslim Taahhüt"
            description=" Geniş özmal makine parkımız ve uzman saha mühendisliği kadromuzla kamu ve özel sektörün en karmaşık altyapı-üstyapı projelerini üstleniyoruz."
            theme="dark"
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {dynamicServiceAreas.map((service) => (
              <ServiceCard
                key={service.code}
                item={service}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Proje Portföyü (Framer Motion layoutId Sekme Filtresi + Paylaşımlı Kart Geçişi) */}
      <section
        id="portfoy"
        data-theme="light"
        className="bg-[var(--white)] text-[var(--navy)] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              eyebrow="SEÇKİN İNŞAAT PORTFÖYÜ"
              title="Referans Projelerimiz"
              theme="light"
            />

            {/* Kayar Turuncu Çizgili Kategori Sekmeleri */}
            <div
              role="tablist"
              aria-label="Proje kategorileri"
              className="flex flex-wrap items-center gap-2 sm:gap-6 border-b border-[var(--navy)]/12 pb-1"
            >
              {filterTabs.map((tab) => {
                const isActive = activeCategory === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(tab)}
                    className={`relative px-2 py-2.5 font-industrial text-sm font-bold tracking-[0.16em] uppercase transition-colors ${
                      isActive
                        ? 'text-[var(--navy)]'
                        : 'text-[var(--gray)] hover:text-[var(--navy)]'
                    }`}
                  >
                    <span>{tab}</span>
                    {isActive && (
                      <motion.span
                        layoutId="construction-filter-underline"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute bottom-[-5px] left-0 right-0 h-[3px] bg-[var(--orange)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kart Gridi */}
          <motion.div
            layout={!reducedMotion}
            className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  theme="light"
                  layoutIdPrefix="insaat"
                  onQuickSelect={(p) => setSelectedProject(p)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Paylaşımlı Eleman Geçişli Proje Hızlı Detay Görünümü + Sürüklenebilir Galeri */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            data-theme="dark"
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--navy-deep)]/90 backdrop-blur-md p-4 sm:p-8 overflow-y-auto"
          >
            <motion.div
              layoutId={`insaat-card-${selectedProject.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="relative my-auto w-full max-w-5xl overflow-hidden rounded-[3px] border border-white/15 bg-[var(--navy)] text-[var(--white)] max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Proje detay penceresini kapat"
                className="absolute top-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-[2px] bg-[var(--navy-deep)]/90 border border-white/25 text-[var(--white)] hover:border-[var(--orange)] hover:text-[var(--orange)]"
              >
                ✕
              </button>

              {/* Genişleyen Ana Görsel & Sürüklenebilir Galeri Şeridi */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--navy-deep)]">
                <motion.div
                  layoutId={`insaat-img-${selectedProject.slug}`}
                  className="h-full w-full"
                >
                  <ResponsiveImage
                    src={
                      selectedProject.images?.[galleryIndex]?.image_url ||
                      selectedProject.cover_image
                    }
                    alt={selectedProject.title}
                    sizes="90vw"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Sürüklenebilir Galeri Küçük Önizleme Slider'ı */}
              {selectedProject.images && selectedProject.images.length > 1 && (
                <div
                  data-cursor="drag"
                  className="flex items-center gap-3 overflow-x-auto bg-[var(--navy-deep)] px-6 py-3 border-b border-white/10"
                >
                  {selectedProject.images.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setGalleryIndex(i)}
                      className={`relative shrink-0 h-16 w-28 overflow-hidden rounded-[2px] border-2 transition-colors ${
                        galleryIndex === i ? 'border-[var(--orange)]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <ResponsiveImage
                        src={img.image_url}
                        alt={img.caption || selectedProject.title}
                        sizes="120px"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-white/60">
                    {selectedProject.images[galleryIndex]?.caption}
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                  <span className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--orange)]">
                    {selectedProject.category} · {selectedProject.year}
                  </span>
                  <h3 className="mt-2 font-serif-heritage text-3xl sm:text-4xl font-semibold text-[var(--white)]">
                    {selectedProject.title}
                  </h3>
                  <p className="mt-4 text-sm sm:text-base text-white/80 leading-[1.65] whitespace-pre-line">
                    {selectedProject.description}
                  </p>

                  <div className="mt-7">
                    <TransitionLink
                      to={`/projeler/${selectedProject.slug}`}
                      onClick={() => setSelectedProject(null)}
                      className="inline-flex items-center gap-3 rounded-[2px] bg-[var(--orange)] px-6 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] hover:bg-[var(--orange-hover)]"
                    >
                      <span>Tam Proje Sayfasına Git</span>
                      <span aria-hidden="true">→</span>
                    </TransitionLink>
                  </div>
                </div>

                {/* Teknik Bilgi Satırları (Stagger Girişli) */}
                <div className="lg:col-span-5">
                  <h4 className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--orange)] mb-4">
                    Teknik Proje Künyesi
                  </h4>
                  <div className="divide-y divide-white/10 border-y border-white/15">
                    {[
                      { label: 'İşveren Kurum', val: selectedProject.client },
                      { label: 'Lokasyon / Hat', val: selectedProject.location },
                      { label: 'Tamamlanma Yılı', val: String(selectedProject.year) },
                      { label: 'Yapım Süresi', val: selectedProject.duration },
                      { label: 'Sözleşme Bütçesi', val: selectedProject.budget_range },
                    ].map((spec, idx) => (
                      <motion.div
                        key={spec.label}
                        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: reducedMotion ? 0 : 0.08 * idx,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="py-3 flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="text-white/60">{spec.label}</span>
                        <span className="font-semibold text-[var(--white)] text-right">
                          {spec.val}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Önce / Sonra Şantiye Karşılaştırma Kaydırıcısı */}
      <section
        data-theme="dark"
        className="bg-[var(--navy-deep)] text-[var(--white)] grain-surface py-24 sm:py-32"
      >
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <SectionTitle
              eyebrow="SAHA DÖNÜŞÜMÜ · ÖNCE & SONRA"
              title="Ham Topoğrafyadan Yüksek Hızlı Raylı Koridora"
              description="Tutamaç çubuğunu sürükleyerek derin kaya kazısı aşamasından elektrifikasyonu tamamlanmış çift hatlı demiryolu üstyapısına geçişi inceleyebilirsiniz."
              theme="dark"
            />
          </div>

          <BeforeAfterSlider
            beforeImage={beforeImg}
            afterImage={afterImg}
            beforeAlt="Demiryolu koridoru ham kaya kazısı ve temel hazırlık aşaması"
            afterAlt="Tamamlanmış çift hatlı elektrifikasyonlu yüksek hızlı demiryolu hattı"
          />
        </div>
      </section>

      {/* 6. İnşaat Dönüm Noktaları & 7. Sertifikalar */}
      <section
        ref={certsRef}
        data-theme="light"
        className="bg-[var(--paper)] text-[var(--navy)] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          {/* Kısa Dönüm Noktaları Şeridi */}
          <div className="mb-24">
            <SectionTitle
              eyebrow="MÜHENDİSLİK KİLOMETRE TAŞLARI"
              title="İnşaat Grubunun Dönüm Noktaları"
              theme="light"
            />
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMilestones.map((m) => (
                <div
                  key={m.id}
                  className="rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)] p-6"
                >
                  <span className="font-industrial text-4xl font-bold text-[var(--navy)]">
                    {m.year}
                  </span>
                  <div className="mt-2 h-[2px] w-8 bg-[var(--orange)]" aria-hidden="true" />
                  <h3 className="mt-3 font-serif-heritage text-xl font-semibold text-[var(--navy)]">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--ink)] leading-[1.65]">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sertifikalar (Rozetlerde hafif scale+fade; detay metinlerinde animasyon yok — 3.3) */}
          <div className="border-t border-[var(--navy)]/12 pt-20">
            <SectionTitle
              eyebrow="KALİTE, ÇEVRE VE YETKİ BELGELERİ"
              title="Uluslararası Standartlar ve Yetkinlik"
              theme="light"
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificates.map((cert) => (
                <article
                  key={cert.id}
                  className="flex flex-col justify-between rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)] p-7"
                >
                  <div>
                    <div
                      data-cert-badge
                      className="inline-flex h-14 px-4 items-center justify-center rounded-[2px] bg-[var(--navy)] text-[var(--white)] font-industrial text-base font-bold tracking-[0.16em]"
                    >
                      <span className="h-2 w-2 bg-[var(--orange)] mr-2.5" aria-hidden="true" />
                      {cert.image}
                    </div>
                    <h3 className="mt-5 font-serif-heritage text-2xl font-semibold text-[var(--navy)]">
                      {cert.name}
                    </h3>
                    <p className="mt-3 text-sm text-[var(--ink)] leading-[1.65]">
                      {cert.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. "Teklif Al" CTA */}
      <CTASection
        eyebrow="ALTYAPI & TAAHHÜT İŞ BİRLİKLERİ"
        heading="Demiryolu, Tünel ve Üstyapı Projeleriniz İçin Mühendislik Gücümüz Yanınızda."
        description="Kamu ihaleleri, ortak girişim (JV) konsorsiyumları ve özel sektör endüstriyel tesis yatırımlarınız için teknik teklif ekibimizle görüşün."
        primaryLabel="Teklif & İhale İletişimi"
        primaryTo="/iletisim"
        secondaryLabel="Tüm Projeleri İncele"
        secondaryTo="/projeler"
      />
    </>
  );
};

export default ConstructionPage;

