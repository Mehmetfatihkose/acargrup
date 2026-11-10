import React from 'react';
import { Logo } from './Logo';
import { TransitionLink } from './PageTransition';
import { useLenis } from '../lib/lenisContext';
import { useSettings } from '../api/queries';

/**
 * Kurumsal Alt Bilgi (Footer):
 * - 4 sütun: Kurumsal, Sektörler, İletişim, Sosyal & Katalog
 * - Dev "ACAR GRUP" yazısı: normalde outline, hover'da turuncu dolgu soldan sağa akar
 * - Altta --navy-deep telif şeridi ve "1974'ten Beri" ibaresi
 * - Bilinçli sadelik (3.3): Küçük bağlantılar, telif satırı ve adreste giriş animasyonu yoktur; yalnızca renk geçişi vardır.
 * - Dinamik site_settings entegrasyonu (Admin panelinden yönetilebilir)
 */
export const Footer: React.FC = () => {
  const { scrollToTop } = useLenis();
  const { data: settings = {} } = useSettings();

  const footerLead =
    settings.footer_lead ||
    'Yarım asrı aşan mühendislik mirasıyla demiryolu, altyapı ve üstyapı inşaatında; küresel tedarik gücüyle endüstriyel plastik hammaddede Türkiye\'nin güvenilir iş ortağı.';

  const footerCopyright =
    settings.footer_copyright ||
    '© 1974–2026 Acar Grup Holding A.Ş. · 1974\'ten Beri Türkiye\'nin Altyapı ve Sanayi Gücü. Tüm hakları saklıdır.';

  const linkedinUrl = settings.social_linkedin || 'https://www.linkedin.com';
  const youtubeUrl = settings.social_youtube || 'https://www.youtube.com';
  const xUrl = settings.social_x || 'https://x.com';
  const instagramUrl = settings.social_instagram || 'https://www.instagram.com';

  return (
    <footer data-theme="dark" className="bg-[var(--navy)] text-[var(--white)] grain-surface border-t border-white/10">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pt-20 pb-12 sm:px-8 lg:px-12">
        {/* Üst Satır: Logo & Yukarı Çık */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo variant="dark" showSince={true} />
            <p className="mt-4 max-w-md text-sm text-white/75 leading-relaxed">
              {footerLead}
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Sayfanın en üstüne çık"
            className="group inline-flex items-center gap-3 self-start sm:self-auto rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/60 px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--white)] transition-colors duration-250 hover:border-[var(--orange)] hover:text-[var(--orange)]"
          >
            <span>Yukarı Çık</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              className="transition-transform duration-250 group-hover:-translate-y-1"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>

        {/* 4 Sütunlu Bağlantı ve İletişim Gridi */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          {/* Sütun 1: Kurumsal */}
          <div className="lg:col-span-3">
            <h2 className="font-industrial text-sm font-semibold tracking-[0.2em] uppercase text-[var(--orange)]">
              Kurumsal
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <TransitionLink to="/hakkimizda" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  Hakkımızda &amp; Yönetim
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/hakkimizda#yolculuk" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  50 Yıllık Yolculuk (1974–2026)
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/projeler" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  Proje Portföyümüz
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/haberler" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  Haberler ve Duyurular
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/iletisim" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  İletişim &amp; Lokasyonlar
                </TransitionLink>
              </li>
            </ul>
          </div>

          {/* Sütun 2: Sektörler */}
          <div className="lg:col-span-3">
            <h2 className="font-industrial text-sm font-semibold tracking-[0.2em] uppercase text-[var(--orange)]">
              Faaliyet Alanları
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <TransitionLink to="/insaat" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  Demiryolu &amp; Raylı Sistemler
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/insaat#hizmetler" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  Köprü, Viyadük &amp; Tünel İnşaatı
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/insaat#portfoy" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  Altyapı ve Üstyapı Projeleri
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/plastik-hammadde" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  Plastik Hammadde (PE, PP, PVC, PET, ABS)
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/plastik-hammadde#teklif-formu" className="transition-colors duration-200 hover:text-[var(--orange)]">
                  Hammadde Fiyat Teklifi İste
                </TransitionLink>
              </li>
            </ul>
          </div>

          {/* Sütun 3: İletişim */}
          <div className="lg:col-span-4">
            <h2 className="font-industrial text-sm font-semibold tracking-[0.2em] uppercase text-[var(--orange)]">
              Merkez &amp; Lojistik Üs
            </h2>
            <address className="mt-5 not-italic space-y-3.5 text-sm text-white/75">
              <div>
                <p className="font-semibold text-[var(--white)]">Genel Merkez — Acar Kule</p>
                <p className="mt-0.5">
                  Büyükdere Cad. No: 194 Kat: 18–22, Levent, Beşiktaş / İstanbul
                </p>
              </div>
              <div>
                <p className="font-semibold text-[var(--white)]">Polimer Lojistik &amp; Silo Terminali</p>
                <p className="mt-0.5">Gebze Organize Sanayi Bölgesi, 1400. Cad. Kocaeli</p>
              </div>
              <div className="pt-1 space-y-1">
                <p>
                  <a
                    href="tel:+902123101974"
                    className="transition-colors duration-200 hover:text-[var(--orange)]"
                  >
                    +90 (212) 310 19 74
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:kurumsal@acargrup.com.tr"
                    className="transition-colors duration-200 hover:text-[var(--orange)]"
                  >
                    kurumsal@acargrup.com.tr
                  </a>
                </p>
              </div>
            </address>
          </div>

          {/* Sütun 4: Sosyal & Kurumsal Ağlar */}
          <div className="lg:col-span-2">
            <h2 className="font-industrial text-sm font-semibold tracking-[0.2em] uppercase text-[var(--orange)]">
              Kurumsal Ağ
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[var(--orange)]"
                >
                  <span>LinkedIn</span>
                  <span aria-hidden="true" className="text-xs text-white/40">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[var(--orange)]"
                >
                  <span>YouTube Kurumsal</span>
                  <span aria-hidden="true" className="text-xs text-white/40">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[var(--orange)]"
                >
                  <span>X (Kurumsal)</span>
                  <span aria-hidden="true" className="text-xs text-white/40">↗</span>
                </a>
              </li>
              {settings.social_instagram && (
                <li>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[var(--orange)]"
                  >
                    <span>Instagram</span>
                    <span aria-hidden="true" className="text-xs text-white/40">↗</span>
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-7 border-l-2 border-[var(--orange)] pl-3">
              <p className="font-industrial text-xs tracking-[0.18em] uppercase text-white/90">
                1974&apos;ten Beri
              </p>
              <p className="text-xs text-[var(--gray)] mt-0.5">50+ Yıllık Güven</p>
            </div>
          </div>
        </div>

        {/* Dev "ACAR GRUP" Outline Yazısı (Hover'da soldan sağa turuncu dolgu) */}
        <div className="pt-4 pb-2 overflow-hidden select-none">
          <div
            aria-hidden="true"
            className="footer-giant-wordmark text-center text-[clamp(3.4rem,13.5vw,13.5rem)]"
          >
            ACAR GRUP
          </div>
        </div>
      </div>

      {/* Alt Telif Şeridi (--navy-deep) */}
      <div className="relative z-10 bg-[var(--navy-deep)] border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-6 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>
            {footerCopyright}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <TransitionLink
              to="/kvkk"
              className="transition-colors duration-200 hover:text-[var(--orange)]"
            >
              KVKK Aydınlatma Metni
            </TransitionLink>
            <TransitionLink
              to="/gizlilik"
              className="transition-colors duration-200 hover:text-[var(--orange)]"
            >
              Gizlilik Politikası
            </TransitionLink>
            <TransitionLink
              to="/cerez-politikasi"
              className="transition-colors duration-200 hover:text-[var(--orange)]"
            >
              Çerez Politikası
            </TransitionLink>
            <a
              href="/admin/login"
              className="text-white/40 transition-colors duration-200 hover:text-[var(--orange)]"
            >
              Yönetici Girişi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

