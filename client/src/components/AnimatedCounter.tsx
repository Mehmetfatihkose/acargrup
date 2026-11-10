import React, { useRef } from 'react';
import { useCounter } from '../hooks/useCounter';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
  showDivider?: boolean;
}

/**
 * İstatistik Sütunu Bileşeni:
 * - Görünür olunca sayılar 0'dan hedefe sayar (2s, power2.out)
 * - "+" işareti sayım bitince belirir
 * - Sütunlar arasındaki dikey ince çizgi yukarıdan aşağıya çizilir
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '+',
  label,
  showDivider = false,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { formattedValue, completed } = useCounter(itemRef, value, 2);

  return (
    <div ref={itemRef} className="relative px-4 py-6 sm:px-8 sm:py-8">
      {showDivider && (
        <span
          data-stat-divider
          aria-hidden="true"
          style={{ transformOrigin: '50% 0%' }}
          className="hidden lg:block absolute left-0 top-4 bottom-4 w-[1px] bg-white/15"
        />
      )}

      <div className="flex items-baseline gap-1">
        <span className="font-industrial text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--white)] tabular-nums">
          {formattedValue}
        </span>
        {suffix && (
          <span
            className={`font-industrial text-3xl sm:text-4xl font-bold text-[var(--orange)] transition-all duration-300 ${
              completed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-75'
            }`}
          >
            {suffix}
          </span>
        )}
      </div>

      <p
        data-stat-label
        className="mt-3 text-xs sm:text-sm font-medium tracking-[0.14em] uppercase text-white/75"
      >
        {label}
      </p>
    </div>
  );
};

