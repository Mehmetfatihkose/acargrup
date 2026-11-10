import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { TransitionLink } from '../components/PageTransition';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * 404 Sayfası:
 * 3.3 Bilinçli Sadelik kuralı gereği sade, tek basit giriş animasyonu.
 */
export const NotFoundPage: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <SEO
        title="404 — Sayfa Bulunamadı"
        description="Aradığınız sayfa bulunamadı veya taşınmış olabilir."
        path="/404"
      />

      <section
        data-theme="dark"
        className="min-h-[82vh] flex items-center justify-center bg-[var(--navy-deep)] text-[var(--white)] grain-surface px-5 pt-28 pb-20"
      >
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl text-center"
        >
          <span className="font-industrial text-7xl sm:text-9xl font-bold tracking-wider text-[var(--orange)]">
            404
          </span>
          <h1 className="mt-4 font-serif-heritage text-3xl sm:text-5xl font-semibold">
            Aradığınız Hat Bulunamadı
          </h1>
          <p className="mt-4 text-base text-white/75 leading-[1.65]">
            Ulaşmaya çalıştığınız sayfa kaldırılmış, adresi değişmiş veya geçici olarak
            kullanım dışı olabilir.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <TransitionLink
              to="/"
              className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--orange)] px-7 py-4 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] hover:bg-[var(--orange-hover)] transition-colors"
            >
              <span>Anasayfaya Dön</span>
              <span aria-hidden="true">→</span>
            </TransitionLink>
            <TransitionLink
              to="/iletisim"
              className="inline-flex items-center gap-2 rounded-[2px] border border-white/25 px-7 py-4 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] hover:border-[var(--orange)] transition-colors"
            >
              <span>İletişim</span>
            </TransitionLink>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default NotFoundPage;

