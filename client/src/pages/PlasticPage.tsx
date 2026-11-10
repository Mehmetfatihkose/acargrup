import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { useCertificates, useProducts, useSettings } from '../api/queries';
import { SEO } from '../components/SEO';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { SectionTitle } from '../components/SectionTitle';
import { ProductCard } from '../components/ProductCard';
import { Marquee } from '../components/Marquee';
import { StepperForm } from '../components/StepperForm';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLenis } from '../lib/lenisContext';

const processSteps = [
  {
    step: '01',
    title: 'Küresel Hammadde Temini',
    description:
      'Avrupa, Orta Doğu ve Asya’nın lider petrokimya rafinerileriyle uzun vadeli doğrudan kontratlar üzerinden orijinal (virgin) granül tedariki.',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    step: '02',
    title: 'Akredite Kalite Kontrol',
    description:
      'Her parti (lot) için ISO 1133 MFI, yoğunluk, nem ve mekanik mukavemet analizleri ile CoA (Analiz Sertifikası) doğrulaması.',
    icon: 'M9 3h6M10 3v5.5L5 19a2 2 0 0 0 1.8 2.9h10.4A2 2 0 0 0 19 19l-5-10.5V3',
  },
  {
    step: '03',
    title: 'İntermodal Silo Depolama',
    description:
      'Gebze OSB’deki 65.000 m² kapalı tesisimizde nemden ve kontaminasyondan izole 24 paslanmaz alüminyum silo ve stok yönetimi.',
    icon: 'M4 20V8l8-4 8 4v12M4 12h16M4 16h16M9 20V8M15 20V8',
  },
  {
    step: '04',
    title: '24 Saatte Kesintisiz Sevkiyat',
    description:
      '25 kg FFS torba, BigBag veya pnömatik silobas filosuyla Türkiye’nin tüm organize sanayi bölgelerine tam zamanında teslimat.',
    icon: 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  },
];

const clientSectors = [
  'Esnek ve Rijit Ambalaj Sanayii',
  'Basınçlı Altyapı ve Tesisat Boruları',
  'Otomotiv OEM & Yan Sanayii',
  'Tarımsal Sulama ve Sera Filmleri',
  'İnşaat Profil ve Jeomembran Yalıtım',
  'Beyaz Eşya ve Elektrikli Ev Aletleri',
  'Enerji ve Fiber Optik Kablo İzolasyonu',
  'Medikal ve Hijyenik Polimer Üretimi',
];

export const PlasticPage: React.FC = () => {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const { scrollToTarget } = useLenis();

  const { data: products = [] } = useProducts();
  const { data: certificates = [] } = useCertificates();
  const { data: settings = {} } = useSettings();

  const dynamicProcessSteps = [
    {
      step: '01',
      title: settings.plastic_step1_title || 'Küresel Hammadde Temini',
      description:
        settings.plastic_step1_desc ||
        'Avrupa, Orta Doğu ve Asya’nın lider petrokimya rafinerileriyle uzun vadeli doğrudan kontratlar üzerinden orijinal (virgin) granül tedariki.',
      icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    },
    {
      step: '02',
      title: settings.plastic_step2_title || 'Akredite Kalite Kontrol',
      description:
        settings.plastic_step2_desc ||
        'Her parti (lot) için ISO 1133 MFI, yoğunluk, nem ve mekanik mukavemet analizleri ile CoA (Analiz Sertifikası) doğrulaması.',
      icon: 'M9 3h6M10 3v5.5L5 19a2 2 0 0 0 1.8 2.9h10.4A2 2 0 0 0 19 19l-5-10.5V3',
    },
    {
      step: '03',
      title: settings.plastic_step3_title || 'İntermodal Silo Depolama',
      description:
        settings.plastic_step3_desc ||
        'Gebze OSB’deki 65.000 m² kapalı tesisimizde nemden ve kontaminasyondan izole 24 paslanmaz alüminyum silo ve stok yönetimi.',
      icon: 'M4 20V8l8-4 8 4v12M4 12h16M4 16h16M9 20V8M15 20V8',
    },
    {
      step: '04',
      title: settings.plastic_step4_title || '24 Saatte Kesintisiz Sevkiyat',
      description:
        settings.plastic_step4_desc ||
        '25 kg FFS torba, BigBag veya pnömatik silobas filosuyla Türkiye’nin tüm organize sanayi bölgelerine tam zamanında teslimat.',
      icon: 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    },
  ];

  const dynamicIntroLead =
    settings.plastic_intro_lead ||
    '1991 yılından bu yana plastik işleme sanayiinin hammadde ihtiyacını karşılayan Acar Polimer; enjeksiyon kalıplama, film ekstrüzyon, şişirme (blow molding), termoform ve basınçlı boru üreticilerine her partide aynı reolojik kararlılığı sunar.';

  const [expandedSlug, setExpandedSlug] = useState<string>('pe-polietilen');
  const [selectedQuoteProductId, setSelectedQuoteProductId] = useState<number | null>(null);

  const processSectionRef = useRef<HTMLElement>(null);
  const processLineRef = useRef<HTMLDivElement>(null);
  const quoteSectionRef = useRef<HTMLElement>(null);

  // URL #teklif-formu ile gelindiğinde forma yumuşak kaydır
  useEffect(() => {
    if (location.hash === '#teklif-formu' && quoteSectionRef.current) {
      window.setTimeout(() => {
        scrollToTarget(quoteSectionRef.current!, -80);
      }, 280);
    }
  }, [location.hash, scrollToTarget]);

  // Tedarik Süreci Şeması: scroll ile bağlantı çizgisi adım adım çizilir, düğümler sırayla turuncu olur
  useEffect(() => {
    const section = processSectionRef.current;
    if (!section || reducedMotion) return;

    const nodes = section.querySelectorAll<HTMLElement>('[data-process-node]');
    const cards = section.querySelectorAll<HTMLElement>('[data-process-card]');

    const ctx = gsap.context(() => {
      if (processLineRef.current) {
        gsap.fromTo(
          processLineRef.current,
          { scaleX: 0, transformOrigin: '0% 50%' },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              end: 'bottom 68%',
              scrub: 0.4,
            },
          }
        );
      }

      nodes.forEach((node, idx) => {
        gsap.fromTo(
          node,
          { scale: 0.85, backgroundColor: '#061528', borderColor: 'rgba(255,255,255,0.2)' },
          {
            scale: 1,
            backgroundColor: '#FF6B00',
            borderColor: '#FF6B00',
            duration: 0.5,
            delay: idx * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 74%',
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 74%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleRequestQuoteForProduct = (productId: number) => {
    setSelectedQuoteProductId(productId);
    if (quoteSectionRef.current) {
      scrollToTarget(quoteSectionRef.current, -80);
    }
  };

  return (
    <>
      <SEO
        title="Plastik Hammadde — PE, PP, PVC, PET ve ABS Granül Tedariki"
        description="Acar Grup Plastik Hammadde Grubu; HDPE, LDPE, LLDPE, PP, PVC, PET, rPET ve ABS granül tedarikinde 320.000 ton yıllık kapasiteyle Türk sanayiinin yanında."
        path="/plastik-hammadde"
        image="/media/plastic-granules.webp"
      />

      {/* 1. Çok Katmanlı Granül Parallax Başlık Bandı */}
      <PageHeroBanner
        eyebrow="02 / POLİMER & PLASTİK HAMMADDE GRUBU"
        title="Sanayinin Üretim Gücünü Besleyen Polimer Tedarik Ağı"
        subtitle="PE, PP, PVC, PET ve ABS granül gruplarında küresel petrokimya üreticilerinden doğrudan tedarik, akredite laboratuvar güvencesi ve intermodal lojistik hızı."
        image="/media/plastic-granules.webp"
        imageAlt="Polietilen, Polipropilen ve mühendislik polimer granülleri makro görünümü"
        breadcrumbs={[{ label: 'Anasayfa', to: '/' }, { label: 'Plastik Hammadde' }]}
        multiLayerGranules={true}
      />

      {/* 2. Sektör Tanıtımı & 3. Ürün Grupları (PE, PP, PVC, PET, ABS — Yerinde Genişleyen Kartlar) */}
      <section
        data-theme="light"
        className="bg-[var(--paper)] text-[var(--navy)] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-[var(--navy)]/12">
            <div className="lg:col-span-6">
              <SectionTitle
                eyebrow="KESİNTİSİZ TEDARİK · HOMOJEN KALİTE"
                title="Beş Ana Polimer Ailesinde Yüksek Stok Gücü"
                theme="light"
              />
            </div>
            <div className="lg:col-span-6 flex flex-col justify-end text-[var(--ink)] text-base leading-[1.65] space-y-4">
              <p>
                {dynamicIntroLead}
              </p>
              <p className="text-sm text-[var(--gray)]">
                Ürün kartlarına tıklayarak MFI aralıklarını, yoğunluk değerlerini, ambalaj
                seçeneklerini ve kullanım alanlarını inceleyebilirsiniz.
              </p>
            </div>
          </div>

          {/* PE, PP, PVC, PET, ABS Kartları */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isExpanded={expandedSlug === product.slug}
                onToggle={() =>
                  setExpandedSlug((prev) => (prev === product.slug ? '' : product.slug))
                }
                onRequestQuote={handleRequestQuoteForProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Üretim ve Tedarik Süreci Şeması (Scroll ile Bağlantı Çizgisi Çizilir) */}
      <section
        ref={processSectionRef}
        data-theme="dark"
        className="bg-[var(--navy)] text-[var(--white)] grain-surface py-24 sm:py-32"
      >
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionTitle
            eyebrow="UÇTAN UCA LOJİSTİK VE KALİTE ZİNCİRİ"
            title="Rafineriden Üretim Hattınıza Dört Adımda Güvence"
            theme="dark"
          />

          <div className="relative mt-16">
            {/* Masaüstü Yatay Bağlantı Çizgisi */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-8 left-[8%] right-[8%] h-[2px] bg-white/15"
            >
              <div
                ref={processLineRef}
                className="h-full w-full bg-[var(--orange)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {dynamicProcessSteps.map((p) => (
                <div key={p.step} data-process-card className="relative flex flex-col">
                  <div
                    data-process-node
                    className="relative z-10 flex h-16 w-16 items-center justify-center rounded-[3px] border border-white/25 bg-[var(--navy-deep)] text-[var(--white)]"
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d={p.icon} />
                    </svg>
                  </div>

                  <span className="mt-6 font-industrial text-xs font-bold tracking-[0.22em] uppercase text-[var(--orange)]">
                    ADIM {p.step}
                  </span>
                  <h3 className="mt-2 font-serif-heritage text-2xl font-semibold text-[var(--white)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/75 leading-[1.65]">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Kalite Sertifikaları & Sürdürülebilirlik / Geri Dönüşüm SVG Döngü Diyagramı */}
      <section
        data-theme="light"
        className="bg-[var(--white)] text-[var(--navy)] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            {/* Sol: Döngüsel Polimer Ekonomisi Açıklaması + Sertifikalar */}
            <div className="lg:col-span-7">
              <SectionTitle
                eyebrow="SÜRDÜRÜLEBİLİRLİK & DÖNGÜSEL POLİMER"
                title={settings.plastic_sustainability_title || 'Geri Dönüştürülmüş rPET ve rHDPE ile Düşük Karbon Ayak İzi'}
                description={
                  settings.plastic_sustainability_desc ||
                  'Avrupa Gıda Güvenliği Otoritesi (EFSA) ve FDA standartlarına uygun mekanik ve kimyasal geri kazanımlı granül portföyümüzle, ambalaj ve otomotiv üreticilerinin yeşil dönüşüm hedeflerine doğrudan katkı sağlıyoruz.'
                }
                theme="light"
              />

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.slice(0, 4).map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-[3px] border border-[var(--navy)]/12 bg-[var(--paper)] p-5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 bg-[var(--orange)]" aria-hidden="true" />
                      <span className="font-industrial text-xs font-bold tracking-[0.18em] uppercase text-[var(--navy)]">
                        {cert.image}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif-heritage text-xl font-semibold text-[var(--navy)]">
                      {cert.name}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ: Sürekli Yavaş Akan Kesikli Oklarla SVG Döngü Diyagramı */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md rounded-[3px] border border-[var(--navy)]/12 bg-[var(--navy)] p-8 text-[var(--white)]">
                <div className="text-center mb-4">
                  <span className="font-industrial text-xs font-semibold tracking-[0.22em] uppercase text-[var(--orange)]">
                    DÖNGÜSEL POLİMER EKOSİSTEMİ
                  </span>
                </div>

                <svg
                  viewBox="0 0 320 320"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Hammadde üretimi, endüstriyel kullanım, toplama ve rPET/rHDPE geri kazanım döngüsü diyagramı"
                >
                  {/* Arka Plan Sabit Yörünge */}
                  <circle
                    cx="160"
                    cy="160"
                    r="108"
                    fill="none"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="2"
                  />
                  {/* Sürekli Yavaş Akan Turuncu Döngü Çemberi */}
                  <circle
                    cx="160"
                    cy="160"
                    r="108"
                    fill="none"
                    stroke="#FF6B00"
                    strokeWidth="2.5"
                    className="svg-dash-flow"
                  />

                  {/* Yön Ok Uçları */}
                  <polygon points="165,46 153,52 165,58" fill="#FF6B00" />
                  <polygon points="274,165 268,153 262,165" fill="#FF6B00" />
                  <polygon points="155,274 167,268 155,262" fill="#FF6B00" />
                  <polygon points="46,155 52,167 58,155" fill="#FF6B00" />

                  {/* 4 Düğüm Kutusu */}
                  <g transform="translate(110, 18)">
                    <rect width="100" height="34" rx="3" fill="#061528" stroke="#FF6B00" strokeWidth="1.2" />
                    <text x="50" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
                      SAF &amp; r-GRANÜL
                    </text>
                  </g>

                  <g transform="translate(212, 143)">
                    <rect width="98" height="34" rx="3" fill="#061528" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <text x="49" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
                      ÜRETİM HATTI
                    </text>
                  </g>

                  <g transform="translate(110, 268)">
                    <rect width="100" height="34" rx="3" fill="#061528" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <text x="50" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
                      GERİ TOPLAMA
                    </text>
                  </g>

                  <g transform="translate(10, 143)">
                    <rect width="98" height="34" rx="3" fill="#061528" stroke="#FF6B00" strokeWidth="1.2" />
                    <text x="49" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
                      REGRANÜLASYON
                    </text>
                  </g>

                  {/* Merkez Özet */}
                  <text x="160" y="154" textAnchor="middle" fill="#FF6B00" fontSize="26" fontWeight="700">
                    %100
                  </text>
                  <text x="160" y="174" textAnchor="middle" fill="rgba(255,255,255,0.78)" fontSize="10">
                    İZLENEBİLİR LOT
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Müşteri Sektörleri Sonsuz Kayan Marquee Bandı (Hover'da Durur) */}
      <section aria-label="Hizmet verdiğimiz müşteri sektörleri" data-theme="dark">
        <Marquee items={clientSectors} theme="dark" />
      </section>

      {/* 7. Çok Adımlı "Fiyat Teklifi İste" Formu (StepperForm) */}
      <section
        ref={quoteSectionRef}
        id="teklif-formu"
        data-theme="dark"
        className="bg-[var(--navy-deep)] text-[var(--white)] grain-surface py-24 sm:py-32"
      >
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <SectionTitle
                eyebrow="KURUMSAL TEDARİK MASASI"
                title="Hammadde Fiyat Teklifi İste"
                description="Talep ettiğiniz polimer grubunu, tonaj bilgisini ve sevkiyat şeklini 3 kısa adımda iletin; satış mühendislerimiz güncel stok ve termin planıyla dönüş sağlasın."
                theme="dark"
              />

              <div className="mt-8 space-y-4 border-t border-white/12 pt-6 text-sm text-white/75">
                <div className="flex items-center justify-between">
                  <span>Minimum Sipariş (Torba / Palet)</span>
                  <span className="font-semibold text-[var(--white)]">1.250 kg (1 Palet)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tam Tır / Silobas Kapasitesi</span>
                  <span className="font-semibold text-[var(--white)]">24 – 26 Ton</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Marmara &amp; İç Anadolu Termin</span>
                  <span className="font-semibold text-[var(--orange)]">24 – 48 Saat</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <StepperForm
                products={products}
                preselectedProductId={selectedQuoteProductId}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PlasticPage;

