import React, { useRef } from 'react';
import { TransitionLink } from './PageTransition';
import { useMagnetic } from '../hooks/useMagnetic';

interface MagneticButtonProps {
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'orange' | 'cta-white' | 'outline-dark' | 'outline-light';
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * Manyetik Etkili Kurumsal Buton Bileşeni:
 * - Turuncu butonda yazı beyaz ve kalındır.
 * - Hover'da GPU dostu scaleX dolgu geçişi yapar.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  to,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'orange',
  children,
  className = '',
  ariaLabel,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useMagnetic(wrapperRef, 0.22);

  const baseStyles =
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-[2px] px-7 py-4 text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase transition-colors duration-300 select-none';

  const variantStyles: Record<NonNullable<MagneticButtonProps['variant']>, string> = {
    orange:
      'bg-[var(--orange)] text-[var(--white)] border border-[var(--orange)] hover:border-[var(--orange-hover)]',
    'cta-white':
      'bg-[var(--navy-deep)] text-[var(--white)] border border-white/30 hover:text-[var(--navy)] hover:border-[var(--white)]',
    'outline-dark':
      'bg-transparent text-[var(--white)] border border-white/25 hover:border-[var(--orange)] hover:text-[var(--white)]',
    'outline-light':
      'bg-transparent text-[var(--navy)] border border-[var(--navy)]/25 hover:border-[var(--navy)] hover:text-[var(--white)]',
  };

  const fillStyles: Record<NonNullable<MagneticButtonProps['variant']>, string> = {
    orange: 'bg-[var(--orange-hover)]',
    'cta-white': 'bg-[var(--white)]',
    'outline-dark': 'bg-[var(--orange)]',
    'outline-light': 'bg-[var(--navy)]',
  };

  const innerContent = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 ${fillStyles[variant]}`}
      />
      <span className="relative z-10 inline-flex items-center gap-3">{children}</span>
    </>
  );

  if (to) {
    return (
      <div ref={wrapperRef} className="inline-block">
        <TransitionLink
          to={to}
          aria-label={ariaLabel}
          className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
          {innerContent}
        </TransitionLink>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="inline-block">
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${baseStyles} ${variantStyles[variant]} disabled:opacity-50 ${className}`}
      >
        {innerContent}
      </button>
    </div>
  );
};

