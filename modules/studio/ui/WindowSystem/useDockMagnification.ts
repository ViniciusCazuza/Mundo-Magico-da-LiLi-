
import React, { useState, useCallback, useEffect, useRef } from 'react';

export const useDockMagnification = (iconCount: number) => {
  const [scales, setScales] = useState<number[]>(new Array(iconCount).fill(1));
  const dockRef = useRef<HTMLDivElement>(null);
  const pointerX = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  const calculateScales = useCallback(() => {
    if (!dockRef.current || pointerX.current === null) {
      setScales(new Array(iconCount).fill(1));
      return;
    }

    const rect = dockRef.current.getBoundingClientRect();
    const relativePointerX = pointerX.current - rect.left;
    
    const radius = 180;
    const maxScale = 0.75;
    
    const newScales = new Array(iconCount).fill(1).map((_, i) => {
      const items = dockRef.current!.children;
      if (!items[i]) return 1;
      
      const itemRect = items[i].getBoundingClientRect();
      const iconCenterX = (itemRect.left - rect.left) + itemRect.width / 2;
      const distance = Math.abs(relativePointerX - iconCenterX);

      if (distance < radius) {
        const influence = Math.cos((distance / radius) * (Math.PI / 2));
        const easedInfluence = Math.pow(influence, 2); 
        return 1 + easedInfluence * maxScale;
      }
      return 1;
    });

    setScales(newScales);
    rafId.current = requestAnimationFrame(calculateScales);
  }, [iconCount]);

  const handlePointerMove = (e: React.PointerEvent) => {
    pointerX.current = e.clientX;
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(calculateScales);
    }
  };

  const handlePointerLeave = () => {
    pointerX.current = null;
    cancelAnimationFrame(rafId.current);
    rafId.current = 0;
    setScales(new Array(iconCount).fill(1));
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return { dockRef, scales, handlePointerMove, handlePointerLeave };
};
