
import { useState, useRef, useCallback } from 'react';

/**
 * Hook de Física Nativa (APEX v2.0 - Zero Dependencies)
 * Implementa "Squash and Stretch" para feedback sensorial tátil.
 */
export const useSquashStretch = (scale = 0.95, duration = 150) => {
  const ref = useRef<HTMLElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  const playPress = useCallback(() => {
    setIsPressed(true);
    if (ref.current) {
      ref.current.animate([
        { transform: 'scale(1)' },
        { transform: `scale(${scale})` }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring-like
        fill: 'forwards'
      });
    }
  }, [scale, duration]);

  const playRelease = useCallback(() => {
    setIsPressed(false);
    if (ref.current) {
      ref.current.animate([
        { transform: `scale(${scale})` },
        { transform: 'scale(1.05)' }, // Overshoot (Bounce)
        { transform: 'scale(1)' }
      ], {
        duration: duration * 1.5,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'forwards'
      });
    }
  }, [scale, duration]);

  return { ref, isPressed, playPress, playRelease };
};
