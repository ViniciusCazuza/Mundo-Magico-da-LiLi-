
import React, { useState } from 'react';
import { useDockMagnification } from './useDockMagnification';
import { DockTooltip } from './DockTooltip';

interface DockItem {
  id: string;
  title: string;
  icon: React.ElementType;
}

interface DockProps {
  items: DockItem[];
  onRestore: (id: string) => void;
}

export const Dock: React.FC<DockProps> = ({ items, onRestore }) => {
  const { dockRef, scales, handlePointerMove, handlePointerLeave: originalPointerLeave } = useDockMagnification(items.length);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (items.length === 0) return null;

  const handlePointerLeave = () => {
    setHoveredId(null);
    originalPointerLeave();
  };

  const BASE_SIZE = 46;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-end animate-fade-in pointer-events-none touch-none">
      <div className="relative inline-flex items-end pointer-events-auto">
        
        <div 
          className="absolute inset-0 bg-[var(--surface)]/70 backdrop-blur-3xl border border-[var(--border-color)] rounded-[2.2rem] shadow-[var(--shadow-elevated)] transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] -z-10"
        />

        <div 
          ref={dockRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="flex items-end gap-3 px-5 py-3 transition-all duration-300 touch-none"
        >
          {items.map((item, index) => {
            const scale = scales[index] || 1;
            const Icon = item.icon;
            const isHovered = hoveredId === item.id;
            const dynamicSize = BASE_SIZE * scale;

            return (
              <div
                key={item.id}
                onPointerEnter={() => setHoveredId(item.id)}
                onPointerLeave={() => setHoveredId(null)}
                className="relative flex items-center justify-center shrink-0 transition-all duration-200 ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ 
                  width: `${dynamicSize}px`,
                  height: `${dynamicSize}px`,
                  marginRight: scale > 1.2 ? `${(scale - 1) * 3}px` : '0px',
                  marginLeft: scale > 1.2 ? `${(scale - 1) * 3}px` : '0px',
                }}
              >
                <DockTooltip label={item.title} visible={isHovered} />

                <button
                  onClick={() => onRestore(item.id)}
                  className={`
                    group relative w-full h-full rounded-2xl flex items-center justify-center 
                    transition-all duration-150 active:scale-90
                    ${isHovered 
                      ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-[0_15px_30px_-5px_var(--primary)] scale-105 brightness-110' 
                      : 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-md'
                    }
                  `}
                  style={{ 
                    borderRadius: `${14 * scale}px`,
                  }}
                >
                  <Icon size={Math.round(20 * (1 + (scale - 1) * 0.4))} />
                  
                  <div 
                    className="absolute -bottom-1.5 w-1 h-1 bg-[var(--text-on-primary)] rounded-full transition-all duration-300"
                    style={{ 
                      opacity: scale > 1.1 ? 1 : 0.5,
                      transform: `scale(${scale})`
                    }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
