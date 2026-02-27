
import React, { useEffect, useRef, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDraggable } from '../hooks/useDraggable';

interface StudioPanelProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  initialPos: { x: number; y: number };
  width?: string;
  id: string;
  isMinimized?: boolean;
  onMinimize?: (id: string) => void;
  onPositionChange?: (id: string, pos: { x: number, y: number }) => void;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({ 
  title, icon: Icon, children, initialPos, width = "260px", id, isMinimized, onMinimize, onPositionChange 
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const DOCK_RESERVE = 120;

  const { pos, setPos, onPointerDown, isDragging, validatePosition } = useDraggable(
    initialPos, 
    (finalPos) => onPositionChange?.(id, finalPos),
    panelRef
  );

  useEffect(() => {
    if (!panelRef.current || isMinimized || isDragging) return;

    const checkGrowthCollision = () => {
      if (!panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      const bottomLimit = window.innerHeight - DOCK_RESERVE;

      if (rect.bottom > bottomLimit) {
        const final = validatePosition({ x: pos.x, y: pos.y - (rect.bottom - bottomLimit) });
        setPos(final);
      }
    };

    const observer = new ResizeObserver(checkGrowthCollision);
    observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, [isMinimized, isDragging, pos, validatePosition, setPos]);

  const dynamicMaxContentHeight = useMemo(() => {
    const availableHeight = window.innerHeight - pos.y - DOCK_RESERVE - 60;
    return `${Math.max(150, availableHeight)}px`;
  }, [pos.y]);

  if (isMinimized) return null;

  return (
    <div 
      ref={panelRef}
      style={{ 
        left: pos.x, 
        top: pos.y, 
        width: width,
        zIndex: isDragging ? 1000 : 50,
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--surface)',
        backdropFilter: 'blur(32px)',
        transition: isDragging ? 'none' : 'top 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.2s ease'
      }}
      className={`
        fixed rounded-[2.5rem] border shadow-2xl flex flex-col overflow-hidden touch-none
        ${isDragging ? 'shadow-2xl scale-[1.03] opacity-90' : 'animate-fade-in'}
      `}
    >
      <div 
        onPointerDown={onPointerDown}
        className="drag-handle h-12 shrink-0 px-5 flex items-center justify-between cursor-move bg-black/5 hover:bg-black/10 transition-colors select-none group touch-none"
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className="text-[var(--primary)] group-hover:scale-125 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            {title}
          </span>
        </div>
        
        <button 
          onClick={() => onMinimize?.(id)}
          className="p-2 hover:bg-white/30 rounded-2xl text-[var(--text-muted)] hover:text-[var(--primary)] transition-all active:scale-90"
        >
          <ChevronDown size={18}/>
        </button>
      </div>

      <div 
        className="flex-1 overflow-y-auto no-scrollbar p-6"
        style={{ maxHeight: dynamicMaxContentHeight }}
      >
        {children}
      </div>
    </div>
  );
};
