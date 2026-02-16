
import { useState, useEffect, useCallback } from 'react';

export interface PanelLayout {
  id: string;
  pos: { x: number; y: number };
  width: string;
  isMinimized: boolean;
  hasOpened?: boolean;
}

const STORAGE_KEY = 'mimi_studio_layout_v4';
const SAFE_MARGIN = 20;

const getSmartDefault = (id: string, canvasRect?: DOMRect): PanelLayout => {
  const vW = window.innerWidth;
  const vH = window.innerHeight;
  
  // Se não temos o canvas ainda, usamos defaults seguros
  const refL = canvasRect?.left || 100;
  const refR = canvasRect?.right || vW - 100;
  const refT = canvasRect?.top || 150;
  const refB = canvasRect?.bottom || vH - 150;

  switch (id) {
    case 'colors':
      return { id, pos: { x: refL + SAFE_MARGIN, y: refT + SAFE_MARGIN }, width: '280px', isMinimized: true, hasOpened: false };
    case 'brush-settings':
      return { id, pos: { x: refR - 300, y: refT + SAFE_MARGIN }, width: '280px', isMinimized: true, hasOpened: false };
    case 'layers':
      return { id, pos: { x: refR - 330, y: refB - 420 }, width: '310px', isMinimized: true, hasOpened: false };
    default:
      return { id, pos: { x: vW / 2 - 150, y: vH / 2 - 150 }, width: '300px', isMinimized: true, hasOpened: false };
  }
};

export const useLayoutPersistence = (canvasRect?: DOMRect | null) => {
  const [layouts, setLayouts] = useState<Record<string, PanelLayout>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Efeito para posicionar pela primeira vez assim que o Canvas for medido
  useEffect(() => {
    if (!canvasRect) return;

    setLayouts(prev => {
      const next = { ...prev };
      let changed = false;

      ['colors', 'brush-settings', 'layers'].forEach(id => {
        if (!next[id] || !next[id].hasOpened) {
          next[id] = getSmartDefault(id, canvasRect);
          changed = true;
        }
      });

      if (changed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      }
      return prev;
    });
  }, [canvasRect]);

  const saveLayout = useCallback((id: string, updates: Partial<PanelLayout>) => {
    setLayouts(prev => {
      const current = prev[id] || getSmartDefault(id);
      const next = {
        ...prev,
        [id]: { ...current, ...updates, hasOpened: true }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { layouts, saveLayout };
};
