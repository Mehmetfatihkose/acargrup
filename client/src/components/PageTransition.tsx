import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, type LinkProps, useLocation, useNavigate } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLenis } from '../lib/lenisContext';
import { Logo } from './Logo';

interface PageTransitionContextValue {
  navigateTo: (to: string) => void;
  isTransitioning: boolean;
  revealTick: number;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigateTo: () => {},
  isTransitioning: false,
  revealTick: 0,
});

/**
 * Sayfa Geçiş Perdesi (Tüm rotalar arası):
 * Navy perde aşağıdan yukarı kayarak ekranı kaplar (0.48s), sayfa değişir,
 * perde yukarı çıkarak açılır (0.48s). Perde üzerinde küçük logo ve turuncu ince çizgi bulunur.
 */
export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const { lenis } = useLenis();

  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainInnerRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef<boolean>(false);
  const lastPathnameRef = useRef<string>(location.pathname);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [revealTick, setRevealTick] = useState(1);

  // Tarayıcı geri/ileri butonlarıyla rota değişirse scroll'u sıfırla ve başlık girişini tetikle
  useEffect(() => {
    if (lastPathnameRef.current !== location.pathname) {
      lastPathnameRef.current = location.pathname;
      if (!animatingRef.current) {
        if (lenis) lenis.scrollTo(0, { immediate: true });
        window.scrollTo({ top: 0, behavior: 'auto' });
        setRevealTick((t) => t + 1);
        window.setTimeout(() => ScrollTrigger.refresh(), 120);
      }
    }
  }, [location.pathname, lenis]);

  const navigateTo = useCallback(
    (to: string) => {
      const targetUrl = new URL(to, window.location.origin);
      if (
        targetUrl.pathname === location.pathname &&
        targetUrl.search === location.search
      ) {
        if (targetUrl.hash) {
          const el = document.querySelector(targetUrl.hash);
          el?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        }
        return;
      }

      if (reducedMotion || !curtainRef.current) {
        navigate(to);
        window.scrollTo({ top: 0, behavior: 'auto' });
        setRevealTick((t) => t + 1);
        return;
      }

      if (animatingRef.current) return;
      animatingRef.current = true;
      setIsTransitioning(true);

      const curtain = curtainRef.current;
      const inner = curtainInnerRef.current;

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(curtain, { yPercent: 100, pointerEvents: 'none' });
          animatingRef.current = false;
          setIsTransitioning(false);
          ScrollTrigger.refresh();
        },
      });

      gsap.set(curtain, { yPercent: 100, pointerEvents: 'auto' });
      if (inner) gsap.set(inner, { opacity: 0, y: 16 });

      // 1. Aşama: Navy perde aşağıdan yukarı ekranı kaplar (0.48s)
      tl.to(curtain, {
        yPercent: 0,
        duration: 0.48,
        ease: 'expo.inOut',
      });

      if (inner) {
        tl.to(
          inner,
          {
            opacity: 1,
            y: 0,
            duration: 0.22,
            ease: 'power2.out',
          },
          '-=0.22'
        );
      }

      // Rota değişimi ve en üste konumlanma
      tl.add(() => {
        lastPathnameRef.current = targetUrl.pathname;
        navigate(to);
        if (lenis) lenis.scrollTo(0, { immediate: true });
        window.scrollTo({ top: 0, behavior: 'auto' });
        setRevealTick((t) => t + 1);
      });

      // Kısa nefeste logo solarken perde yukarı çıkarak açılır (0.48s)
      if (inner) {
        tl.to(inner, {
          opacity: 0,
          y: -14,
          duration: 0.18,
          ease: 'power2.in',
          delay: 0.06,
        });
      }

      tl.to(
        curtain,
        {
          yPercent: -100,
          duration: 0.48,
          ease: 'expo.inOut',
        },
        '-=0.06'
      );
    },
    [location.pathname, location.search, navigate, reducedMotion, lenis]
  );

  return (
    <PageTransitionContext.Provider value={{ navigateTo, isTransitioning, revealTick }}>
      {children}

      {/* Sayfa Geçiş Perdesi */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{ transform: 'translateY(100%)', pointerEvents: 'none' }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--navy-deep)] grain-surface"
      >
        <div ref={curtainInnerRef} className="relative z-10 flex flex-col items-center gap-4">
          <Logo variant="dark" showSince={false} />
          <div className="h-[2px] w-28 bg-[var(--orange)]" />
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
};

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

/**
 * Sayfa geçiş perdesini tetikleyen erişilebilir Link sarmalayıcısı
 */
export const TransitionLink: React.FC<LinkProps> = ({ to, onClick, children, ...rest }) => {
  const { navigateTo } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      rest.target === '_blank'
    ) {
      return;
    }

    if (typeof to === 'string' && (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:'))) {
      return;
    }

    e.preventDefault();
    const path = typeof to === 'string' ? to : `${to.pathname || ''}${to.search || ''}${to.hash || ''}`;
    navigateTo(path);
  };

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};

