
import React from 'react';

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  isAiMessage?: boolean;
}

export const MagicCard: React.FC<MagicCardProps> = ({ 
  children, 
  className = '', 
  glass = false,
  isAiMessage = false
}) => {
  return (
    <div className={`
      relative overflow-hidden transition-all duration-300
      ${glass ? 'glass-magic' : 'tactile-base bg-[var(--theme-surface)]'}
      ${isAiMessage ? 'border-2 border-[var(--theme-primary)]/30' : ''}
      ${className}
    `}>
      {isAiMessage && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--theme-accent)]/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
