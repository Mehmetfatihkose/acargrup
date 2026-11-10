import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../api/types';
import { TransitionLink } from './PageTransition';
import { ResponsiveImage } from './ResponsiveImage';

interface ProjectCardProps {
  project: Project;
  theme?: 'dark' | 'light';
  onQuickSelect?: (project: Project) => void;
  layoutIdPrefix?: string;
}

/**
 * Kurumsal Proje Kartı:
 * - Hover: görsel 1.06 ölçeğe yavaşça zoom, turuncu "Projeyi İncele" etiketi alttan kayar
 * - [data-cursor="view"] ile özel imleçte "Gör" etiketi gösterilir
 * - onQuickSelect verilirse paylaşımlı eleman geçişi (shared layoutId) tetikler
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  theme = 'dark',
  onQuickSelect,
  layoutIdPrefix,
}) => {
  const isDark = theme === 'dark';

  const cardInner = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--navy-deep)]">
        <motion.div
          layoutId={layoutIdPrefix ? `${layoutIdPrefix}-img-${project.slug}` : undefined}
          className="h-full w-full"
        >
          <ResponsiveImage
            src={project.cover_image}
            alt={`${project.title} — ${project.location}`}
            sizes="(max-width: 768px) 92vw, (max-width: 1200px) 48vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </motion.div>

        {/* Kategori & Yıl Rozeti */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[var(--navy-deep)]/88 backdrop-blur-sm px-3 py-1.5 border border-white/15 rounded-[2px]">
          <span className="h-1.5 w-1.5 bg-[var(--orange)]" aria-hidden="true" />
          <span className="font-industrial text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--white)]">
            {project.category}
          </span>
          <span className="text-white/35">·</span>
          <span className="font-industrial text-[11px] tracking-[0.14em] text-white/75">
            {project.year}
          </span>
        </div>

        {/* Alttan kayan turuncu "Projeyi İncele" etiketi */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-[var(--orange)] px-5 py-3 text-[var(--white)] translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
          <span className="font-industrial text-xs font-bold tracking-[0.18em] uppercase">
            Projeyi İncele
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Alt Bilgi Alanı */}
      <div
        className={`flex flex-1 flex-col justify-between p-6 sm:p-7 border-x border-b rounded-b-[3px] transition-all duration-300 ${
          isDark
            ? 'bg-[var(--navy-light)]/50 border-white/10 group-hover:border-[var(--orange)]/60 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]'
            : 'bg-[var(--white)] border-[var(--navy)]/10 group-hover:border-[var(--navy)]/35 group-hover:shadow-[0_12px_28px_rgba(10,37,64,0.08)]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--orange)]" aria-hidden="true" />
            <p
              className={`text-xs font-semibold tracking-[0.16em] uppercase ${
                isDark ? 'text-white/65' : 'text-[var(--gray)]'
              }`}
            >
              {project.location}
            </p>
          </div>
          <h3
            className={`mt-2.5 font-serif-heritage text-2xl font-semibold leading-snug transition-colors duration-250 ${
              isDark ? 'text-[var(--white)] group-hover:text-[var(--white)]' : 'text-[var(--navy)] group-hover:text-[var(--navy)]'
            }`}
          >
            {project.title}
          </h3>
        </div>

        <div
          className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-white/10 text-white/70' : 'border-[var(--navy)]/10 text-[var(--ink)]'
          }`}
        >
          <span className="truncate pr-3 font-medium">{project.client}</span>
          <span className="font-industrial tracking-[0.14em] uppercase shrink-0 font-bold text-[var(--orange)]">
            {project.duration}
          </span>
        </div>
      </div>
    </>
  );

  if (onQuickSelect) {
    return (
      <motion.article
        layout
        layoutId={layoutIdPrefix ? `${layoutIdPrefix}-card-${project.slug}` : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        data-cursor="view"
        className="group flex flex-col h-full rounded-[3px] overflow-hidden"
      >
        <button
          type="button"
          onClick={() => onQuickSelect(project)}
          className="flex flex-col h-full w-full text-left"
        >
          {cardInner}
        </button>
      </motion.article>
    );
  }

  return (
    <article
      data-cursor="view"
      className="group flex flex-col h-full rounded-[3px] overflow-hidden"
    >
      <TransitionLink to={`/projeler/${project.slug}`} className="flex flex-col h-full">
        {cardInner}
      </TransitionLink>
    </article>
  );
};

