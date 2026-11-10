import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { useNews, useNewsItem } from '../api/queries';
import { SEO } from '../components/SEO';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { TransitionLink } from '../components/PageTransition';
import { formatTurkishDate } from '../components/home/NewsSection';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Haber Detay Sayfası (/haberler/:slug):
 * - Uzun haber içeriği paragrafları yalnızca sade fade-in ile açılır (kelime/harf/kayma yok — 3.3 kuralı)
 */
export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useNewsItem(slug);
  const { data: allNews = [] } = useNews();
  const reducedMotion = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || reducedMotion || !article) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.75, ease: 'power2.out' });
    }, el);

    return () => ctx.revert();
  }, [article, reducedMotion]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--navy-deep)] pt-36 px-8 text-center text-white/70">
        Haber içeriği yükleniyor...
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-[var(--navy-deep)] pt-40 px-6 text-center text-[var(--white)]">
        <h1 className="font-serif-heritage text-4xl font-semibold">Duyuru Bulunamadı</h1>
        <TransitionLink
          to="/haberler"
          className="mt-8 inline-flex rounded-[2px] bg-[var(--orange)] px-6 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)]"
        >
          Tüm Haberlere Dön
        </TransitionLink>
      </div>
    );
  }

  const otherNews = allNews.filter((n) => n.slug !== article.slug).slice(0, 3);

  return (
    <>
      <SEO
        title={article.title}
        description={article.summary}
        path={`/haberler/${article.slug}`}
        image={article.image}
        type="article"
      />

      <PageHeroBanner
        eyebrow={formatTurkishDate(article.published_at)}
        title={article.title}
        subtitle={article.summary}
        image={article.image}
        imageAlt={article.title}
        breadcrumbs={[
          { label: 'Anasayfa', to: '/' },
          { label: 'Haberler', to: '/haberler' },
          { label: 'Duyuru Detayı' },
        ]}
      />

      <section
        data-theme="light"
        className="bg-[var(--white)] text-[var(--navy)] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <article ref={bodyRef} className="lg:col-span-8">
            <div className="space-y-6 text-base sm:text-lg text-[var(--ink)] leading-[1.75] whitespace-pre-line">
              {article.content}
            </div>

            <div className="mt-12 pt-8 border-t border-[var(--navy)]/12">
              <TransitionLink
                to="/haberler"
                className="inline-flex items-center gap-2 border-b-2 border-transparent pb-1 font-industrial text-xs font-bold tracking-[0.18em] uppercase text-[var(--navy)] hover:border-[var(--orange)] transition-colors"
              >
                <span>← Tüm Haberler ve Duyurular</span>
              </TransitionLink>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="rounded-[3px] border border-[var(--navy)]/12 bg-[var(--paper)] p-6 sm:p-8">
              <h2 className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--navy)] pb-4 border-b border-[var(--navy)]/12">
                Diğer Kurumsal Duyurular
              </h2>
              <div className="mt-5 space-y-5 divide-y divide-[var(--navy)]/10">
                {otherNews.map((item) => (
                  <div key={item.id} className="pt-5 first:pt-0">
                    <time className="block font-industrial text-[11px] tracking-[0.16em] uppercase text-[var(--gray)]">
                      {formatTurkishDate(item.published_at)}
                    </time>
                    <TransitionLink
                      to={`/haberler/${item.slug}`}
                      className="mt-1 block font-serif-heritage text-xl font-semibold text-[var(--navy)] hover:underline"
                    >
                      {item.title}
                    </TransitionLink>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default NewsDetailPage;
