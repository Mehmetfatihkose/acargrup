import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { useProject } from '../api/queries';
import { SEO } from '../components/SEO';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { ProjectCard } from '../components/ProjectCard';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { TransitionLink } from '../components/PageTransition';
import { CTASection } from '../components/home/CTASection';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Proje Detay Sayfası (/projeler/:slug):
 * - Uzun proje açıklama paragrafları: yalnızca basit fade-in (3.3 kuralı)
 * - Teknik özellik tablosu: hiçbir giriş animasyonu yok (3.3 kuralı)
 * - Sürüklenebilir yatay proje görsel galerisi ([data-cursor="drag"])
 */
export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useProject(slug);
  const reducedMotion = useReducedMotion();
  const narrativeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = narrativeRef.current;
    if (!el || reducedMotion || !project) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        { opacity: 1, duration: 0.75, ease: 'power2.out' }
      );
    }, el);

    return () => ctx.revert();
  }, [project, reducedMotion]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--navy-deep)] pt-36 px-8 text-center text-white/70">
        Proje detayları yükleniyor...
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-[var(--navy-deep)] pt-40 px-6 text-center text-[var(--white)]">
        <h1 className="font-serif-heritage text-4xl font-semibold">Proje Bulunamadı</h1>
        <p className="mt-3 text-white/70">Aradığınız proje kaydı mevcut değil veya taşınmış olabilir.</p>
        <TransitionLink
          to="/projeler"
          className="mt-8 inline-flex rounded-[2px] bg-[var(--orange)] px-6 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)]"
        >
          Tüm Projelere Dön
        </TransitionLink>
      </div>
    );
  }

  const specs = [
    { label: 'Kategori / Disiplin', value: project.category },
    { label: 'Faaliyet Alanı', value: project.sector },
    { label: 'Proje Lokasyonu', value: project.location },
    { label: 'İşveren İdare / Kurum', value: project.client },
    { label: 'Tamamlanma Yılı', value: String(project.year) },
    { label: 'Yapım Süresi', value: project.duration },
    { label: 'Sözleşme Hacmi', value: project.budget_range },
  ];

  return (
    <>
      <SEO
        title={project.title}
        description={project.description.slice(0, 160)}
        path={`/projeler/${project.slug}`}
        image={project.cover_image}
      />

      <PageHeroBanner
        eyebrow={`${project.category} · ${project.year}`}
        title={project.title}
        subtitle={`${project.location} — ${project.client}`}
        image={project.cover_image}
        imageAlt={project.title}
        breadcrumbs={[
          { label: 'Anasayfa', to: '/' },
          { label: 'Projeler', to: '/projeler' },
          { label: project.title },
        ]}
      />

      <section
        data-theme="light"
        className="bg-[var(--paper)] text-[var(--navy)] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Sol: Uzun Proje Açıklaması (Yalnızca sade fade-in — 3.3) */}
            <div ref={narrativeRef} className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="h-[2px] w-8 bg-[var(--orange)]" aria-hidden="true" />
                <span className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--navy)]">
                  MÜHENDİSLİK KAPSAMI VE UYGULAMA DETAYLARI
                </span>
              </div>

              <div className="space-y-5 text-base sm:text-lg text-[var(--ink)] leading-[1.7] whitespace-pre-line">
                {project.description}
              </div>
            </div>

            {/* Sağ: Teknik Künye Tablosu (Hiçbir giriş animasyonu yok — 3.3) */}
            <div className="lg:col-span-5">
              <div className="rounded-[3px] border border-[var(--navy)]/15 bg-[var(--white)] p-6 sm:p-8">
                <h2 className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--navy)] pb-4 border-b border-[var(--navy)]/12">
                  Proje Teknik Künyesi
                </h2>
                <dl className="divide-y divide-[var(--navy)]/10">
                  {specs.map((row) => (
                    <div
                      key={row.label}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm"
                    >
                      <dt className="text-[var(--gray)] font-medium">{row.label}</dt>
                      <dd className="font-semibold text-[var(--navy)] sm:text-right">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* Sürüklenebilir Proje Fotoğraf Galerisi */}
          {project.images && project.images.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif-heritage text-3xl font-semibold text-[var(--navy)]">
                  Saha ve Uygulama Galerisi
                </h2>
                <span className="font-industrial text-xs tracking-[0.18em] uppercase text-[var(--gray)]">
                  Yana Kaydırın →
                </span>
              </div>

              <div
                data-cursor="drag"
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
              >
                {project.images.map((img) => (
                  <figure
                    key={img.id}
                    className="shrink-0 w-[86vw] sm:w-[540px] lg:w-[640px] snap-start overflow-hidden rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)]"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[var(--navy-deep)]">
                      <ResponsiveImage
                        src={img.image_url}
                        alt={img.caption || project.title}
                        sizes="(max-width: 768px) 86vw, 640px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="p-4 text-xs sm:text-sm text-[var(--ink)]">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* Benzer Projeler */}
          {project.related && project.related.length > 0 && (
            <div className="mt-24 pt-16 border-t border-[var(--navy)]/12">
              <h2 className="font-serif-heritage text-3xl sm:text-4xl font-semibold text-[var(--navy)] mb-10">
                Benzer Mühendislik Projeleri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {project.related.map((rel) => (
                  <ProjectCard key={rel.id} project={rel} theme="light" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default ProjectDetailPage;

