import { useEffect, useState } from 'react';

/**
 * Masaüstü ekran (>= 768px) ve hassas imleç (dokunmatik olmayan cihaz) durumunu döndürür.
 */
export function useIsDesktop(): { isDesktop: boolean; hasFinePointer: boolean } {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return { isDesktop: false, hasFinePointer: false };
    }
    return {
      isDesktop: window.matchMedia('(min-width: 768px)').matches,
      hasFinePointer: window.matchMedia('(pointer: fine)').matches,
    };
  });

  useEffect(() => {
    const desktopMq = window.matchMedia('(min-width: 768px)');
    const pointerMq = window.matchMedia('(pointer: fine)');

    const update = () => {
      setState({
        isDesktop: desktopMq.matches,
        hasFinePointer: pointerMq.matches,
      });
    };

    update();
    desktopMq.addEventListener('change', update);
    pointerMq.addEventListener('change', update);

    return () => {
      desktopMq.removeEventListener('change', update);
      pointerMq.removeEventListener('change', update);
    };
  }, []);

  return state;
}

