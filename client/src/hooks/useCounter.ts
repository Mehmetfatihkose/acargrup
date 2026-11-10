import { useEffect, useState, type RefObject } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Görünür olduğunda 0'dan hedef değere 2 saniyede (power2.out) sayan sayaç hook'u.
 * Sayım tamamlandığında completed=true döner ("+" işaretinin belirmesi için).
 */
export function useCounter(
  triggerRef: RefObject<HTMLElement | null>,
  targetValue: number,
  duration = 2
) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(() =>
    reducedMotion ? targetValue : 0
  );
  const [completed, setCompleted] = useState<boolean>(() => reducedMotion);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    if (reducedMotion) {
      setDisplayValue(targetValue);
      setCompleted(true);
      return;
    }

    const counterObj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counterObj, {
        val: targetValue,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        onUpdate: () => {
          setDisplayValue(Math.round(counterObj.val));
        },
        onComplete: () => {
          setDisplayValue(targetValue);
          setCompleted(true);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [triggerRef, targetValue, duration, reducedMotion]);

  return {
    formattedValue: displayValue.toLocaleString('tr-TR'),
    completed,
  };
}

