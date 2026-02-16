
import React, { useState, useCallback, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export const useDraggable = (
  initialPos: Position, 
  onDragEnd?: (pos: Position) => void,
  elementRef?: React.RefObject<HTMLDivElement | null>
) => {
  const [pos, setPos] = useState<Position>(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const currentPosRef = useRef<Position>(initialPos);
  const pointerIdRef = useRef<number | null>(null);

  const SAFE_MARGIN = 16;
  const HEADER_HEIGHT = 80; 
  const TOOL_SAFE_ZONE = 450;

  const getSafeZones = (): Rect[] => [
    { left: 0, top: 0, right: TOOL_SAFE_ZONE, bottom: HEADER_HEIGHT + 60 },
    { left: window.innerWidth - 300, top: 0, right: window.innerWidth, bottom: HEADER_HEIGHT + 60 },
    { left: window.innerWidth / 2 - 250, top: window.innerHeight - 120, right: window.innerWidth / 2 + 250, bottom: window.innerHeight }
  ];

  const isOverlapping = (a: Rect, b: Rect) => {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  };

  const validatePosition = useCallback((p: Position): Position => {
    if (!elementRef?.current) return p;
    
    const rect = elementRef.current.getBoundingClientRect();
    const width = rect.width || 280;
    const height = rect.height || 300;

    let newX = p.x;
    let newY = p.y;

    newX = Math.max(SAFE_MARGIN, Math.min(window.innerWidth - width - SAFE_MARGIN, newX));
    newY = Math.max(HEADER_HEIGHT + 10, Math.min(window.innerHeight - height - 100, newY));

    const panelRect: Rect = { left: newX, top: newY, right: newX + width, bottom: newY + height };
    
    getSafeZones().forEach(zone => {
      if (isOverlapping(panelRect, zone)) {
        if (panelRect.top < zone.bottom && zone.top === 0) {
          newY = zone.bottom + 10;
        }
        if (panelRect.left < zone.right && zone.left === 0) {
          newX = zone.right + 10;
        }
      }
    });

    return { x: newX, y: newY };
  }, [elementRef]);

  useEffect(() => {
    const valid = validatePosition(initialPos);
    setPos(valid);
    currentPosRef.current = valid;
  }, [initialPos.x, initialPos.y, validatePosition]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle')) {
      setIsDragging(true);
      pointerIdRef.current = e.pointerId;
      target.setPointerCapture(e.pointerId);
      
      dragStartPos.current = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      };
      e.preventDefault();
    }
  }, [pos]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || e.pointerId !== pointerIdRef.current) return;
      
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      setPos({ x: newX, y: newY });
      currentPosRef.current = { x: newX, y: newY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging && e.pointerId === pointerIdRef.current) {
        const finalValid = validatePosition(currentPosRef.current);
        setPos(finalValid);
        currentPosRef.current = finalValid;
        if (onDragEnd) onDragEnd(finalValid);
        
        const target = e.target as HTMLElement;
        if (target && target.releasePointerCapture) {
          target.releasePointerCapture(e.pointerId);
        }
      }
      setIsDragging(false);
      pointerIdRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, onDragEnd, validatePosition]);

  return { pos, setPos, onPointerDown, isDragging, validatePosition };
};
