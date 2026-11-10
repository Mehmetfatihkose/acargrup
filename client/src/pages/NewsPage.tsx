import React, { useRef } from 'react';
import { useNews } from '../api/queries';
import { SEO } from '../components/SEO';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { TransitionLink } from '../components/PageTransition';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { formatTurkishDate } from '../components/home/NewsSection';
import { CTASection } from '../components/home/CTASection';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const NewsPage: React.FC = () => {
  const { data: news = [] } = useNews();
  const gridRef = useRef<HTMLElement>(null);
  useScrollReveal(gridRef, { selector: '[data-news-item]', y: 28, stagger: 0.09 });

  return (
    <>
      <SEO
        title="Haberler ve Kurumsal Duyurular"
        description="Acar Grup şantiyelerinden güncel gelişmeler, tamamlanan demiryolu etapları, polimer lojistik yatırımları ve sürdürülebilirlik duyuruları."
        path="/haberler"
      />

      <PageHeroBanner
        eyebrow="BASIN ODASI & KURUMSAL GÜNDEM"
        title="Haberler ve Duyurular"
        subtitle="Şantiyelerimizden mühendislik başarıları, polimer tedarik yatırımlarımız ve sürdürülebilirlik adımlarımız hakkında en güncel bilgiler."
        image="/media/tunnel-tbm.webp"
        imageAlt="Acar Grup kurumsal haberler ve proje duyuruları"
        breadcrumbs={[{ label: 'Anasayfa', to: '/' }, { label: 'Haberler' }]}
      />

      <section
        ref={gridRef}
        data-theme="light"
        className="bg-[var(--paper)] text-[var(--navy)] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                data-news-item
                data-cursor="view"
                className="group flex flex-col justify-between overflow-hidden rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)]"
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

                      <h2 className="mt-3 font-serif-heritage text-2xl font-semibold text-[var(--navy)] leading-snug">
                        <span className="bg-gradient-to-r from-[var(--orange)] to-[var(--orange)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-400 group-hover:bg-[length:100%_2px] pb-0.5">
                          {item.title}
                        </span>
                      </h2>

                      <p className="mt-3 text-sm text-[var(--ink)] leading-[1.65]">
                        {item.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--navy)]/10 flex items-center justify-between">
                      <span className="font-industrial text-xs font-bold tracking-[0.18em] uppercase text-[var(--navy)]">
                        Devamını Oku
                      </span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
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

      <CTASection />
    </>
  );
};

export default NewsPage;

