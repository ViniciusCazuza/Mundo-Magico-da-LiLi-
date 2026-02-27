
import React from 'react';

interface DockTooltipProps {
  label: string;
  visible: boolean;
}

/**
 * DockTooltip - Máxima visibilidade para o Ateliê da Alice.
 * O fundo usa a cor primária dinâmica do tema.
 */
export const DockTooltip: React.FC<DockTooltipProps> = ({ label, visible }) => {
  return (
    <div 
      className={`
        absolute -top-16 left-1/2 -translate-x-1/2 
        px-5 py-2.5 
        bg-[var(--primary)] border-2 border-white/30
        text-white text-[11px] font-black uppercase tracking-[0.2em] 
        rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]
        pointer-events-none whitespace-nowrap z-[1000]
        transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]
        ${visible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-75'}
      `}
    >
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{label}</span>
      
      {/* Seta do Tooltip */}
      <div 
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--primary)] rotate-45 border-r-2 border-b-2 border-white/10" 
      />
    </div>
  );
};
