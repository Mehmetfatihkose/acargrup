import React, { useRef } from 'react';
import type { NewsItem } from '../../api/types';
import { SectionTitle } from '../SectionTitle';
import { MagneticButton } from '../MagneticButton';
import { TransitionLink } from '../PageTransition';
import { ResponsiveImage } from '../ResponsiveImage';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface NewsSectionProps {
  news: NewsItem[];
}

export function formatTurkishDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Haberler ve Duyurular Bölümü (Açık Zemin --paper):
 * - Kartlar stagger ile alttan yükselir
 * - Hover: görsel zoom, başlık altı turuncu çizgi soldan sağa uzar
 */
export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { selector: '[data-news-card]', y: 28, stagger: 0.1 });

  const latest = news.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="bg-[var(--paper)] text-[var(--navy)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrow="GÜNCEL GELİŞMELER & BASIN ODASI"
            title="Haberler ve Duyurular"
            theme="light"
          />

          <MagneticButton to="/haberler" variant="outline-light">
            <span>Tüm Duyurular</span>
            <span aria-hidden="true">→</span>
          </MagneticButton>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {latest.map((item) => (
            <article
              key={item.id}
              data-news-card
              data-cursor="view"
              className="group flex flex-col justify-between overflow-hidden rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)] shadow-[0_2px_10px_rgba(10,37,64,0.04)] transition-all duration-300 hover:border-[var(--navy)]/40 hover:shadow-[0_12px_28px_rgba(10,37,64,0.1)] hover:-translate-y-1"
            >
              <TransitionLink to={`/haberler/${item.slug}`} className="flex flex-col h-full">
                <div className="aspect-[16/10] w-full overflow-hidden bg-[var(--navy-deep)]">
                  <ResponsiveImage
                    src={item.image}
                    alt={item.title}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <time
                      dateTime={item.published_at}
                      className="font-industrial text-xs font-semibold tracking-[0.16em] uppercase text-[var(--gray)]"
                    >
                      {formatTurkishDate(item.published_at)}
                    </time>

                    <h3 className="mt-3 font-serif-heritage text-2xl font-semibold text-[var(--navy)] leading-snug">
                      <span className="bg-gradient-to-r from-[var(--orange)] to-[var(--orange)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-400 group-hover:bg-[length:100%_2px] pb-0.5">
                        {item.title}
                      </span>
                    </h3>

                    <p className="mt-3 text-sm text-[var(--ink)] leading-[1.65] line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--navy)]/10 flex items-center justify-between">
                    <span className="font-industrial text-xs font-bold tracking-[0.18em] uppercase text-[var(--navy)]">
                      Haberi Oku
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[var(--navy)] transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </div>
                </div>
              </TransitionLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

