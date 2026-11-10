import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Logo';
import { TransitionLink } from './PageTransition';
import { useReducedMotion } from '../hooks/useReducedMotion';

const navItems = [
  { label: 'Anasayfa', to: '/' },
  { label: 'İnşaat', to: '/insaat' },
  { label: 'Plastik Hammadde', to: '/plastik-hammadde' },
  { label: 'Projeler', to: '/projeler' },
  { label: 'Hakkımızda', to: '/hakkimizda' },
  { label: 'Haberler', to: '/haberler' },
  { label: 'İletişim', to: '/iletisim' },
];

/**
 * Kurumsal Üst Menü (Header):
 * - En üstteyken şeffaf; aşağı kaydırırken yukarı gizlenir; yukarı kaydırınca blur'lu navy zeminle döner (0.35s)
 * - Link hover: altı turuncu çizgi soldan sağa uzar (0.3s)
 * - Mobil menü: tam ekran navy panel, stagger girişli linkler, X'e dönüşen hamburger ikonu
 */
export const Header: React.FC = () => {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  const [isAtTop, setIsAtTop] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hukuki sade sayfalar açık zeminle başladığından üstteyken de lacivert şerit korunur
  const isLightTopRoute = ['/kvkk', '/gizlilik', '/cerez-politikasi'].includes(
    location.pathname
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentY = window.scrollY;
      setIsAtTop(currentY <= 36);

      if (currentY > 110 && currentY > lastScrollY + 6 && !mobileOpen) {
        setIsHidden(true);
      } else if (currentY < lastScrollY - 6 || currentY <= 80) {
        setIsHidden(false);
      }

      lastScrollY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    updateHeader();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const solidBackdrop = !isAtTop || isLightTopRoute || mobileOpen;

  return (
    <>
      <header
        data-theme="dark"
        style={{
          transform: isHidden && !mobileOpen ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 0, 0)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.35s ease, border-color 0.35s ease',
        }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          solidBackdrop
            ? 'bg-[var(--navy-deep)]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_32px_-8px_rgba(6,21,40,0.85)]'
            : 'bg-transparent border-b border-white/10'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <TransitionLink
            to="/"
            aria-label="Acar Grup Anasayfa"
            className="relative z-[65] py-1 transition-opacity duration-200 hover:opacity-90"
          >
            <Logo variant="dark" showSince={true} />
          </TransitionLink>

          {/* Masaüstü Navigasyon */}
          <nav
            aria-label="Ana menü"
            className="hidden xl:flex items-center gap-8"
          >
            {navItems.map((item) => {
              const active =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);

              return (
                <TransitionLink
                  key={item.to}
                  to={item.to}
                  className={`group relative py-2.5 text-[13px] font-medium tracking-[0.09em] uppercase transition-colors duration-200 ${
                    active ? 'text-[var(--white)]' : 'text-white/70 hover:text-[var(--white)]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full bg-[var(--orange)] shadow-[0_0_8px_var(--orange-glow)] origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </TransitionLink>
              );
            })}
          </nav>

          {/* Sağ Aksiyon & Mobil Menü Tetikleyici */}
          <div className="flex items-center gap-4">
            <TransitionLink
              to="/plastik-hammadde#teklif-formu"
              className="group hidden sm:inline-flex items-center gap-2.5 rounded-[2px] bg-[var(--orange)] px-5 py-2.5 text-xs font-bold tracking-[0.14em] uppercase text-[var(--white)] transition-all duration-200 hover:bg-[var(--orange-hover)] hover:shadow-[0_0_20px_var(--orange-glow)]"
            >
              <span>Teklif İste</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </TransitionLink>

            {/* Mobil Hamburger -> X Morph Butonu */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-panel"
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              className="relative z-[65] flex h-11 w-11 items-center justify-center rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/60 text-[var(--white)] xl:hidden"
            >
              <span className="sr-only">Menü</span>
              <div className="relative h-4 w-5">
                <span
                  style={{
                    transform: mobileOpen
                      ? 'translate3d(0, 7px, 0) rotate(45deg)'
                      : 'translate3d(0, 0, 0) rotate(0)',
                  }}
                  className="absolute left-0 top-0 h-[2px] w-5 bg-[var(--white)] transition-transform duration-300"
                />
                <span
                  style={{ opacity: mobileOpen ? 0 : 1 }}
                  className="absolute left-0 top-[7px] h-[2px] w-3.5 bg-[var(--orange)] transition-opacity duration-200"
                />
                <span
                  style={{
                    transform: mobileOpen
                      ? 'translate3d(0, -7px, 0) rotate(-45deg)'
                      : 'translate3d(0, 0, 0) rotate(0)',
                  }}
                  className="absolute left-0 bottom-0 h-[2px] w-5 bg-[var(--white)] transition-transform duration-300"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Tam Ekran Mobil Navy Menü Paneli */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation-panel"
            data-theme="dark"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[58] flex flex-col justify-between bg-[var(--navy-deep)] grain-surface px-6 pt-28 pb-10 xl:hidden overflow-y-auto"
          >
            <nav aria-label="Mobil ana menü" className="relative z-10 flex flex-col gap-3">
              {navItems.map((item, idx) => {
                const active =
                  item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to);

                return (
                  <div key={item.to} className="overflow-hidden border-b border-white/10 pb-3">
                    <motion.div
                      initial={reducedMotion ? { opacity: 0 } : { y: 36, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reducedMotion ? { opacity: 0 } : { y: 20, opacity: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: reducedMotion ? 0 : 0.05 * idx,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <TransitionLink
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between font-serif-heritage text-3xl sm:text-4xl font-semibold ${
                          active ? 'text-[var(--orange)]' : 'text-[var(--white)]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="font-industrial text-sm tracking-[0.2em] text-white/40">
                          0{idx + 1}
                        </span>
                      </TransitionLink>
                    </motion.div>
                  </div>
                );
              })}
            </nav>

            <div className="relative z-10 mt-8 border-t border-white/15 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[var(--gray)]">
                  Acar Grup Holding A.Ş. · 1974&apos;ten Beri
                </p>
                <p className="mt-1 text-sm text-white/80">
                  +90 (212) 310 19 74 · kurumsal@acargrup.com.tr
                </p>
              </div>
              <TransitionLink
                to="/iletisim"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-[2px] bg-[var(--orange)] px-6 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)]"
              >
                Bize Ulaşın
              </TransitionLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

