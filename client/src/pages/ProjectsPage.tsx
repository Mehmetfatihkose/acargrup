import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProjects } from '../api/queries';
import { SEO } from '../components/SEO';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { ProjectCard } from '../components/ProjectCard';
import { CTASection } from '../components/home/CTASection';
import { useReducedMotion } from '../hooks/useReducedMotion';

const categories = ['Tümü', 'Demiryolu', 'Karayolu', 'Altyapı', 'Bina'] as const;

export const ProjectsPage: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: projects = [], isLoading } = useProjects(selectedCategory, searchTerm);

  return (
    <>
      <SEO
        title="Proje Portföyümüz — Demiryolu, Köprü, Tünel ve Üstyapı"
        description="Acar Grup tarafından tamamlanan yüksek hızlı tren koridorları, viyadükler, TBM tüneller, otoyollar ve endüstriyel üstyapı projelerini inceleyin."
        path="/projeler"
        image="/media/hero-railway.webp"
      />

      <PageHeroBanner
        eyebrow="REFERANS MÜHENDİSLİK ESERLERİ"
        title="Tüm Projelerimiz"
        subtitle="1974'ten bugüne Türkiye'nin dört bir yanında tamamladığımız yüksek mühendislik standartlarındaki altyapı, demiryolu ve üstyapı projeleri."
        image="/media/hero-railway.webp"
        imageAlt="Acar Grup tamamlanan demiryolu ve altyapı projeleri"
        breadcrumbs={[{ label: 'Anasayfa', to: '/' }, { label: 'Projeler' }]}
      />

      <section
        data-theme="light"
        className="bg-[var(--paper)] text-[var(--navy)] py-20 sm:py-28 min-h-[70vh]"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          {/* Üst Filtre ve Arama Alanı */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-[var(--navy)]/12 pb-6">
            <div
              role="tablist"
              aria-label="Proje sektör filtresi"
              className="flex flex-wrap items-center gap-2 sm:gap-4"
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-4 py-2.5 rounded-[2px] font-industrial text-sm font-bold tracking-[0.16em] uppercase transition-all duration-200 ${
                      active
                        ? 'bg-[var(--navy)] text-[var(--white)] shadow-sm'
                        : 'bg-transparent text-[var(--gray)] hover:text-[var(--navy)] hover:bg-[var(--navy)]/5'
                    }`}
                  >
                    <span>{cat}</span>
                    {active && (
                      <motion.span
                        layoutId="projects-page-tab-pill"
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 rounded-[2px] bg-[var(--navy)] -z-10"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Arama Alanı ve Canlı Sayaç */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              {!isLoading && (
                <span className="font-industrial text-xs font-semibold tracking-[0.16em] uppercase text-[var(--gray)] shrink-0">
                  <strong className="text-[var(--navy)] font-bold">{projects.length}</strong> Proje Listeleniyor
                </span>
              )}

              <div className="relative w-full sm:w-80">
                <label htmlFor="project-search" className="sr-only">
                  Proje, lokasyon veya işveren ara
                </label>
                <input
                  id="project-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Proje, şehir veya kurum ara..."
                  className="w-full rounded-[2px] border border-[var(--navy)]/20 bg-[var(--white)] pl-4 pr-10 py-2.5 text-sm text-[var(--navy)] placeholder:text-[var(--gray)] focus:border-[var(--orange)] focus:ring-1 focus:ring-[var(--orange)] focus:outline-none transition-all shadow-xs"
                />
                {searchTerm ? (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Aramayı temizle"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--gray)] hover:text-[var(--navy)]"
                  >
                    ✕
                  </button>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--gray)]"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Proje Kartları Gridi */}
          {isLoading ? (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-[3px] bg-[var(--white)] border border-[var(--navy)]/10 animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="mt-16 rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)] p-12 text-center max-w-xl mx-auto shadow-xs">
              <span className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--orange)]">
                SONUÇ BULUNAMADI
              </span>
              <p className="mt-2 font-serif-heritage text-2xl font-semibold text-[var(--navy)]">
                Arama kriterlerinize uygun proje kaydı bulunamadı.
              </p>
              <p className="mt-2 text-sm text-[var(--gray)]">
                Farklı bir arama terimi deneyebilir veya kategori filtresini sıfırlayabilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Tümü');
                  setSearchTerm('');
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-[2px] bg-[var(--navy)] px-6 py-3 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] hover:bg-[var(--orange)] transition-colors"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          ) : (
            <motion.div
              layout={!reducedMotion}
              className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout={!reducedMotion}
                    initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProjectCard project={project} theme="light" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default ProjectsPage;
