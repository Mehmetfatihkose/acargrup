import React, { useRef } from 'react';
import { SectionTitle } from '../SectionTitle';
import { TransitionLink } from '../PageTransition';
import { ResponsiveImage } from '../ResponsiveImage';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useSettings } from '../../api/queries';

/**
 * Anasayfa Faaliyet Alanları — Split-Screen Endüstriyel İki Büyük Panel
 * Canlı site_settings entegrasyonu ile admin panelinden tam kontrol edilebilir.
 */
export const SectorsShowcase: React.FC = () => {
  const { data: settings = {} } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { selector: '[data-sector-panel]', y: 32, stagger: 0.14 });

  const sectors = [
    {
      code: 'SEKTÖR 01',
      category: 'AĞIR ALTYAPI & MÜTEAHHİTLİK',
      title: settings.sector1_title || 'İnşaat & Raylı Sistemler',
      headline: settings.sector1_headline || 'Türkiye Omurgasını Birleştiren Ağır Mühendislik',
      description:
        settings.sector1_desc ||
        'Yüksek hızlı tren (YHT) hatları, sismik izolasyonlu viyadükler, TBM derin tünelleri ve entegre karayolu koridorlarında 50 yıllık kesintisiz taahhüt tecrübesi.',
      metrics: [
        { label: 'Demiryolu Ağı', value: '2.450+ Km' },
        { label: 'Sanat Yapısı', value: '48+ Viyadük & Köprü' },
        { label: 'Yetki Seviyesi', value: 'A Grubu Sınırsız' },
      ],
      technicalHighlights: settings.sector1_highlights
        ? settings.sector1_highlights.split('\n').filter(Boolean)
        : [
            'UIC 60 Alüminotermik Ray Kaynağı ve Balastsız Rijit Hat',
            'Dengeli Konsol ve Ard-Germeli Viyadük Teknolojisi',
            'Çift Tüp TBM ve NATM Yeraltı Altyapı Tünelleri',
            'ERTMS/ETCS Seviye 2 Sinyalizasyon & Elektrifikasyon',
          ],
      image: settings.sector1_image || '/media/hero-railway.webp',
      imageAlt: 'Acar Grup yüksek hızlı demiryolu ve viyadük inşaatı',
      to: '/insaat',
      cta: 'İnşaat Faaliyetlerini ve Portföyü Keşfet',
    },
    {
      code: 'SEKTÖR 02',
      category: 'PETROKİMYA & ENDÜSTRİYEL TEDARİK',
      title: settings.sector2_title || 'Plastik Hammadde & Polimer',
      headline: settings.sector2_headline || 'İmalat Sanayiine Kesintisiz ve Akredite Hammadde',
      description:
        settings.sector2_desc ||
        'Global petrokimya üreticilerinden doğrudan ithalat, Gebze intermodal silo terminali ve laboratuvar onaylı MFI değerleriyle Türkiye sanayiine yıllık 320.000 ton polimer güvencesi.',
      metrics: [
        { label: 'Yıllık Kapasite', value: '320.000 Ton' },
        { label: 'Hammadde Grubu', value: '5 Ana Polimer Ailesi' },
        { label: 'Lojistik Altyapı', value: 'Demiryolu İltisaklı Silo' },
      ],
      technicalHighlights: settings.sector2_highlights
        ? settings.sector2_highlights.split('\n').filter(Boolean)
        : [
            'HDPE, LDPE, LLDPE Film ve Şişirmelik Poliolefinler',
            'PPH, PPC, PPR Enjeksiyon ve Boruluk Homopolimer/Kopolimer',
            'Süspansiyon PVC (K58–K70) Profil ve Boru Granülleri',
            'Otomotiv ve Beyaz Eşya Sınıfı Mühendislik ABS & PET',
          ],
      image: settings.sector2_image || '/media/plastic-granules.webp',
      imageAlt: 'Acar Grup endüstriyel polimer plastik granül tedariki',
      to: '/plastik-hammadde',
      cta: 'Hammadde Kataloğu ve Fiyat Teklifi Al',
    },
  ];
  useScrollReveal(sectionRef, { selector: '[data-sector-panel]', y: 32, stagger: 0.14 });

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="bg-[var(--white)] text-[var(--navy)] py-24 sm:py-32 border-t border-[var(--navy)]/10"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-[var(--navy)]/12 pb-10">
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[var(--orange)]" aria-hidden="true" />
              <span className="font-industrial text-xs font-bold tracking-[0.25em] uppercase text-[var(--navy)]">
                İKİ ANA FAALİYET ALANI // 50 YILLIK TEK GÜVENCE
              </span>
            </div>
            <h2 className="font-industrial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase text-[var(--navy)]">
              Ülke Altyapısından Sanayi Üretimine
            </h2>
          </div>
          <p className="max-w-xl text-base text-[var(--ink)] leading-[1.65]">
            Acar Grup, fiziksel ulaşım koridorlarını inşa eden ağır mühendislik gücü ile imalat sanayiinin hammadde sürekliliğini sağlayan tedarik zinciri uzmanlığını yarım asırdır aynı çatı altında buluşturur.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {sectors.map((sector) => (
            <article
              key={sector.code}
              data-sector-panel
              data-cursor="view"
              className="group flex flex-col justify-between overflow-hidden rounded-[3px] border border-[var(--navy)]/15 bg-[var(--paper)] shadow-[0_4px_20px_rgba(10,37,64,0.05)] transition-all duration-400 hover:border-[var(--navy)]/60 hover:shadow-[0_20px_48px_rgba(10,37,64,0.12)] hover:-translate-y-1.5"
            >
              <div>
                {/* Panel Görsel Başlığı */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--navy-deep)]">
                  <ResponsiveImage
                    src={sector.image}
                    alt={sector.imageAlt}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)]/90 via-[var(--navy-deep)]/30 to-transparent" />

                  {/* Rozet */}
                  <div className="absolute top-4 left-4 rounded-[2px] bg-[var(--navy-deep)]/90 px-3.5 py-1.5 border border-white/15 backdrop-blur-sm">
                    <span className="font-industrial text-xs font-bold tracking-[0.2em] text-[var(--orange)]">
                      {sector.code}
                    </span>
                    <span className="mx-2 text-white/30">/</span>
                    <span className="font-industrial text-xs tracking-[0.16em] uppercase text-[var(--white)]">
                      {sector.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-[var(--white)]">
                      {sector.title}
                    </h3>
                  </div>
                </div>

                {/* İçerik ve Detaylar */}
                <div className="p-7 sm:p-9">
                  <h4 className="font-industrial text-xl font-bold uppercase tracking-tight text-[var(--navy)]">
                    {sector.headline}
                  </h4>
                  <p className="mt-3 text-[var(--ink)] text-sm sm:text-base leading-[1.65]">
                    {sector.description}
                  </p>

                  {/* Metrik Şeridi */}
                  <div className="mt-6 grid grid-cols-3 gap-3 border-y border-[var(--navy)]/10 py-4 bg-[var(--white)] px-4 rounded-[2px]">
                    {sector.metrics.map((m) => (
                      <div key={m.label}>
                        <span className="block font-industrial text-lg sm:text-xl font-bold text-[var(--navy)]">
                          {m.value}
                        </span>
                        <span className="block text-[10px] font-industrial uppercase tracking-[0.14em] text-[var(--gray)] mt-0.5">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Teknik Çizgiler Listesi */}
                  <div className="mt-6">
                    <span className="font-industrial text-xs font-bold tracking-[0.18em] uppercase text-[var(--navy)] block mb-3">
                      Teknik Kabiliyetler &amp; Standartlar:
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-[var(--ink)]">
                      {sector.technicalHighlights.map((tech) => (
                        <li key={tech} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[var(--orange)]"
                          />
                          <span>{tech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Alt Aksiyon Butonu */}
              <div className="p-7 pt-0 sm:p-9 sm:pt-0">
                <TransitionLink
                  to={sector.to}
                  className="group/btn flex items-center justify-between w-full rounded-[2px] bg-[var(--navy)] px-6 py-4 text-xs font-industrial font-bold tracking-[0.18em] uppercase text-[var(--white)] transition-all duration-300 hover:bg-[var(--orange)] hover:shadow-[0_4px_16px_rgba(255,107,0,0.35)]"
                >
                  <span>{sector.cta}</span>
                  <span
                    aria-hidden="true"
                    className="text-base transition-transform duration-300 group-hover/btn:translate-x-2"
                  >
                    →
                  </span>
                </TransitionLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectorsShowcase;
